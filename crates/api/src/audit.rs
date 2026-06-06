use actix_web::HttpRequest;
use actix_web::HttpMessage;
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::UserRecord;

pub async fn write_audit_event(
    pool: &PgPool,
    actor: Option<&UserRecord>,
    resource_type: &str,
    resource_id: Option<&str>,
    action: &str,
    request: Option<&HttpRequest>,
    summary: serde_json::Value,
) {
    let request_id = request
        .and_then(|req| req.extensions().get::<String>().cloned())
        .or_else(|| {
            request
                .and_then(|req| req.headers().get("x-request-id"))
                .and_then(|header| header.to_str().ok())
                .map(|value| value.to_owned())
        });
    let actor_id = actor.map(|user| user.id);

    let _ = sqlx::query(
        r#"
        INSERT INTO audit_events (
            id, actor_user_id, target_resource_type, target_resource_id, action, request_id, summary, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(actor_id)
    .bind(resource_type)
    .bind(resource_id)
    .bind(action)
    .bind(request_id)
    .bind(summary)
    .execute(pool)
    .await;
}

pub fn mutation_summary(before: Option<serde_json::Value>, after: Option<serde_json::Value>) -> serde_json::Value {
    json!({
        "before": before,
        "after": after
    })
}
