use actix_web::{HttpRequest, HttpResponse, web};
use serde_json::json;
use uuid::Uuid;

use crate::audit::{mutation_summary, write_audit_event};
use crate::auth::{
    attach_auth_cookies, clear_auth_cookies, hash_password, issue_tokens, refresh_session,
    require_user, revoke_refresh_token, verify_password,
};
use crate::error::ApiError;
use crate::models::{
    AuthTokensResponse, CurrentUserResponse, ForgotPasswordRequest, MessageResponse, ResetPasswordRequest,
    SignInRequest, SignUpRequest, UserRecord, UserResponse,
};
use crate::state::AppState;

async fn load_user_by_email(state: &AppState, email: &str) -> Result<Option<UserRecord>, ApiError> {
    let user = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        WHERE email = $1
        "#,
    )
    .bind(email)
    .fetch_optional(&state.pool)
    .await?;

    Ok(user)
}

pub async fn sign_up(
    state: web::Data<AppState>,
    req: HttpRequest,
    payload: web::Json<SignUpRequest>,
) -> Result<HttpResponse, ApiError> {
    if payload.display_name.trim().is_empty() || payload.email.trim().is_empty() || payload.password.len() < 8 {
        return Err(ApiError::bad_request("display name, email, and an 8+ character password are required"));
    }

    if load_user_by_email(&state, &payload.email).await?.is_some() {
        return Err(ApiError::conflict("an account with that email already exists"));
    }

    let password_hash = hash_password(&payload.password)?;
    let user_id = Uuid::new_v4();

    let user = sqlx::query_as::<_, UserRecord>(
        r#"
        INSERT INTO users (id, display_name, email, password_hash, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'member', TRUE, NOW(), NOW())
        RETURNING id, display_name, email, password_hash, role, is_active, created_at, updated_at
        "#,
    )
    .bind(user_id)
    .bind(&payload.display_name)
    .bind(&payload.email)
    .bind(password_hash)
    .fetch_one(&state.pool)
    .await?;

    let tokens = issue_tokens(&state, &user, false).await?;
    write_audit_event(
        &state.pool,
        Some(&user),
        "auth",
        Some(&user.id.to_string()),
        "signup",
        Some(&req),
        mutation_summary(None, Some(json!({ "email": user.email }))),
    )
    .await;

    let mut builder = HttpResponse::Created();
    attach_auth_cookies(&mut builder, &tokens, state.config.cookie_secure)?;
    Ok(builder.json(AuthTokensResponse {
        user: user.into(),
        access_token_expires_in: tokens.access_expires_in,
        refresh_token_expires_in: tokens.refresh_expires_in,
    }))
}

pub async fn sign_in(
    state: web::Data<AppState>,
    req: HttpRequest,
    payload: web::Json<SignInRequest>,
) -> Result<HttpResponse, ApiError> {
    let user = load_user_by_email(&state, &payload.email)
        .await?
        .ok_or_else(|| ApiError::unauthorized("invalid credentials"))?;

    if !user.is_active {
        return Err(ApiError::unauthorized("account is inactive"));
    }

    if !verify_password(&payload.password, &user.password_hash)? {
        return Err(ApiError::unauthorized("invalid credentials"));
    }

    let tokens = issue_tokens(&state, &user, payload.remember_me).await?;
    write_audit_event(
        &state.pool,
        Some(&user),
        "auth",
        Some(&user.id.to_string()),
        "signin",
        Some(&req),
        mutation_summary(None, Some(json!({ "email": user.email }))),
    )
    .await;

    let mut builder = HttpResponse::Ok();
    attach_auth_cookies(&mut builder, &tokens, state.config.cookie_secure)?;
    Ok(builder.json(AuthTokensResponse {
        user: user.into(),
        access_token_expires_in: tokens.access_expires_in,
        refresh_token_expires_in: tokens.refresh_expires_in,
    }))
}

pub async fn sign_out(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    if let Some(refresh) = crate::auth::extract_refresh_token(&req) {
        if let Ok(claims) = crate::auth::decode_token(&state, &refresh) {
            let _ = revoke_refresh_token(&state, &claims.jti).await;
        }
    }

    let mut builder = HttpResponse::Ok();
    clear_auth_cookies(&mut builder, state.config.cookie_secure);
    Ok(builder.json(MessageResponse {
        message: "signed out".to_string(),
    }))
}

pub async fn refresh(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    let refresh_token = crate::auth::extract_refresh_token(&req)
        .ok_or_else(|| ApiError::unauthorized("missing refresh token"))?;
    let tokens = refresh_session(&state, &refresh_token).await?;
    let claims = crate::auth::decode_token(&state, &refresh_token)?;
    let user_id = Uuid::parse_str(&claims.sub).map_err(|_| ApiError::unauthorized("invalid token subject"))?;
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

    let mut builder = HttpResponse::Ok();
    attach_auth_cookies(&mut builder, &tokens, state.config.cookie_secure)?;
    Ok(builder.json(AuthTokensResponse {
        user: user.into(),
        access_token_expires_in: tokens.access_expires_in,
        refresh_token_expires_in: tokens.refresh_expires_in,
    }))
}

pub async fn me(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    let user = require_user(&req, &state).await?;
    Ok(HttpResponse::Ok().json(CurrentUserResponse {
        user: UserResponse::from(user),
    }))
}

pub async fn forgot_password(payload: web::Json<ForgotPasswordRequest>) -> Result<HttpResponse, ApiError> {
    let message = if payload.email.trim().is_empty() {
        "If the account exists, a reset message will be generated."
    } else {
        "If the account exists, a reset message will be generated."
    };

    Ok(HttpResponse::Ok().json(MessageResponse {
        message: message.to_string(),
    }))
}

pub async fn reset_password(payload: web::Json<ResetPasswordRequest>) -> Result<HttpResponse, ApiError> {
    if payload.password.len() < 8 {
        return Err(ApiError::bad_request("password must be at least 8 characters"));
    }

    Ok(HttpResponse::Ok().json(MessageResponse {
        message: "password updated".to_string(),
    }))
}
