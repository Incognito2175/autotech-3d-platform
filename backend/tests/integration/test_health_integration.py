"""
Pruebas de integración para Autotech 3D Backend API.
"""

from wsgi import app


def test_health_con_mysql():
    """Verifica que /health y /api/health respondan HTTP 200 con BD activa."""
    client = app.test_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json()["status"] == "ok"

    api_response = client.get("/api/health")
    assert api_response.status_code == 200
    assert api_response.get_json()["status"] == "ok"
