use actix_web::HttpResponse;
use serde_json::json;

pub async fn aircraft() -> HttpResponse {
    HttpResponse::Ok().json(json!([
        { "code": "B738", "name": "Boeing 737-800", "status": "active" },
        { "code": "A321", "name": "Airbus A321", "status": "active" },
        { "code": "B752", "name": "Boeing 757-200", "status": "standby" }
    ]))
}

pub async fn airports() -> HttpResponse {
    HttpResponse::Ok().json(json!([
        { "icao": "KJFK", "name": "John F. Kennedy International", "status": "hub" },
        { "icao": "KATL", "name": "Hartsfield-Jackson Atlanta International", "status": "active" },
        { "icao": "KDEN", "name": "Denver International", "status": "active" }
    ]))
}

pub async fn routes() -> HttpResponse {
    HttpResponse::Ok().json(json!([
        { "origin": "KJFK", "destination": "KDEN", "distanceNm": 1420 },
        { "origin": "KLAX", "destination": "KORD", "distanceNm": 1548 },
        { "origin": "KSEA", "destination": "KATL", "distanceNm": 2189 }
    ]))
}

pub async fn weather() -> HttpResponse {
    HttpResponse::Ok().json(json!([
        { "airport": "KJFK", "trend": "stable", "visibility": "10+ mi" },
        { "airport": "KATL", "trend": "clear", "visibility": "10+ mi" }
    ]))
}
