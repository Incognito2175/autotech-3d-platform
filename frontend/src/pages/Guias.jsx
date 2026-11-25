import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGuias } from '../api.js'

export default function Guias() {
  const [guias, setGuias] = useState([])
  const [dificultad, setDificultad] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getGuias(null, dificultad)
      .then((data) => {
        setGuias(data)
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [dificultad])

  const badgeClass = (dif) => {
    if (dif === 'facil') return 'bg-success-subtle text-success border border-success-subtle'
    if (dif === 'medio') return 'bg-warning-subtle text-warning border border-warning-subtle'
    return 'bg-danger-subtle text-danger border border-danger-subtle'
  }

  return (
    <div>
      <div className="row align-items-center mb-4">
        <div className="col-md-8">
          <h1 className="h2 fw-bold text-white mb-1">
            <i className="fas fa-book-open text-warning me-2" />
            Guías y Procedimientos Técnicos
          </h1>
          <p className="text-muted small mb-0">
            Manuales paso a paso para el diagnóstico, desmontaje, reparación y mantenimiento
            preventivo de componentes del automóvil.
          </p>
        </div>
        <div className="col-md-4 mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
          {[
            { value: null, label: 'Todas' },
            { value: 'facil', label: 'Fácil' },
            { value: 'medio', label: 'Medio' },
            { value: 'dificil', label: 'Difícil' },
          ].map((f) => (
            <button
              key={f.label}
              type="button"
              className={`btn btn-filter ${dificultad === f.value ? 'active' : ''}`}
              onClick={() => setDificultad(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status" />
        </div>
      ) : guias.length === 0 ? (
        <div className="col-12 text-center py-5">
          <p className="text-muted">No hay guías de reparación disponibles en este momento.</p>
        </div>
      ) : (
        <div className="row g-4 mb-5">
          {guias.map((guia) => (
            <div className="col-lg-4 col-md-6" key={guia.id}>
              <div
                className="card h-100 border-0 shadow"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div className="p-4 flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#f59e0b',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <i className="fas fa-clock me-1" /> {guia.tiempo_estimado || 'N/A'}
                    </span>
                    <span className={`badge ${badgeClass(guia.dificultad)}`}>
                      {(guia.dificultad || 'medio').toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-white fw-bold mb-2" style={{ fontSize: '1.15rem' }}>
                    {guia.titulo}
                  </h4>
                  <p className="text-muted small mb-3" style={{ lineHeight: 1.5 }}>
                    {(guia.descripcion || '').length > 160
                      ? `${guia.descripcion.slice(0, 160)}...`
                      : guia.descripcion}
                  </p>
                  <div className="small text-info mb-2">
                    <i className="fas fa-wrench me-1" /> Componente:{' '}
                    <strong>{guia.pieza_nombre}</strong>
                  </div>
                </div>

                <div className="p-3 border-top border-secondary-subtle bg-dark bg-opacity-25 d-flex justify-content-between align-items-center">
                  <Link
                    to={`/guias/${guia.id}`}
                    className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
                  >
                    <i className="fas fa-list-check" /> Ver procedimiento
                  </Link>
                  <Link
                    to={`/visor3d?pieza=${encodeURIComponent(guia.pieza_nombre || '')}`}
                    className="btn btn-sm btn-outline-secondary"
                    title="Ver pieza en 3D"
                  >
                    <i className="fas fa-cube" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
