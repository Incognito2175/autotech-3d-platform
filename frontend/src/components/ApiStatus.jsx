import { useEffect, useState } from 'react'
import { checkHealth } from '../api.js'

export default function ApiStatus({ compact = false }) {
  const [estado, setEstado] = useState('loading')
  const [info, setInfo] = useState(null)

  const verificar = () => {
    setEstado('loading')
    checkHealth()
      .then((data) => {
        setInfo(data)
        setEstado('ok')
      })
      .catch(() => {
        setEstado('error')
      })
  }

  useEffect(() => {
    verificar()
    const timer = setInterval(verificar, 30000)
    return () => clearInterval(timer)
  }, [])

  if (compact) {
    if (estado === 'ok') {
      return (
        <span
          className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 d-inline-flex align-items-center gap-1"
          style={{ fontSize: '0.75rem' }}
          title={info?.message || 'API conectada'}
        >
          <span className="status-dot status-ok" /> API Online
        </span>
      )
    }
    if (estado === 'loading') {
      return (
        <span
          className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 d-inline-flex align-items-center gap-1"
          style={{ fontSize: '0.75rem' }}
        >
          <span className="status-dot status-loading" /> Conectando...
        </span>
      )
    }
    return (
      <span
        onClick={verificar}
        role="button"
        className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 d-inline-flex align-items-center gap-1"
        style={{ fontSize: '0.75rem', cursor: 'pointer' }}
        title="Haz clic para reintentar conexión con el backend en :5000"
      >
        <span className="status-dot status-error" /> API Offline (reintentar)
      </span>
    )
  }

  const estilos = {
    loading: { dot: 'status-loading', texto: 'Conectando con el backend...', color: '#f59e0b' },
    ok: { dot: 'status-ok', texto: info?.message || 'Conectado con la API', color: '#10b981' },
    error: { dot: 'status-error', texto: 'Backend desconectado (verifica puerto :5000)', color: '#ef4444' },
  }
  const { dot, texto, color } = estilos[estado]

  return (
    <div
      onClick={estado === 'error' ? verificar : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${color}40`,
        borderRadius: '999px',
        padding: '.4rem 1rem',
        fontSize: '.83rem',
        color,
        fontWeight: 600,
        cursor: estado === 'error' ? 'pointer' : 'default',
      }}
    >
      <span className={`status-dot ${dot}`} />
      <span>{texto}</span>
      {estado === 'ok' && info?.version && (
        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>v{info.version}</span>
      )}
    </div>
  )
}
