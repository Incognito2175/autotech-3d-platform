/**
 * api.js — Cliente centralizado para consumir el Backend Autotech 3D
 *
 * En desarrollo: Vite redirige /api → http://localhost:5000
 * En producción: configurar VITE_API_BASE_URL en .env
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// ─── Health ──────────────────────────────────────────────────────────────────
export const checkHealth = () => request('/health')

// ─── Categorías ──────────────────────────────────────────────────────────────
export const getCategorias = () => request('/categorias')
export const getCategoria = (id) => request(`/categorias/${id}`)
export const createCategoria = (data) =>
  request('/categorias', { method: 'POST', body: JSON.stringify(data) })

// ─── Piezas ──────────────────────────────────────────────────────────────────
export const getPiezas = (categoriaId = null, search = '') => {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoria_id', categoriaId)
  if (search && search.trim()) params.set('q', search.trim())
  const qs = params.toString() ? `?${params.toString()}` : ''
  return request(`/piezas${qs}`)
}

export const getPieza = (id, incluirRelaciones = true) =>
  request(`/piezas/${id}?incluir_relaciones=${incluirRelaciones}`)

export const createPieza = (data) =>
  request('/piezas', { method: 'POST', body: JSON.stringify(data) })

export const updatePieza = (id, data) =>
  request(`/piezas/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const deletePieza = (id) =>
  request(`/piezas/${id}`, { method: 'DELETE' })

// ─── Guías ───────────────────────────────────────────────────────────────────
export const getGuias = (piezaId = null, dificultad = null) => {
  const params = new URLSearchParams()
  if (piezaId) params.set('pieza_id', piezaId)
  if (dificultad) params.set('dificultad', dificultad)
  const qs = params.toString() ? `?${params.toString()}` : ''
  return request(`/guias${qs}`)
}

export const getGuia = (id) => request(`/guias/${id}?incluir_pasos=true`)

export const createGuia = (data) =>
  request('/guias', { method: 'POST', body: JSON.stringify(data) })

// ─── Relaciones ───────────────────────────────────────────────────────────────
export const getRelaciones = (piezaId) => request(`/relaciones/${piezaId}`)

export const createRelacion = (data) =>
  request('/relaciones', { method: 'POST', body: JSON.stringify(data) })
