"""
Fábrica de la aplicación Flask — Autotech 3D Backend API.

Separa completamente el backend del frontend.
El backend sirve JSON puro (API REST) y permite peticiones CORS desde el frontend.
"""

import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import text

from app.config import config_by_name
from app.models import db
from app.routes import api

migrate = Migrate()


def create_app(config_name=None):
    """
    Crea y configura la instancia de la aplicación Flask (API REST).

    Args:
        config_name: 'development' | 'testing' | 'production'
    """
    app = Flask(__name__)

    # Cargar .env antes de leer variables de configuración si python-dotenv está disponible
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except ImportError:
        pass

    # Determinar configuración
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")
    app.config.from_object(config_by_name.get(config_name, config_by_name["default"]))

    # Sobrescribir con variables de entorno si están definidas (excepto cuando se pide 'testing' explícito)
    if config_name != "testing":
        if os.environ.get("DATABASE_URL"):
            app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
        if os.environ.get("SECRET_KEY"):
            app.config["SECRET_KEY"] = os.environ["SECRET_KEY"]
        if os.environ.get("CORS_ORIGINS"):
            app.config["CORS_ORIGINS"] = [
                o.strip() for o in os.environ["CORS_ORIGINS"].split(",") if o.strip()
            ]

    # -------------------------------------------------------------------------
    # CORS: permite que el frontend React consuma la API desde otro puerto/origen
    # -------------------------------------------------------------------------
    CORS(
        app,
        resources={
            r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")},
            r"/health": {"origins": app.config.get("CORS_ORIGINS", "*")},
        },
        supports_credentials=True,
    )

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)

    # Registrar blueprint de la API (/api/*)
    app.register_blueprint(api)

    # -------------------------------------------------------------------------
    # Cabecera identificadora en cada respuesta (útil para verificar en Postman)
    # -------------------------------------------------------------------------
    @app.after_request
    def add_app_headers(response):
        response.headers["X-App-Name"] = "Autotech-3D-Platform"
        response.headers["X-App-Status"] = "Connected"
        return response

    # -------------------------------------------------------------------------
    # Rutas raíz y de monitoreo directo (/ y /health)
    # -------------------------------------------------------------------------
    @app.route("/")
    def root():
        """Mensaje de bienvenida en la raíz para pruebas rápidas en Postman/navegador."""
        return jsonify({
            "status": "ok",
            "app": "Autotech 3D API",
            "version": "1.0.0",
            "message": "Conectado correctamente al Backend de Autotech 3D Platform",
            "endpoints": {
                "health": "/api/health",
                "categorias": "/api/categorias",
                "piezas": "/api/piezas",
                "guias": "/api/guias",
                "relaciones": "/api/relaciones/<pieza_id>",
            },
        }), 200

    @app.route("/health")
    def health_root():
        """Alias de monitoreo en /health (compatible con CI/CD y Nginx)."""
        db.session.execute(text("SELECT 1"))
        return jsonify({
            "status": "ok",
            "app": "Autotech 3D API",
            "database": "connected",
            "message": "Conexión establecida correctamente con la aplicación",
        }), 200

    # -------------------------------------------------------------------------
    # Manejadores de error globales — siempre devuelven JSON
    # -------------------------------------------------------------------------
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Recurso no encontrado", "code": 404}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"error": "Método HTTP no permitido", "code": 405}), 405

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Error interno del servidor", "code": 500}), 500

    # -------------------------------------------------------------------------
    # Comandos CLI de Flask
    # -------------------------------------------------------------------------
    @app.cli.command("seed")
    def seed_command():
        """Poblar la base de datos con datos de ejemplo."""
        from app.seed import seed_database
        seed_database()
        print("Datos de semilla insertados correctamente.")

    @app.cli.command("init-db")
    def init_db_command():
        """Crear tablas si no existen e insertar datos de semilla si la BD está vacía."""
        db.create_all()
        from app.seed import seed_database
        seed_database()
        print("Base de datos lista.")

    @app.cli.command("check-db")
    def check_db_command():
        """Verificar conexión a la base de datos."""
        try:
            db.session.execute(text("SELECT 1"))
            from app.models import Categoria, Pieza, GuiaReparacion
            print("Conexión a la base de datos exitosa")
            print(f"   Categorías : {Categoria.query.count()}")
            print(f"   Piezas     : {Pieza.query.count()}")
            print(f"   Guías      : {GuiaReparacion.query.count()}")
        except Exception as e:
            print(f"Error de conexión: {e}")

    return app
