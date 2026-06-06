use std::time::{Duration, SystemTime, UNIX_EPOCH};

use actix_web::cookie::{time::Duration as CookieDuration, Cookie};
use actix_web::{HttpRequest, HttpResponseBuilder};
use bcrypt::{DEFAULT_COST, hash, verify};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use uuid::Uuid;

use crate::error::ApiError;
use crate::models::{Claims, RefreshTokenRecord, UserRecord};
use crate::state::AppState;

pub const ACCESS_COOKIE: &str = "pag_access_token";
pub const REFRESH_COOKIE: &str = "pag_refresh_token";

#[derive(Debug, Clone)]
pub struct TokenPair {
    pub access_token: String,
    pub refresh_token: String,
    pub access_expires_in: i64,
    pub refresh_expires_in: i64,
}

fn now_epoch() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_else(|_| Duration::from_secs(0))
        .as_secs() as i64
}

fn access_ttl(remember_me: bool) -> i64 {
    if remember_me {
        60 * 60 * 24
    } else {
        60 * 60
    }
}

fn refresh_ttl(remember_me: bool) -> i64 {
    if remember_me {
        60 * 60 * 24 * 30
    } else {
        60 * 60 * 24 * 7
    }
}

pub fn hash_password(password: &str) -> Result<String, ApiError> {
    Ok(hash(password, DEFAULT_COST)?)
}

pub fn verify_password(password: &str, password_hash: &str) -> Result<bool, ApiError> {
    Ok(verify(password, password_hash)?)
}

fn encode_token(state: &AppState, user: &UserRecord, token_type: &str, ttl_seconds: i64, jti: &str) -> Result<String, ApiError> {
    let iat = now_epoch();
    let claims = Claims {
        sub: user.id.to_string(),
        email: user.email.clone(),
        role: user.role.clone(),
        token_type: token_type.to_string(),
        jti: jti.to_string(),
        iss: state.config.issuer.clone(),
        iat,
        exp: iat + ttl_seconds,
    };

    Ok(encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_bytes()),
    )?)
}

pub fn decode_token(state: &AppState, token: &str) -> Result<Claims, ApiError> {
    let mut validation = Validation::default();
    validation.set_issuer(&[state.config.issuer.clone()]);
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(state.config.jwt_secret.as_bytes()),
        &validation,
    )?;
    Ok(token_data.claims)
}

pub async fn issue_tokens(
    state: &AppState,
    user: &UserRecord,
    remember_me: bool,
) -> Result<TokenPair, ApiError> {
    let access_jti = Uuid::new_v4().to_string();
    let refresh_jti = Uuid::new_v4().to_string();
    let access_expires_in = access_ttl(remember_me);
    let refresh_expires_in = refresh_ttl(remember_me);
    let access_token = encode_token(state, user, "access", access_expires_in, &access_jti)?;
    let refresh_token = encode_token(state, user, "refresh", refresh_expires_in, &refresh_jti)?;

    sqlx::query(
        r#"
        INSERT INTO refresh_tokens (jti, user_id, expires_at, revoked_at, remember_me)
        VALUES ($1, $2, NOW() + ($3 * INTERVAL '1 second'), NULL, $4)
        "#,
    )
    .bind(refresh_jti)
    .bind(user.id)
    .bind(refresh_expires_in)
    .bind(remember_me)
    .execute(&state.pool)
    .await?;

    Ok(TokenPair {
        access_token,
        refresh_token,
        access_expires_in,
        refresh_expires_in,
    })
}

pub fn attach_auth_cookies(
    builder: &mut HttpResponseBuilder,
    tokens: &TokenPair,
    secure: bool,
) -> Result<(), ApiError> {
    let access_cookie = Cookie::build(ACCESS_COOKIE, tokens.access_token.clone())
        .path("/")
        .http_only(true)
        .secure(secure)
        .same_site(actix_web::cookie::SameSite::Lax)
        .max_age(CookieDuration::seconds(tokens.access_expires_in))
        .finish();
    let refresh_cookie = Cookie::build(REFRESH_COOKIE, tokens.refresh_token.clone())
        .path("/")
        .http_only(true)
        .secure(secure)
        .same_site(actix_web::cookie::SameSite::Lax)
        .max_age(CookieDuration::seconds(tokens.refresh_expires_in))
        .finish();

    builder.cookie(access_cookie);
    builder.cookie(refresh_cookie);
    Ok(())
}

