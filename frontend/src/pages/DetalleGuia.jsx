import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGuia } from '../api.js'

export default function DetalleGuia() {
  const { id } = useParams()
  const [guia, setGuia] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getGuia(id)
      .then(setGuia)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner" />
  if (error) return <div className="alert alert-error">{error}</div>
  if (!guia) return null

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/guias" style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
          <i className="fas fa-arrow-left" /> Volver a las guías
        </Link>
      </div>

      {/* Header de la guía */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
          <span className={`badge badge-${guia.dificultad}`}>{guia.dificultad}</span>
          {guia.tiempo_estimado && (
            <span style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
              <i className="fas fa-clock" /> {guia.tiempo_estimado}
            </span>
          )}
          <span style={{ color: 'var(--accent-blue)', fontSize: '.85rem' }}>
            <i className="fas fa-wrench" /> {guia.pieza_nombre}
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '.75rem' }}>{guia.titulo}</h1>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{guia.descripcion}</p>
      </div>

      {/* Pasos */}
      {guia.pasos && guia.pasos.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
            <i className="fas fa-list-ol" style={{ marginRight: '8px', color: '#f59e0b' }} />
            Pasos de la reparación
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {guia.pasos.map((paso) => (
              <div key={paso.id} className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div
                    style={{
                      minWidth: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '.9rem',
                      flexShrink: 0,
                    }}
                  >
                    {paso.numero_paso}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '.5rem' }}>{paso.titulo}</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: paso.advertencia ? '1rem' : 0 }}>
                      {paso.instruccion}
                    </p>
                    {paso.advertencia && (
                      <div
                        style={{
                          background: 'rgba(239,68,68,.1)',
                          border: '1px solid rgba(239,68,68,.3)',
                          borderRadius: '8px',
                          padding: '.75rem 1rem',
                          fontSize: '.85rem',
                          color: '#fca5a5',
                        }}
                      >
                        <i className="fas fa-triangle-exclamation" style={{ marginRight: '6px' }} />
                        {paso.advertencia}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
