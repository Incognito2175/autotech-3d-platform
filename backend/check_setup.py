"""
Script para verificar que el proyecto funciona correctamente.
Ejecutar con: python check_setup.py (desde la carpeta backend/)
"""

import sys
import os

print("=" * 60)
print("  AutoTech 3D — Verificación de configuración")
print("=" * 60)

errors = []
warnings = []

# 1. Verificar Python
print(f"\n✅ Python {sys.version.split()[0]}")

# 2. Verificar dependencias
deps = [
    ("flask", "Flask"),
    ("flask_sqlalchemy", "Flask-SQLAlchemy"),
    ("flask_migrate", "Flask-Migrate"),
    ("flask_cors", "Flask-CORS"),
    ("dotenv", "python-dotenv"),
]

print("\n📦 Dependencias:")
for module, name in deps:
    try:
        __import__(module)
        print(f"  ✅ {name}")
    except ImportError:
        print(f"  ❌ {name} — Instalar con: pip install -r requirements.txt")
        errors.append(name)

# 3. Verificar .env
print("\n⚙️  Configuración:")
if os.path.exists(".env"):
    print("  ✅ Archivo .env encontrado")
else:
    print("  ⚠️  No existe .env — Copiando desde .env.example...")
    if os.path.exists(".env.example"):
        import shutil
        shutil.copy(".env.example", ".env")
        print("  ✅ .env creado automáticamente")
    else:
        warnings.append(".env no encontrado")

# 4. Verificar base de datos
print("\n🗄️  Base de Datos:")
try:
    from app import create_app
    from app.models import db, Categoria

    app = create_app()
    with app.app_context():
        # Intentar crear tablas
        db.create_all()
        count = Categoria.query.count()
        if count == 0:
            print("  ⚠️  Base de datos vacía — Ejecutar: flask init-db")
            warnings.append("BD vacía")
        else:
            print(f"  ✅ BD operativa ({count} categorías cargadas)")
except Exception as e:
    print(f"  ❌ Error de BD: {e}")
    errors.append(str(e))

# Resumen
print("\n" + "=" * 60)
if errors:
    print(f"❌ {len(errors)} error(es) encontrado(s). Revisa los puntos arriba.")
    sys.exit(1)
elif warnings:
    print(f"⚠️  {len(warnings)} advertencia(s). El proyecto puede funcionar.")
else:
    print("🎉 Todo está configurado correctamente. Ejecuta:")
    print("   flask run --port 5000")
print("=" * 60)
