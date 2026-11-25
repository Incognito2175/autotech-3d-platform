"""
Pruebas unitarias de monitoreo (/health y /api/health) con SQLite en memoria.
"""

from app import create_app
from app.models import db


def test_root_responde_200():
    """Verifica que la ruta raíz / confirme conexión con la API."""
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        client = app.test_client()
        response = client.get("/")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"
        assert data["app"] == "Autotech 3D API"
        assert response.headers.get("X-App-Name") == "Autotech-3D-Platform"


def test_health_responde_200():
    """Verifica que /health responda HTTP 200 con status ok."""
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        client = app.test_client()
        response = client.get("/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"


def test_api_health_responde_200():
    """Verifica que /api/health responda HTTP 200 con detalle de conexión."""
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        client = app.test_client()
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "ok"
        assert data["database"] == "connected"