pub fn clear_auth_cookies(builder: &mut HttpResponseBuilder, secure: bool) {
    let access_cookie = Cookie::build(ACCESS_COOKIE, "")
        .path("/")
        .http_only(true)
        .secure(secure)
        .same_site(actix_web::cookie::SameSite::Lax)
        .max_age(CookieDuration::seconds(0))
        .finish();
    let refresh_cookie = Cookie::build(REFRESH_COOKIE, "")
        .path("/")
        .http_only(true)
        .secure(secure)
        .same_site(actix_web::cookie::SameSite::Lax)
        .max_age(CookieDuration::seconds(0))
        .finish();

    builder.cookie(access_cookie);
    builder.cookie(refresh_cookie);
}

pub fn extract_bearer_token(request: &HttpRequest) -> Option<String> {
    let header = request.headers().get(actix_web::http::header::AUTHORIZATION)?;
    let value = header.to_str().ok()?;
    value.strip_prefix("Bearer ").map(|value| value.to_owned())
}

pub fn extract_access_token(request: &HttpRequest) -> Option<String> {
    request
        .cookie(ACCESS_COOKIE)
        .map(|cookie| cookie.value().to_string())
        .or_else(|| extract_bearer_token(request))
}

pub fn extract_refresh_token(request: &HttpRequest) -> Option<String> {
    request.cookie(REFRESH_COOKIE).map(|cookie| cookie.value().to_string())
}

pub async fn require_user(request: &HttpRequest, state: &AppState) -> Result<UserRecord, ApiError> {
    let token = extract_access_token(request).ok_or_else(|| ApiError::unauthorized("missing access token"))?;
    let claims = decode_token(state, &token)?;

    if claims.token_type != "access" {
        return Err(ApiError::unauthorized("invalid access token"));
    }

    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| ApiError::unauthorized("invalid user id"))?;
    let user = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        WHERE id = $1 AND is_active = TRUE
        "#,
    )
    .bind(user_id)
    .fetch_one(&state.pool)
    .await?;

    Ok(user)
}

pub fn role_rank(role: &str) -> u8 {
    match role {
        "admin" => 3,
        "staff" => 2,
        "member" => 1,
        _ => 0,
    }
}

pub fn ensure_role(user_role: &str, required_role: &str) -> Result<(), ApiError> {
    if role_rank(user_role) < role_rank(required_role) {
        return Err(ApiError::forbidden("insufficient privileges"));
    }
    Ok(())
}

pub fn is_admin(user_role: &str) -> bool {
    role_rank(user_role) >= role_rank("admin")
}

pub fn is_self_or_admin(user_id: Uuid, target_id: Uuid, role: &str) -> bool {
    user_id == target_id || is_admin(role)
}

pub async fn revoke_refresh_token(state: &AppState, jti: &str) -> Result<(), ApiError> {
    sqlx::query(
        r#"
        UPDATE refresh_tokens
        SET revoked_at = NOW()
        WHERE jti = $1 AND revoked_at IS NULL
        "#,
    )
    .bind(jti)
    .execute(&state.pool)
    .await?;
    Ok(())
}

pub async fn refresh_session(state: &AppState, refresh_token: &str) -> Result<TokenPair, ApiError> {
    let claims = decode_token(state, refresh_token)?;
    if claims.token_type != "refresh" {
        return Err(ApiError::unauthorized("invalid refresh token"));
    }

    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| ApiError::unauthorized("invalid token subject"))?;
    let token_row = sqlx::query_as::<_, RefreshTokenRecord>(
        r#"
        SELECT revoked_at
        FROM refresh_tokens
        WHERE jti = $1 AND user_id = $2
        "#,
    )
    .bind(&claims.jti)
    .bind(user_id)
    .fetch_one(&state.pool)
    .await?;

    if token_row.revoked_at.is_some() {
        return Err(ApiError::unauthorized("refresh token revoked"));
    }

    let user = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        WHERE id = $1 AND is_active = TRUE
        "#,
    )
    .bind(user_id)
    .fetch_one(&state.pool)
    .await?;

    revoke_refresh_token(state, &claims.jti).await?;
    issue_tokens(state, &user, false).await
}
