import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getGuias, getPieza, getRelaciones } from '../api.js'

export default function DetallePieza() {
  const { id } = useParams()
  const [pieza, setPieza] = useState(null)
  const [relaciones, setRelaciones] = useState([])
  const [guiasRelacionadas, setGuiasRelacionadas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getPieza(id, true), getRelaciones(id), getGuias(id)])
      .then(([p, rels, gs]) => {
        setPieza(p)
        setRelaciones(rels)
        setGuiasRelacionadas(gs)
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-info" role="status" />
      </div>
    )
  }
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!pieza) return null

  return (
    <div className="mb-5">
      <div className="mb-3">
        <Link to="/catalogo" className="btn btn-sm btn-outline-secondary">
          <i className="fas fa-arrow-left me-1" /> Volver al catálogo
        </Link>
      </div>

      <div
        className="p-4 rounded-4 mb-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <span className="badge mb-2" style={{ background: 'var(--accent)' }}>
              {pieza.categoria_nombre}
            </span>
            <h1 className="h2 fw-bold text-white mb-2">{pieza.nombre}</h1>
          </div>
          <Link
            to={`/visor3d?pieza=${encodeURIComponent(pieza.nombre)}`}
            className="btn btn-accent d-inline-flex align-items-center gap-2"
          >
            <i className="fas fa-cube" /> Inspeccionar en Visor 3D
          </Link>
        </div>

        <p className="text-muted mt-3" style={{ lineHeight: 1.7 }}>
          {pieza.descripcion}
        </p>

        {pieza.funcion && (
          <div
            className="p-3 mt-3 rounded-3"
            style={{
              background: 'rgba(0, 212, 255, 0.08)',
              borderLeft: '4px solid #00d4ff',
            }}
          >
            <strong style={{ color: '#00d4ff' }}>Función principal en el vehículo:</strong>
            <p className="mb-0 mt-1 text-light small">{pieza.funcion}</p>
          </div>
        )}
      </div>

      {/* Relaciones de Acople */}
      {relaciones.length > 0 && (
        <div className="mb-4">
          <h4 className="fw-bold text-white mb-3">
            <i className="fas fa-link text-accent me-2" />
            Relaciones de Acople
          </h4>
          <div className="row g-3">
            {relaciones.map((rel) => {
              const esOrigen = rel.pieza_origen_id === Number(id)
              const otraPieza = esOrigen ? rel.pieza_destino_nombre : rel.pieza_origen_nombre
              const otraId = esOrigen ? rel.pieza_destino_id : rel.pieza_origen_id

              return (
                <div className="col-md-6" key={rel.id}>
                  <Link
                    to={`/catalogo/${otraId}`}
                    className="part-card text-decoration-none"
                    style={{ height: 'auto' }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold text-white">{otraPieza}</span>
                      <span className="badge bg-info-subtle text-info">
                        {rel.tipo_relacion.replace(/_/g, ' ')}
                      </span>
                    </div>
                    {rel.descripcion && (
                      <p className="text-muted small mb-0">{rel.descripcion}</p>
                    )}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Guías relacionadas */}
      {guiasRelacionadas.length > 0 && (
        <div>
          <h4 className="fw-bold text-white mb-3">
            <i className="fas fa-book-open text-warning me-2" />
            Guías de Reparación para esta Pieza
          </h4>
          <div className="row g-3">
            {guiasRelacionadas.map((g) => (
              <div className="col-md-6" key={g.id}>
                <Link
                  to={`/guias/${g.id}`}
                  className="part-card text-decoration-none"
                  style={{ height: 'auto' }}
                >
                  <h5 className="text-white fw-bold mb-1">{g.titulo}</h5>
                  <div className="small text-warning mb-2">
                    <i className="fas fa-clock me-1" /> {g.tiempo_estimado} · {g.dificultad}
                  </div>
                  <p className="text-muted small mb-0">{g.descripcion}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
