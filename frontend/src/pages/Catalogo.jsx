import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createPieza, getCategorias, getPieza, getPiezas } from '../api.js'

const CATEGORY_COLORS = {
  Motor: { bg: 'rgba(231, 76, 60, 0.12)', text: '#e74c3c', border: 'rgba(231, 76, 60, 0.3)' },
  Frenos: { bg: 'rgba(52, 152, 219, 0.12)', text: '#3498db', border: 'rgba(52, 152, 219, 0.3)' },
  'Sistema Eléctrico': {
    bg: 'rgba(241, 196, 15, 0.12)',
    text: '#f1c40f',
    border: 'rgba(241, 196, 15, 0.3)',
  },
  Transmisión: {
    bg: 'rgba(46, 204, 113, 0.12)',
    text: '#2ecc71',
    border: 'rgba(46, 204, 113, 0.3)',
  },
  Suspensión: {
    bg: 'rgba(155, 89, 182, 0.12)',
    text: '#9b59b6',
    border: 'rgba(155, 89, 182, 0.3)',
  },
}

const DEFAULT_COLOR = {
  bg: 'rgba(233, 69, 96, 0.12)',
  text: '#e94560',
  border: 'rgba(233, 69, 96, 0.3)',
}

const CATEGORY_ICONS = {
  Motor: 'fas fa-cog',
  Frenos: 'fas fa-compact-disc',
  'Sistema Eléctrico': 'fas fa-bolt',
  Transmisión: 'fas fa-gears',
  Suspensión: 'fas fa-car',
}

