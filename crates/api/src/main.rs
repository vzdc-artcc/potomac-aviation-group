mod audit;
mod auth;
mod config;
mod error;
mod handlers;
mod middleware;
mod models;
mod routes;
mod state;

use actix_cors::Cors;
use actix_web::{App, HttpServer, middleware::Logger, web};
use sqlx::postgres::PgPoolOptions;
use tracing_subscriber::EnvFilter;

use crate::config::AppConfig;
use crate::middleware::request_context_middleware;
use crate::routes::configure;
use crate::state::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env().add_directive("info".parse().expect("valid log level")))
        .init();

    let config = AppConfig::from_env();
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .map_err(|error| std::io::Error::other(error.to_string()))?;

    let state = AppState {
        config: config.clone(),
        pool,
    };
    let web_origin = config.web_origin.clone();
    let bind_addr = config.bind_addr.clone();

    HttpServer::new(move || {
        let cors = if let Some(origin) = web_origin.clone() {
            Cors::default()
                .allowed_origin(&origin)
                .allow_any_header()
                .allow_any_method()
                .supports_credentials()
        } else {
            Cors::permissive()
        };

        App::new()
            .app_data(web::Data::new(state.clone()))
            .wrap(Logger::default())
            .wrap(cors)
            .wrap(actix_web::middleware::from_fn(request_context_middleware))
            .configure(configure)
    })
        .bind(&bind_addr)?
        .run()
        .await
}
