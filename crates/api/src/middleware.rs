use std::time::Instant;

use actix_web::body::MessageBody;
use actix_web::dev::{ServiceRequest, ServiceResponse};
use actix_web::http::header::{HeaderName, HeaderValue};
use actix_web::middleware::Next;
use actix_web::{Error, HttpMessage, web};
use uuid::Uuid;

use crate::state::AppState;

pub async fn request_context_middleware<B: MessageBody>(
    req: ServiceRequest,
    next: Next<B>,
) -> Result<ServiceResponse<B>, Error> {
    let request_id = req
        .headers()
        .get("x-request-id")
        .and_then(|value| value.to_str().ok())
        .map(|value| value.to_owned())
        .unwrap_or_else(|| Uuid::new_v4().to_string());
    let method = req.method().to_string();
    let path = req.path().to_string();
    let state = req.app_data::<web::Data<AppState>>().cloned();
    req.extensions_mut().insert(request_id.clone());
    let started = Instant::now();

    let mut response: ServiceResponse<B> = next.call(req).await?;
    let status = response.status().as_u16();
    let duration_ms = started.elapsed().as_millis() as i32;

    if let Ok(header) = HeaderValue::from_str(&request_id) {
        response
            .headers_mut()
            .insert(HeaderName::from_static("x-request-id"), header);
    }

    tracing::info!(
        request_id = %request_id,
        method = %method,
        path = %path,
        status = status,
        duration_ms = duration_ms,
        "request completed"
    );

    if let Some(state) = state {
        let _ = sqlx::query(
            r#"
            INSERT INTO request_logs (request_id, method, path, status_code, duration_ms, created_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            "#,
        )
        .bind(request_id)
        .bind(method)
        .bind(path)
        .bind(i32::from(status))
        .bind(duration_ms)
        .execute(&state.pool)
        .await;
    }

    Ok(response)
}