export default function Catalogo() {
  const [categorias, setCategorias] = useState([])
  const [piezas, setPiezas] = useState([])
  const [filtroCat, setFiltroCat] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal de vista rápida de pieza
  const [modalPieza, setModalPieza] = useState(null)
  const [loadingModal, setLoadingModal] = useState(false)

  // Modal para crear nueva pieza (conectado a POST /api/piezas)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState({
    nombre: '',
    categoria_id: '',
    descripcion: '',
    funcion: '',
  })
  const [saving, setSaving] = useState(false)

  const cargarDatos = () => {
    setLoading(true)
    Promise.all([getCategorias(), getPiezas(filtroCat)])
      .then(([cats, ps]) => {
        setCategorias(cats)
        setPiezas(ps)
        if (!form.categoria_id && cats.length > 0) {
          setForm((prev) => ({ ...prev, categoria_id: String(cats[0].id) }))
        }
        setError(null)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargarDatos()
  }, [filtroCat])

  const piezasFiltradas = piezas.filter((p) => {
    if (!searchTerm.trim()) return true
    const q = searchTerm.toLowerCase()
    return (
      p.nombre.toLowerCase().includes(q) ||
      (p.descripcion || '').toLowerCase().includes(q) ||
      (p.categoria_nombre || '').toLowerCase().includes(q)
    )
  })

  const abrirModalDetalle = async (pieza) => {
    setModalPieza(pieza)
    setLoadingModal(true)
    try {
      const detalle = await getPieza(pieza.id, true)
      setModalPieza(detalle)
    } catch {
      // mantiene datos base si falla detalle
    } finally {
      setLoadingModal(false)
    }
  }

  const handleCrearPieza = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.categoria_id) return
    setSaving(true)
    try {
      await createPieza({
        nombre: form.nombre.trim(),
        categoria_id: Number(form.categoria_id),
        descripcion: form.descripcion.trim(),
        funcion: form.funcion.trim(),
      })
      setShowCreateModal(false)
      setForm({
        nombre: '',
        categoria_id: categorias[0] ? String(categorias[0].id) : '',
        descripcion: '',
        funcion: '',
      })
      cargarDatos()
    } catch (err) {
      alert('Error al crear pieza: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header + Buscador */}
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h1 className="h2 fw-bold text-white mb-1">
            <i className="fas fa-boxes-stacked text-accent me-2" />
            Catálogo de Piezas Automotrices
          </h1>
          <p className="text-muted small mb-0">
            Explora las piezas mecánicas y eléctricas, su función, especificaciones y acceso al
            modelo 3D.
          </p>
        </div>
        <div className="col-md-6 mt-3 mt-md-0 d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-dark border-secondary-subtle text-muted">
              <i className="fas fa-search" />
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary-subtle text-white"
              placeholder="Buscar pieza por nombre, categoría o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-accent text-nowrap"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus me-1" /> Nueva
          </button>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div
        className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 p-3 rounded-3"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
      >
        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn btn-filter ${filtroCat === null ? 'active' : ''}`}
            onClick={() => setFiltroCat(null)}
          >
            <i className="fas fa-layer-group me-1" /> Todas
          </button>
          {categorias.map((cat) => (
            <button
              type="button"
              key={cat.id}
              className={`btn btn-filter ${filtroCat === cat.id ? 'active' : ''}`}
              onClick={() => setFiltroCat(cat.id)}
            >
              <i className={`${CATEGORY_ICONS[cat.nombre] || 'fas fa-tag'} me-1`} />
              {cat.nombre}
            </button>
          ))}
        </div>
        <div className="text-muted small">
          <i className="fas fa-th-list me-1" /> {piezasFiltradas.length} pieza
          {piezasFiltradas.length !== 1 ? 's' : ''}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-triangle-exclamation me-2" />
          Error al cargar el catálogo: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-info mb-3" role="status" />
          <p className="text-muted">Cargando componentes automotrices desde la base de datos...</p>
        </div>
      ) : piezasFiltradas.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search" />
          <h5>Sin resultados</h5>
          <p>No se encontraron piezas que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="row g-3 mb-5">
          {piezasFiltradas.map((pieza) => {
            const colors = CATEGORY_COLORS[pieza.categoria_nombre] || DEFAULT_COLOR
            const icon = CATEGORY_ICONS[pieza.categoria_nombre] || 'fas fa-cog'
            return (
              <div className="col-xl-3 col-lg-4 col-md-6" key={pieza.id}>
                <div className="part-card" onClick={() => abrirModalDetalle(pieza)}>
                  <div className="part-card-icon">
                    <i className={icon} />
                  </div>
                  <span
                    className="part-card-category"
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    {pieza.categoria_nombre || 'Sin categoría'}
                  </span>
                  <h5 className="part-card-name">{pieza.nombre}</h5>
                  <p className="part-card-desc">
                    {(pieza.descripcion || '').length > 95
                      ? `${pieza.descripcion.slice(0, 95)}…`
                      : pieza.descripcion}
                  </p>
                  <div className="part-card-action">
                    <span>
                      <i className="fas fa-info-circle me-1" /> Ver detalles
                    </span>
                    <Link
                      to={`/visor3d?pieza=${encodeURIComponent(pieza.nombre)}`}
                      className="text-info text-decoration-none"
                      onClick={(e) => e.stopPropagation()}
                      title="Abrir en Visor 3D"
                    >
                      <i className="fas fa-cube" /> 3D
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal de Detalle Rápido */}
      {modalPieza && (
        <div
          className="modal show d-block"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setModalPieza(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-content"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-accent)',
                borderRadius: '16px',
                color: 'var(--text-primary)',
              }}
            >
              <div className="modal-header border-bottom border-secondary-subtle">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <i className="fas fa-microchip text-accent" />
                  <span>{modalPieza.nombre}</span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalPieza(null)}
                />
              </div>

              <div className="modal-body p-4">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="badge" style={{ background: 'var(--accent)', fontSize: '0.85rem' }}>
                    {modalPieza.categoria_nombre}
                  </span>
                  <span className="badge bg-secondary" style={{ fontSize: '0.85rem' }}>
                    ID: {modalPieza.id}
                  </span>
                </div>

                <h6 className="text-info fw-semibold mb-2">Descripción General:</h6>
                <p className="text-muted" style={{ lineHeight: 1.6 }}>
                  {modalPieza.descripcion || 'Sin descripción registrada.'}
                </p>

                {modalPieza.funcion && (
                  <>
                    <h6 className="text-info fw-semibold mt-3 mb-2">Función en el Vehículo:</h6>
                    <p className="text-light small" style={{ lineHeight: 1.6 }}>
                      {modalPieza.funcion}
                    </p>
                  </>
                )}

                <h6 className="text-info fw-semibold mt-4 mb-2">Relaciones de Acople:</h6>
                {loadingModal ? (
                  <div className="small text-muted">Cargando relaciones...</div>
                ) : modalPieza.relaciones && modalPieza.relaciones.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {modalPieza.relaciones.map((rel) => (
                      <li
                        key={rel.id}
                        className="p-2 mb-2 rounded-2"
                        style={{ background: 'rgba(255,255,255,0.03)' }}
                      >
                        <span className="badge bg-info-subtle text-info me-2">
                          {rel.tipo_relacion.replace(/_/g, ' ')}
                        </span>
                        <strong className="text-white">
                          {rel.pieza_origen_nombre} → {rel.pieza_destino_nombre}
                        </strong>
                        {rel.descripcion && (
                          <div className="text-muted small mt-1">{rel.descripcion}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted small mb-0">Sin relaciones de acople registradas.</p>
                )}
              </div>

              <div className="modal-footer border-top border-secondary-subtle">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalPieza(null)}
                >
                  Cerrar
                </button>
                <Link
                  to={`/catalogo/${modalPieza.id}`}
                  className="btn btn-outline-info"
                  onClick={() => setModalPieza(null)}
                >
                  <i className="fas fa-file-lines me-1" /> Ficha Completa
                </Link>
                <Link
                  to={`/visor3d?pieza=${encodeURIComponent(modalPieza.nombre)}`}
                  className="btn btn-accent d-flex align-items-center gap-2"
                  onClick={() => setModalPieza(null)}
                >
                  <i className="fas fa-cube" /> Ver en Visor 3D
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Pieza */}
      {showCreateModal && (
        <div
          className="modal show d-block"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <form
              onSubmit={handleCrearPieza}
              className="modal-content"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-accent)',
                borderRadius: '16px',
              }}
            >
              <div className="modal-header border-bottom border-secondary-subtle">
                <h5 className="modal-title fw-bold text-white">Nueva Pieza Automotriz</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCreateModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small text-muted">Nombre *</label>
                  <input
                    type="text"
                    required
                    className="form-control bg-dark border-secondary text-white"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Categoría *</label>
                  <select
                    required
                    className="form-select bg-dark border-secondary text-white"
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  >
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small text-muted">Descripción</label>
                  <textarea
                    rows="3"
                    className="form-control bg-dark border-secondary text-white"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small text-muted">Función en el vehículo</label>
                  <textarea
                    rows="2"
                    className="form-control bg-dark border-secondary text-white"
                    value={form.funcion}
                    onChange={(e) => setForm({ ...form, funcion: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer border-top border-secondary-subtle">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="btn btn-accent">
                  {saving ? 'Guardando...' : 'Guardar en BD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
