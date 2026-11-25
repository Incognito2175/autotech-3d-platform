"""
Módulo de configuración de la aplicación Autotech 3D Platform — Backend API.
"""

import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))


class Config:
    """Configuración base compartida por todos los entornos."""
    SECRET_KEY = os.environ.get("SECRET_KEY", "clave-secreta-desarrollo-autotech")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    CORS_ORIGINS = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000",
    ).split(",")


class DevelopmentConfig(Config):
    """Configuración para el entorno de desarrollo local con MySQL."""
    DEBUG = True
    # Por defecto usa MySQL local. Si no tienes contraseña: root:@localhost
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://root:@localhost:3306/autotech_db",
    )


class TestingConfig(Config):
    """Configuración para el entorno de pruebas automatizadas."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Configuración para el entorno de producción con MySQL."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")

    @classmethod
    def init_app(cls, app):
        if not cls.SQLALCHEMY_DATABASE_URI:
            raise ValueError(
                "La variable de entorno DATABASE_URL es obligatoria en producción."
            )


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
