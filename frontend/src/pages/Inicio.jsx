import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus.jsx'
import { getCategorias, getPiezas, getGuias } from '../api.js'

export default function Inicio() {
  const [stats, setStats] = useState({ categorias: 0, piezas: 0, guias: 0 })

  useEffect(() => {
    Promise.all([getCategorias(), getPiezas(), getGuias()])
      .then(([cats, piezas, guias]) => {
        setStats({ categorias: cats.length, piezas: piezas.length, guias: guias.length })
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <div style={{ padding: '3rem 0 2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <ApiStatus />
        </div>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚙️</div>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            marginBottom: '.75rem',
          }}
        >
          Plataforma de{' '}
          <span style={{ color: 'var(--accent)' }}>Mecánica</span> y{' '}
          <span style={{ color: 'var(--accent-blue)' }}>Electricidad</span>
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            fontSize: '1.1rem',
          }}
        >
          Aprende la función, arquitectura y resolución de fallas de componentes
          automotrices con guías técnicas paso a paso.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Categorías', value: stats.categorias, color: 'var(--accent-blue)' },
            { label: 'Piezas', value: stats.piezas, color: 'var(--accent)' },
            { label: 'Guías', value: stats.guias, color: '#f59e0b' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color }}>{value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/catalogo" className="btn btn-primary">
            <i className="fas fa-boxes-stacked" style={{ marginRight: '8px' }} />
            Ver Catálogo de Piezas
          </Link>
          <Link to="/guias" className="btn btn-outline">
            <i className="fas fa-book-open" style={{ marginRight: '8px' }} />
            Guías de Reparación
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-3" style={{ marginTop: '3rem' }}>
        {[
          {
            icon: 'fa-wrench',
            color: 'var(--accent-blue)',
            title: 'Catálogo Técnico',
            desc: 'Consulta especificaciones, función y relaciones de acople de cada pieza mecánica y eléctrica.',
            link: '/catalogo',
          },
          {
            icon: 'fa-bolt',
            color: 'var(--accent)',
            title: 'Sistema Eléctrico',
            desc: 'Alternador, bujías, batería y más. Todo el sistema eléctrico documentado con precisión.',
            link: '/catalogo',
          },
          {
            icon: 'fa-clipboard-list',
            color: '#f59e0b',
            title: 'Guías de Reparación',
            desc: 'Instrucciones paso a paso con advertencias de seguridad y tiempos estimados.',
            link: '/guias',
          },
        ].map(({ icon, color, title, desc, link }) => (
          <Link to={link} key={title} className="card" style={{ display: 'block' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color,
              }}
            >
              <i className={`fas ${icon} fa-lg`} />
            </div>
            <h3 style={{ marginBottom: '.5rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '.9rem', lineHeight: 1.6 }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
