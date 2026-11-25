import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getGuia } from '../api.js'

export default function DetalleGuia() {
  const { id } = useParams()
  const [guia, setGuia] = useState(null)
  const [completados, setCompletados] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    getGuia(id)
      .then((data) => {
        setGuia(data)
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const togglePaso = (pasoId) => {
    setCompletados((prev) => ({ ...prev, [pasoId]: !prev[pasoId] }))
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status" />
      </div>
    )
  }
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!guia) return null

  const totalPasos = guia.pasos ? guia.pasos.length : 0
  const numCompletados = guia.pasos
    ? guia.pasos.filter((p) => completados[p.id]).length
    : 0
  const progreso = totalPasos > 0 ? Math.round((numCompletados / totalPasos) * 100) : 0

  const badgeClass =
    guia.dificultad === 'facil'
      ? 'bg-success-subtle text-success border border-success-subtle'
      : guia.dificultad === 'medio'
        ? 'bg-warning-subtle text-warning border border-warning-subtle'
        : 'bg-danger-subtle text-danger border border-danger-subtle'

  return (
    <div className="mb-5">
      <div className="mb-4">
        <Link
          to="/guias"
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 mb-3"
        >
          <i className="fas fa-arrow-left" /> Volver a todas las guías
        </Link>

        <div
          className="p-4 rounded-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <span
              className="badge"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.9rem',
              }}
            >
              <i className="fas fa-clock me-1" /> Tiempo estimado: {guia.tiempo_estimado}
            </span>

            <div className="d-flex flex-wrap gap-2">
              <span className={`badge ${badgeClass}`} style={{ fontSize: '0.85rem' }}>
                Dificultad: {(guia.dificultad || 'medio').toUpperCase()}
              </span>
              <Link
                to={`/visor3d?pieza=${encodeURIComponent(guia.pieza_nombre || '')}`}
                className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
              >
                <i className="fas fa-cube" /> Inspeccionar {guia.pieza_nombre} en 3D
              </Link>
            </div>
          </div>

          <h1 className="h2 fw-bold text-white mb-2">{guia.titulo}</h1>
          <p className="text-muted lead fs-6 mb-3">{guia.descripcion}</p>

          {totalPasos > 0 && (
            <div>
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Progreso del procedimiento</span>
                <span>
                  {numCompletados} / {totalPasos} pasos ({progreso}%)
                </span>
              </div>
              <div className="progress" style={{ height: '7px', background: 'rgba(0,0,0,0.4)' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${progreso}%`, background: 'var(--accent)' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <h3 className="h4 fw-bold text-white mb-3">
        <i className="fas fa-clipboard-check text-accent me-2" />
        Procedimiento Técnico Detallado
      </h3>

      <div className="row g-3">
        {(guia.pasos || []).map((paso) => {
          const done = !!completados[paso.id]
          return (
            <div className="col-12" key={paso.id}>
              <div
                className={`card p-3 border-0 shadow-sm guide-step-card ${done ? 'completed' : ''}`}
              >
                <div className="d-flex align-items-center justify-content-between gap-3 mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="badge rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: done ? '#2ecc71' : 'var(--accent)',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {done ? <i className="fas fa-check" /> : paso.numero_paso}
                    </span>
                    <h5 className="text-white mb-0 fw-semibold">{paso.titulo}</h5>
                  </div>
                  <button
                    type="button"
                    className={`btn btn-sm ${done ? 'btn-success' : 'btn-outline-secondary'}`}
                    onClick={() => togglePaso(paso.id)}
                  >
                    {done ? 'Completado' : 'Marcar paso'}
                  </button>
                </div>

                <p className="text-muted ps-5 mb-2" style={{ lineHeight: 1.6 }}>
                  {paso.instruccion}
                </p>

                {paso.advertencia && (
                  <div
                    className="ms-5 p-2 rounded-2 d-flex align-items-center gap-2"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      fontSize: '0.85rem',
                    }}
                  >
                    <i className="fas fa-triangle-exclamation text-danger" />
                    <span>
                      <strong>Precaución de seguridad:</strong> {paso.advertencia}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
