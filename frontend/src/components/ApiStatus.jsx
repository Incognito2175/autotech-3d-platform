/**
 * ApiStatus.jsx
 * Muestra el estado de conexión con el backend en tiempo real.
 * Llama a GET /api/health y muestra: conectando → ok / error.
 */

import { useEffect, useState } from 'react'
import { checkHealth } from '../api.js'

export default function ApiStatus() {
  const [estado, setEstado] = useState('loading') // loading | ok | error
  const [info, setInfo] = useState(null)

  useEffect(() => {
    checkHealth()
      .then((data) => {
        setInfo(data)
        setEstado('ok')
      })
      .catch(() => {
        setEstado('error')
      })
  }, [])

  const estados = {
    loading: {
      dot: 'status-loading',
      texto: 'Conectando con el backend...',
      color: '#f59e0b',
    },
    ok: {
      dot: 'status-ok',
      texto: info?.message || 'Conectado',
      color: '#10b981',
    },
    error: {
      dot: 'status-error',
      texto: 'No se pudo conectar con el backend (¿está corriendo en :5000?)',
      color: '#ef4444',
    },
  }

  const { dot, texto, color } = estados[estado]

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${color}40`,
        borderRadius: '999px',
        padding: '.4rem 1rem',
        fontSize: '.85rem',
        color,
        fontWeight: 600,
      }}
    >
      <span className={`status-dot ${dot}`} />
      {texto}
      {estado === 'ok' && info?.version && (
        <span style={{ marginLeft: '.5rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          v{info.version}
        </span>
      )}
    </div>
  )
}
