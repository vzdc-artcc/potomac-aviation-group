use actix_web::{HttpRequest, HttpResponse, web};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::audit::{mutation_summary, write_audit_event};
use crate::auth::{ensure_role, is_self_or_admin, require_user};
use crate::error::ApiError;
use crate::models::{UserRecord, UserResponse};
use crate::state::AppState;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateUserRequest {
    pub display_name: Option<String>,
    pub email: Option<String>,
    pub role: Option<String>,
    pub is_active: Option<bool>,
}

pub async fn list_users(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    ensure_role(&actor.role, "admin")?;

    let users = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        "#,
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(HttpResponse::Ok().json(users.into_iter().map(UserResponse::from).collect::<Vec<_>>()))
}

pub async fn get_user(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let target_id = path.into_inner();
    let target = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
        "#,
    )
    .bind(target_id)
    .fetch_one(&state.pool)
    .await?;

    if !is_self_or_admin(actor.id, target.id, &actor.role) {
        return Err(ApiError::forbidden("insufficient privileges"));
    }

    Ok(HttpResponse::Ok().json(UserResponse::from(target)))
}

pub async fn update_user(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    payload: web::Json<UpdateUserRequest>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let target_id = path.into_inner();
    let before = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
        "#,
    )
    .bind(target_id)
    .fetch_one(&state.pool)
    .await?;

    if !is_self_or_admin(actor.id, before.id, &actor.role) {
        return Err(ApiError::forbidden("insufficient privileges"));
    }

    if let Some(role) = &payload.role {
        ensure_role(&actor.role, "admin")?;
        if role != "member" && role != "staff" && role != "admin" {
            return Err(ApiError::bad_request("invalid role"));
        }
    }

    let updated = sqlx::query_as::<_, UserRecord>(
        r#"
        UPDATE users
        SET
            display_name = COALESCE($2, display_name),
            email = COALESCE($3, email),
            role = COALESCE($4, role),
            is_active = COALESCE($5, is_active),
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, display_name, email, password_hash, role, is_active, created_at, updated_at
        "#,
    )
    .bind(target_id)
    .bind(payload.display_name.clone())
    .bind(payload.email.clone())
    .bind(payload.role.clone())
    .bind(payload.is_active)
    .fetch_one(&state.pool)
    .await?;

    write_audit_event(
        &state.pool,
        Some(&actor),
        "user",
        Some(&updated.id.to_string()),
        "update",
        Some(&req),
        mutation_summary(Some(json!(UserResponse::from(before))), Some(json!(UserResponse::from(updated.clone())))),
    )
    .await;

    Ok(HttpResponse::Ok().json(UserResponse::from(updated)))
}

pub async fn delete_user(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    ensure_role(&actor.role, "admin")?;
    let target_id = path.into_inner();
    let before = sqlx::query_as::<_, UserRecord>(
        r#"
        SELECT id, display_name, email, password_hash, role, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
        "#,
    )
    .bind(target_id)
    .fetch_one(&state.pool)
    .await?;

    sqlx::query("DELETE FROM users WHERE id = $1")
        .bind(target_id)
        .execute(&state.pool)
        .await?;

    write_audit_event(
        &state.pool,
        Some(&actor),
        "user",
        Some(&target_id.to_string()),
        "delete",
        Some(&req),
        mutation_summary(Some(json!(UserResponse::from(before))), None),
    )
    .await;

    Ok(HttpResponse::Ok().json(json!({
        "message": "user deleted"
    })))
}
