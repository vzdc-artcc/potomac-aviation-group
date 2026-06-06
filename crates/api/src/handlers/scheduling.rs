use actix_web::{HttpRequest, HttpResponse, web};
use serde_json::json;
use uuid::Uuid;

use crate::audit::{mutation_summary, write_audit_event};
use crate::auth::require_user;
use crate::error::ApiError;
use crate::models::{SchedulingEntry, UpsertRecordRequest};
use crate::state::AppState;

pub async fn list_scheduling(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let entries = sqlx::query_as::<_, SchedulingEntry>(
        r#"
        SELECT id, user_id, title, payload, created_at, updated_at
        FROM scheduling_entries
        WHERE user_id = $1 OR $2 = 'admin'
        ORDER BY created_at DESC
        "#,
    )
    .bind(actor.id)
    .bind(&actor.role)
    .fetch_all(&state.pool)
    .await?;

    Ok(HttpResponse::Ok().json(entries))
}

pub async fn create_scheduling(
    state: web::Data<AppState>,
    req: HttpRequest,
    payload: web::Json<UpsertRecordRequest>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let id = Uuid::new_v4();
    let title = payload
        .title
        .clone()
        .or_else(|| payload.payload.get("title").and_then(|value| value.as_str()).map(|value| value.to_owned()))
        .unwrap_or_else(|| "Schedule Item".to_string());

    let created = sqlx::query_as::<_, SchedulingEntry>(
        r#"
        INSERT INTO scheduling_entries (id, user_id, title, payload, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id, user_id, title, payload, created_at, updated_at
        "#,
    )
    .bind(id)
    .bind(actor.id)
    .bind(&title)
    .bind(payload.payload.clone())
    .fetch_one(&state.pool)
    .await?;

    write_audit_event(
        &state.pool,
        Some(&actor),
        "scheduling",
        Some(&created.id.to_string()),
        "create",
        Some(&req),
        mutation_summary(None, Some(json!(created))),
    )
    .await;

    Ok(HttpResponse::Created().json(created))
}

pub async fn get_scheduling(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let entry = sqlx::query_as::<_, SchedulingEntry>(
        r#"
        SELECT id, user_id, title, payload, created_at, updated_at
        FROM scheduling_entries
        WHERE id = $1
        "#,
    )
    .bind(path.into_inner())
    .fetch_one(&state.pool)
    .await?;

    if entry.user_id != actor.id && actor.role != "admin" {
        return Err(ApiError::forbidden("insufficient privileges"));
    }

    Ok(HttpResponse::Ok().json(entry))
}

pub async fn update_scheduling(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
    payload: web::Json<UpsertRecordRequest>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let before = sqlx::query_as::<_, SchedulingEntry>(
        r#"
        SELECT id, user_id, title, payload, created_at, updated_at
        FROM scheduling_entries
        WHERE id = $1
        "#,
    )
    .bind(path.into_inner())
    .fetch_one(&state.pool)
    .await?;

    if before.user_id != actor.id && actor.role != "admin" {
        return Err(ApiError::forbidden("insufficient privileges"));
    }

    let title = payload
        .title
        .clone()
        .or_else(|| payload.payload.get("title").and_then(|value| value.as_str()).map(|value| value.to_owned()))
        .unwrap_or_else(|| before.title.clone());

    let updated = sqlx::query_as::<_, SchedulingEntry>(
        r#"
        UPDATE scheduling_entries
        SET title = $2, payload = $3, updated_at = NOW()
        WHERE id = $1
        RETURNING id, user_id, title, payload, created_at, updated_at
        "#,
    )
    .bind(before.id)
    .bind(&title)
    .bind(payload.payload.clone())
    .fetch_one(&state.pool)
    .await?;

    write_audit_event(
        &state.pool,
        Some(&actor),
        "scheduling",
        Some(&updated.id.to_string()),
        "update",
        Some(&req),
        mutation_summary(Some(json!(before)), Some(json!(updated.clone()))),
    )
    .await;

    Ok(HttpResponse::Ok().json(updated))
}

pub async fn delete_scheduling(
    state: web::Data<AppState>,
    req: HttpRequest,
    path: web::Path<Uuid>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    let before = sqlx::query_as::<_, SchedulingEntry>(
        r#"
        SELECT id, user_id, title, payload, created_at, updated_at
        FROM scheduling_entries
        WHERE id = $1
        "#,
    )
    .bind(path.into_inner())
    .fetch_one(&state.pool)
    .await?;

    if before.user_id != actor.id && actor.role != "admin" {
        return Err(ApiError::forbidden("insufficient privileges"));
    }

    sqlx::query("DELETE FROM scheduling_entries WHERE id = $1")
        .bind(before.id)
        .execute(&state.pool)
        .await?;

    write_audit_event(
        &state.pool,
        Some(&actor),
        "scheduling",
        Some(&before.id.to_string()),
        "delete",
        Some(&req),
        mutation_summary(Some(json!(before)), None),
    )
    .await;

    Ok(HttpResponse::Ok().json(json!({
        "message": "scheduling entry deleted"
    })))
}
