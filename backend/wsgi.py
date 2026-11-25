"""
Punto de entrada WSGI — Autotech 3D Backend API.

Uso:
  Desarrollo:  flask run --port 5000
  Producción:  gunicorn wsgi:app
"""

from app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
