import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPieza, getRelaciones } from '../api.js'

export default function DetallePieza() {
  const { id } = useParams()
  const [pieza, setPieza] = useState(null)
  const [relaciones, setRelaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getPieza(id, true), getRelaciones(id)])
      .then(([p, rels]) => {
        setPieza(p)
        setRelaciones(rels)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner" />
  if (error) return <div className="alert alert-error">{error}</div>
  if (!pieza) return null

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/catalogo" style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>
          <i className="fas fa-arrow-left" /> Volver al catálogo
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: 'var(--accent-blue)', fontSize: '.85rem', fontWeight: 600 }}>
              {pieza.categoria_nombre}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '.25rem' }}>{pieza.nombre}</h1>
          </div>
        </div>

        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.7 }}>{pieza.descripcion}</p>

        {pieza.funcion && (
          <div style={{ marginTop: '1.25rem', background: 'rgba(0,212,255,.07)', borderLeft: '3px solid var(--accent-blue)', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
            <strong style={{ color: 'var(--accent-blue)' }}>Función principal:</strong>
            <p style={{ marginTop: '.4rem', color: 'var(--text-muted)' }}>{pieza.funcion}</p>
          </div>
        )}
      </div>

      {relaciones.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 700 }}>
            <i className="fas fa-link" style={{ marginRight: '8px', color: 'var(--accent)' }} />
            Relaciones de Acople
          </h2>
          <div className="grid grid-2">
            {relaciones.map((rel) => {
              const esParte = rel.pieza_origen_id === parseInt(id)
              const otra = esParte ? rel.pieza_destino_nombre : rel.pieza_origen_nombre
              const otraId = esParte ? rel.pieza_destino_id : rel.pieza_origen_id

              const tipoIconos = {
                conecta_con: 'fa-link',
                se_ensambla_en: 'fa-puzzle-piece',
                requiere: 'fa-circle-exclamation',
              }

              return (
                <Link to={`/catalogo/${otraId}`} key={rel.id} className="card" style={{ display: 'block' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.5rem' }}>
                    <i className={`fas ${tipoIconos[rel.tipo_relacion] || 'fa-link'}`} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontWeight: 700 }}>{otra}</span>
                  </div>
                  <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{rel.tipo_relacion.replace(/_/g, ' ')}</span>
                  {rel.descripcion && (
                    <p style={{ marginTop: '.5rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>{rel.descripcion}</p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
