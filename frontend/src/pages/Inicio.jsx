import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus.jsx'
import { getCategorias, getGuias, getPiezas } from '../api.js'

export default function Inicio() {
  const [stats, setStats] = useState({ categorias: 0, piezas: 0, guias: 0 })

  useEffect(() => {
    Promise.all([getCategorias(), getPiezas(), getGuias()])
      .then(([cats, piezas, guias]) => {
        setStats({
          categorias: cats.length,
          piezas: piezas.length,
          guias: guias.length,
        })
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section py-5 px-3 rounded-4 mb-5 position-relative overflow-hidden shadow-lg border border-secondary-subtle">
        <div className="hero-overlay" />
        <div className="container py-lg-4 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <div className="mb-3">
                <ApiStatus />
              </div>

              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{
                  background: 'rgba(233, 69, 96, 0.15)',
                  border: '1px solid rgba(233, 69, 96, 0.3)',
                }}
              >
                <i className="fas fa-bolt text-accent" />
                <span className="text-white small fw-semibold">
                  Ingeniería Automotriz &amp; Tecnologías Web 3D
                </span>
              </div>

              <h1
                className="display-5 fw-bold mb-3"
                style={{ fontFamily: 'var(--font-display)', letterSpacing: '1px' }}
              >
                Plataforma de <span className="text-accent">Mecánica</span> y{' '}
                <span style={{ color: '#00d4ff' }}>Electricidad</span>
              </h1>

              <p className="lead text-muted mb-4" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                Aprende la función, arquitectura y resolución de fallas de componentes automotrices
                con visualización interactiva 3D, ensamblaje virtual y guías técnicas paso a paso.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/visor3d"
                  className="btn btn-lg px-4 fw-semibold text-white d-flex align-items-center gap-2 shadow"
                  style={{ background: 'var(--accent)', borderRadius: '8px' }}
                >
                  <i className="fas fa-cube" /> Abrir Visor 3D
                </Link>
                <Link
                  to="/catalogo"
                  className="btn btn-lg btn-outline-light px-4 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="fas fa-boxes-stacked" /> Ver Catálogo de Piezas
                </Link>
                <Link
                  to="/guias"
                  className="btn btn-lg btn-outline-info px-4 fw-semibold d-flex align-items-center gap-2"
                  style={{ borderRadius: '8px' }}
                >
                  <i className="fas fa-book-open" /> Guías de Reparación
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center mt-5 mt-lg-0">
              <div
                className="p-4 rounded-4"
                style={{
                  background: 'rgba(18, 18, 42, 0.78)',
                  border: '1px solid rgba(0, 212, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '4.5rem', animation: 'float 3s ease-in-out infinite' }}>
                  ⚙️
                </div>
                <h4 className="mt-3 text-white fw-bold">Gemelo Digital 3D</h4>
                <p className="text-muted small">
                  Explora despieces en tiempo real directamente en tu navegador sin instalar
                  complementos.
                </p>
                <div className="d-flex justify-content-around mt-4 pt-3 border-top border-secondary-subtle">
                  <div>
                    <h3 className="fw-bold text-accent mb-0">{stats.piezas || '15+'}</h3>
                    <small className="text-muted">Componentes</small>
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: '#00d4ff' }}>
                      {stats.categorias || 5}
                    </h3>
                    <small className="text-muted">Sistemas</small>
                  </div>
                  <div>
                    <h3 className="fw-bold text-warning mb-0">{stats.guias || 3}</h3>
                    <small className="text-muted">Guías</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Módulos Principales */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div
            className="card h-100 p-4 border-0 shadow"
            style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 rounded-3"
              style={{
                width: '50px',
                height: '50px',
                background: 'rgba(0, 212, 255, 0.15)',
                color: '#00d4ff',
              }}
            >
              <i className="fas fa-wrench fa-lg" />
            </div>
            <h4 className="text-white fw-bold mb-2">Catálogo Técnico</h4>
            <p className="text-muted small mb-4">
              Consulta especificaciones, función en el vehículo, material y relaciones de acople de
              cada pieza mecánica y eléctrica.
            </p>
            <Link
              to="/catalogo"
              className="mt-auto text-decoration-none fw-semibold"
              style={{ color: '#00d4ff' }}
            >
              Explorar catálogo <i className="fas fa-arrow-right ms-1" />
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card h-100 p-4 border-0 shadow"
            style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-accent)',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 rounded-3"
              style={{
                width: '50px',
                height: '50px',
                background: 'var(--accent-glow)',
                color: 'var(--accent)',
              }}
            >
              <i className="fas fa-cubes fa-lg" />
            </div>
            <h4 className="text-white fw-bold mb-2">Visor 3D Interactivo</h4>
            <p className="text-muted small mb-4">
              Desarma y acopla piezas automotrices con WebGL y Three.js. Inspecciona pistones,
              bujías, alternador y frenos con vistas explotadas.
            </p>
            <Link to="/visor3d" className="mt-auto text-decoration-none fw-semibold text-accent">
              Interactuar en 3D <i className="fas fa-arrow-right ms-1" />
            </Link>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card h-100 p-4 border-0 shadow"
            style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center mb-3 rounded-3"
              style={{
                width: '50px',
                height: '50px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
              }}
            >
              <i className="fas fa-clipboard-list fa-lg" />
            </div>
            <h4 className="text-white fw-bold mb-2">Guías de Reparación</h4>
            <p className="text-muted small mb-4">
              Instrucciones técnicas paso a paso con advertencias de seguridad, tiempos estimados y
              nivel de dificultad para resolver fallas.
            </p>
            <Link
              to="/guias"
              className="mt-auto text-decoration-none fw-semibold"
              style={{ color: '#f59e0b' }}
            >
              Ver manuales técnicos <i className="fas fa-arrow-right ms-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
