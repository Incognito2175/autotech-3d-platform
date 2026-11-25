# 🚗 AutoTech 3D Platform

Plataforma educativa de mecánica y electricidad automotriz con catálogo de piezas, visor 3D y guías de reparación paso a paso.

## 🏗️ Arquitectura

```
autotech-separado/
├── backend/    ← API REST con Flask (Python)
└── frontend/   ← Interfaz web con React + Vite
```

## ⚡ Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone <URL_DE_TU_REPO>
cd autotech-separado
```

### 2. Backend (Flask API)

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
.\venv\Scripts\Activate.ps1
# Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# (editar .env si necesitas cambiar algo)

# Inicializar base de datos con datos de ejemplo
flask init-db

# Correr el servidor
flask run --port 5000
```

> El backend queda disponible en **http://localhost:5000**

### 3. Frontend (React)

Abre **otra terminal**:

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Correr en desarrollo
npm run dev
```

> El frontend queda disponible en **http://localhost:5173**

## 🔑 Endpoints principales de la API

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/piezas` | Listar piezas |
| GET | `/api/piezas/:id` | Detalle de pieza |
| GET | `/api/guias` | Listar guías |
| GET | `/api/guias/:id` | Guía con pasos |
| POST | `/api/piezas` | Crear pieza |
| POST | `/api/guias` | Crear guía |

## 🗄️ Base de Datos

- **Desarrollo:** SQLite (se crea automáticamente con `flask init-db`)
- **Producción:** MySQL/PostgreSQL (configurar `DATABASE_URL` en `.env`)

La base de datos **no se sube al repositorio** (está en `.gitignore`).
Cada vez que clonas el proyecto debes ejecutar `flask init-db` para crearla.

## 🛠️ Variables de Entorno

### Backend (`backend/.env`)

```env
FLASK_ENV=development
FLASK_APP=wsgi.py
SECRET_KEY=tu-clave-secreta
DATABASE_URL=sqlite:///autotech.db
CORS_ORIGINS=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=/api
```

## 📋 Requisitos

- **Python** 3.10+
- **Node.js** 18+
- **pip** y **npm**
