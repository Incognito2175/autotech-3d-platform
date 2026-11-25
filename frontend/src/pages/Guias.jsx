import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGuias } from '../api.js'

export default function Guias() {
  const [guias, setGuias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getGuias()
      .then(setGuias)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="page-hero">
        <h1><i className="fas fa-book-open" style={{ marginRight: '10px', color: '#f59e0b' }} />Guías de Reparación</h1>
        <p>Instrucciones técnicas paso a paso con advertencias de seguridad y tiempos estimados</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="grid grid-2">
          {guias.map((guia) => (
            <Link to={`/guias/${guia.id}`} key={guia.id} className="card" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '.75rem' }}>
                <span className={`badge badge-${guia.dificultad}`}>{guia.dificultad}</span>
                {guia.tiempo_estimado && (
                  <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>
                    <i className="fas fa-clock" /> {guia.tiempo_estimado}
                  </span>
                )}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: '.4rem' }}>{guia.titulo}</h3>
              <p style={{ color: 'var(--accent-blue)', fontSize: '.8rem', marginBottom: '.5rem' }}>
                <i className="fas fa-wrench" /> {guia.pieza_nombre}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', lineHeight: 1.6 }}>
                {guia.descripcion?.slice(0, 100)}...
              </p>
              <div style={{ marginTop: '1rem', color: '#f59e0b', fontSize: '.85rem', fontWeight: 600 }}>
                Ver pasos <i className="fas fa-arrow-right" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
