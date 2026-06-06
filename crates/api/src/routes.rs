use actix_web::web;

use crate::handlers::{admin, auth, checks, databases, logbook, operations, scheduling, users};

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/v1")
            .route("/health", web::get().to(checks::health))
            .route("/ready", web::get().to(checks::ready))
            .service(
                web::scope("/auth")
                    .route("/signup", web::post().to(auth::sign_up))
                    .route("/signin", web::post().to(auth::sign_in))
                    .route("/signout", web::post().to(auth::sign_out))
                    .route("/refresh", web::post().to(auth::refresh))
                    .route("/me", web::get().to(auth::me))
                    .route("/forgot-password", web::post().to(auth::forgot_password))
                    .route("/reset-password", web::post().to(auth::reset_password)),
            )
            .service(
                web::scope("/admin")
                    .route("/user-audits", web::get().to(admin::user_audits))
                    .route("/user-audits", web::post().to(admin::create_user_audit))
                    .route("/logs", web::get().to(admin::logs)),
            )
            .service(
                web::scope("/users")
                    .route("", web::get().to(users::list_users))
                    .route("/{id}", web::get().to(users::get_user))
                    .route("/{id}", web::put().to(users::update_user))
                    .route("/{id}", web::delete().to(users::delete_user)),
            )
            .service(
                web::scope("/logbook")
                    .route("", web::get().to(logbook::list_logbook))
                    .route("", web::post().to(logbook::create_logbook))
                    .route("/{id}", web::get().to(logbook::get_logbook))
                    .route("/{id}", web::put().to(logbook::update_logbook))
                    .route("/{id}", web::delete().to(logbook::delete_logbook)),
            )
            .service(
                web::scope("/scheduling")
                    .route("", web::get().to(scheduling::list_scheduling))
                    .route("", web::post().to(scheduling::create_scheduling))
                    .route("/{id}", web::get().to(scheduling::get_scheduling))
                    .route("/{id}", web::put().to(scheduling::update_scheduling))
                    .route("/{id}", web::delete().to(scheduling::delete_scheduling)),
            )
            .service(
                web::scope("/operations")
                    .route("/live-map", web::get().to(operations::live_map))
                    .route("/live", web::get().to(operations::live))
                    .route("/weather", web::get().to(operations::weather))
                    .route("/vatsim-atc", web::get().to(operations::vatsim_atc)),
            )
            .service(
                web::scope("/databases")
                    .route("/aircraft", web::get().to(databases::aircraft))
                    .route("/airports", web::get().to(databases::airports))
                    .route("/routes", web::get().to(databases::routes))
                    .route("/weather", web::get().to(databases::weather)),
            ),
    );
}
