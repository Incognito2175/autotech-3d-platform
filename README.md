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

- **Motor:** MySQL (base de datos `autotech_db` ya creada)
- **Tablas incluidas:** `categorias`, `piezas`, `guias_reparacion`, `pasos_guia`, `relaciones_acople`

La base de datos **NO se sube al repo**. Cada persona que clone el proyecto debe:
1. Tener MySQL instalado
2. Crear la base de datos: `CREATE DATABASE autotech_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. Configurar `DATABASE_URL` en su `.env`
4. Ejecutar `flask init-db` para crear tablas y datos de ejemplo

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
