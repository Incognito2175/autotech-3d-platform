# 🚗 AutoTech 3D Platform

Plataforma web de ingeniería y consulta técnica automotriz separada en **Backend (Flask API REST)** y **Frontend (React + Vite + Three.js)**, conectada a **MySQL**.

---

## 🌟 Funcionalidades Principales

1. **Visor 3D Interactivo (`/visor3d`)**:
   - Modelado procedural WebGL con **Three.js**: Bloque de Motor (4 Cilindros), Pistón y Biela Forjada, Bujía de Encendido Iridio, Disco de Freno Ventilado, Alternador Trifásico 12V 120A, Engranaje Helicoidal de Transmisión y Amortiguador MacPherson con Resorte.
   - Simulación de **desensamblaje / ensamblaje** (vista explotada), rotación automática y modo malla (Wireframe).
   - Selección interactiva con **Raycasting** + vínculo con fichas técnicas y guías en MySQL.

2. **Catálogo Técnico de Componentes (`/catalogo`)**:
   - Búsqueda instantánea y filtros por categoría desde MySQL.
   - Modal de vista rápida, ficha completa con relaciones de acople y creación de nuevas piezas (`POST /api/piezas`).

3. **Guías y Procedimientos de Reparación (`/guias`)**:
   - Manuales técnicos paso a paso con barra de progreso interactiva, advertencias de seguridad y enlace directo al modelo 3D.

4. **API REST JSON (`/api/...`)**:
   - Endpoints para monitoreo (`/`, `/health`, `/api/health`), categorías, piezas, guías y relaciones de acople.
   - Todas las respuestas incluyen las cabeceras `X-App-Name: Autotech-3D-Platform` y `X-App-Status: Connected`.

---

## 🏗️ Estructura del Proyecto

```text
autotech-3d-platform/
├── backend/                     ← API REST en Flask (Python + SQLAlchemy + MySQL)
│   ├── app/
│   │   ├── __init__.py          ← Fábrica Flask, CORS, /, /health y CLI
│   │   ├── config.py            ← Configuración dev/test/prod
│   │   ├── models.py            ← Modelos SQLAlchemy
│   │   ├── routes.py            ← Endpoints /api/*
│   │   └── seed.py              ← Datos iniciales del dominio automotriz
│   ├── migrations/              ← Migraciones Alembic (Flask-Migrate)
│   ├── tests/                   ← Pruebas unitarias y de integración (pytest)
│   ├── .env.example
│   ├── requirements.txt
│   └── wsgi.py
└── frontend/                    ← Aplicación Web en React + Vite + Three.js
    ├── src/
    │   ├── api.js               ← Cliente HTTP hacia el backend
    │   ├── components/          ← Navbar, Footer, ApiStatus
    │   └── pages/               ← Inicio, Catalogo, DetallePieza, Visor3D, Guias, DetalleGuia
    ├── vite.config.js           ← Proxy /api -> http://localhost:5000
    ├── .env.example
    └── package.json
```

---

## 💻 Ejecución Local en Desarrollo

### 1. Backend (Flask API)

```bash
cd backend
python -m venv venv

# Activar entorno virtual:
# En Git Bash (Windows):
source venv/Scripts/activate
# En PowerShell (Windows):
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env
```

Edita `backend/.env` con tus credenciales de MySQL:
```env
DATABASE_URL=mysql+pymysql://root:TU_CONTRASEÑA@localhost:3306/autotech_db
```
*(Si no tiene contraseña: `mysql+pymysql://root:@localhost:3306/autotech_db`)*

Verifica la BD e inicia el servidor:
```bash
flask check-db
# Si está vacía, ejecuta: flask init-db
flask run --port 5000
```

### 2. Frontend (React + Vite + Three.js)

Abre **otra terminal**:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Abre en tu navegador: **`http://localhost:5173`**

---

## 📮 Endpoints para Postman (`http://localhost:5000`)

| Método | URL | Descripción |
|--------|-----|-------------|
| `GET` | `/` | Mensaje de bienvenida y lista de endpoints |
| `GET` | `/api/health` | Estado de la app y conexión a MySQL |
| `GET` | `/api/categorias` | Listar todas las categorías |
| `POST` | `/api/categorias` | Crear una categoría |
| `GET` | `/api/piezas` | Listar todas las piezas (`?categoria_id=1` o `?q=texto`) |
| `GET` | `/api/piezas/:id` | Detalle de pieza con relaciones de acople |
| `POST` | `/api/piezas` | Crear una pieza |
| `PUT` | `/api/piezas/:id` | Actualizar una pieza |
| `DELETE` | `/api/piezas/:id` | Eliminar una pieza |
| `GET` | `/api/guias` | Listar guías (`?pieza_id=` o `?dificultad=facil\|medio\|dificil`) |
| `GET` | `/api/guias/:id` | Detalle de guía con pasos |
| `POST` | `/api/guias` | Crear una guía |
| `GET` | `/api/relaciones/:pieza_id` | Relaciones de acople de una pieza |
| `POST` | `/api/relaciones` | Crear relación de acople |
