"""
Configuración compartida de Pytest para el Backend Autotech 3D.
"""

import pytest
from app import create_app
from app.models import db
from app.seed import seed_database


@pytest.fixture()
def test_app():
    """Crea una instancia de aplicación configurada para pruebas en memoria."""
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        seed_database()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(test_app):
    """Cliente HTTP de pruebas para la API REST."""
    return test_app.test_client()
