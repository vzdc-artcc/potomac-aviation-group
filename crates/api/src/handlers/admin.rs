use actix_web::{HttpRequest, HttpResponse, web};
use serde::Deserialize;
use serde_json::json;

use crate::audit::write_audit_event;
use crate::auth::{ensure_role, require_user};
use crate::error::ApiError;
use crate::models::{AuditEvent, MessageResponse};
use crate::state::AppState;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateAuditRequest {
    pub target_resource_type: String,
    pub target_resource_id: Option<String>,
    pub action: String,
    pub summary: serde_json::Value,
}

pub async fn user_audits(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    ensure_role(&actor.role, "admin")?;

    let events = sqlx::query_as::<_, AuditEvent>(
        r#"
        SELECT id, actor_user_id, target_resource_type, target_resource_id, action, request_id, summary, created_at
        FROM audit_events
        ORDER BY created_at DESC
        LIMIT 100
        "#,
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(HttpResponse::Ok().json(events))
}

pub async fn create_user_audit(
    state: web::Data<AppState>,
    req: HttpRequest,
    payload: web::Json<CreateAuditRequest>,
) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    ensure_role(&actor.role, "admin")?;
    write_audit_event(
        &state.pool,
        Some(&actor),
        &payload.target_resource_type,
        payload.target_resource_id.as_deref(),
        &payload.action,
        Some(&req),
        payload.summary.clone(),
    )
    .await;

    Ok(HttpResponse::Created().json(MessageResponse {
        message: "audit event recorded".to_string(),
    }))
}

pub async fn logs(state: web::Data<AppState>, req: HttpRequest) -> Result<HttpResponse, ApiError> {
    let actor = require_user(&req, &state).await?;
    ensure_role(&actor.role, "admin")?;

    let rows = sqlx::query_as::<_, crate::models::RequestLog>(
        r#"
        SELECT id, request_id, method, path, status_code, duration_ms, created_at
        FROM request_logs
        ORDER BY created_at DESC
        LIMIT 100
        "#,
    )
    .fetch_all(&state.pool)
    .await?;

    let logs = rows
        .into_iter()
        .map(|row| json!({
            "id": row.id,
            "requestId": row.request_id,
            "method": row.method,
            "path": row.path,
            "statusCode": row.status_code,
            "durationMs": row.duration_ms,
            "createdAt": row.created_at,
        }))
        .collect::<Vec<_>>();

    Ok(HttpResponse::Ok().json(logs))
}
