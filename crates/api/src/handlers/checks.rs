use actix_web::{HttpResponse, Responder};
use serde_json::json;

use crate::state::AppState;

pub async fn health() -> impl Responder {
    HttpResponse::Ok().json(json!({
        "status": "ok"
    }))
}

pub async fn ready(state: actix_web::web::Data<AppState>) -> impl Responder {
    let result = sqlx::query_scalar::<_, i32>("SELECT 1")
        .fetch_one(&state.pool)
        .await;

    match result {
        Ok(_) => HttpResponse::Ok().json(json!({
            "status": "ready"
        })),
        Err(error) => HttpResponse::ServiceUnavailable().json(json!({
            "status": "unready",
            "message": error.to_string()
        })),
    }
}
