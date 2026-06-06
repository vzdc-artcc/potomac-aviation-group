use actix_web::HttpResponse;
use serde_json::json;

pub async fn live_map() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "ok",
        "layer": "live-map",
        "items": []
    }))
}

pub async fn live() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "ok",
        "flights": []
    }))
}

pub async fn weather() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "ok",
        "summary": "No significant operational weather events."
    }))
}

pub async fn vatsim_atc() -> HttpResponse {
    HttpResponse::Ok().json(json!({
        "status": "ok",
        "controllers": []
    }))
}
