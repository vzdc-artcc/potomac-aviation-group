use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub bind_addr: String,
    pub database_url: String,
    pub jwt_secret: String,
    pub cookie_secure: bool,
    pub web_origin: Option<String>,
    pub issuer: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();

        let bind_addr = env::var("BIND_ADDR").unwrap_or_else(|_| "0.0.0.0:8080".to_string());
        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
            "postgres://postgres:postgres@localhost:5432/potomac_aviation".to_string()
        });
        let jwt_secret =
            env::var("JWT_SECRET").unwrap_or_else(|_| "potomac-aviation-dev-secret".to_string());
        let cookie_secure = env::var("COOKIE_SECURE")
            .map(|value| matches!(value.as_str(), "1" | "true" | "TRUE" | "yes"))
            .unwrap_or(false);
        let web_origin = env::var("WEB_ORIGIN").ok();
        let issuer = env::var("JWT_ISSUER").unwrap_or_else(|_| "potomac-aviation".to_string());

        Self {
            bind_addr,
            database_url,
            jwt_secret,
            cookie_secure,
            web_origin,
            issuer,
        }
    }
}
