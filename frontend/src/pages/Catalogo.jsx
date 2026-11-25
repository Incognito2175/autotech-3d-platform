import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategorias, getPiezas } from '../api.js'

export default function Catalogo() {
  const [categorias, setCategorias] = useState([])
  const [piezas, setPiezas] = useState([])
  const [filtro, setFiltro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([getCategorias(), getPiezas(filtro)])
      .then(([cats, ps]) => {
        setCategorias(cats)
        setPiezas(ps)
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [filtro])

  return (
    <div>
      <div className="page-hero">
        <h1><i className="fas fa-boxes-stacked" style={{ marginRight: '10px', color: 'var(--accent-blue)' }} />Catálogo de Piezas</h1>
        <p>Consulta especificaciones y relaciones de acople de cada componente automotriz</p>
      </div>

      {/* Filtros de categoría */}
      <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`btn btn-sm ${!filtro ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFiltro(null)}
        >
          Todas
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.id}
            className={`btn btn-sm ${filtro === cat.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFiltro(cat.id)}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error"><i className="fas fa-triangle-exclamation" /> {error}</div>}
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="grid grid-2">
          {piezas.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No hay piezas en esta categoría.</p>
          )}
          {piezas.map((pieza) => (
            <Link to={`/catalogo/${pieza.id}`} key={pieza.id} className="card" style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: 700, marginBottom: '.4rem' }}>{pieza.nombre}</h3>
                <span
                  style={{
                    fontSize: '.75rem',
                    padding: '.2rem .6rem',
                    borderRadius: '999px',
                    background: 'rgba(0,212,255,.15)',
                    color: 'var(--accent-blue)',
                    flexShrink: 0,
                    marginLeft: '1rem',
                  }}
                >
                  {pieza.categoria_nombre}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '.88rem', lineHeight: 1.6 }}>
                {pieza.descripcion?.slice(0, 110)}...
              </p>
              <div style={{ marginTop: '1rem', color: 'var(--accent)', fontSize: '.85rem', fontWeight: 600 }}>
                Ver detalle <i className="fas fa-arrow-right" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
