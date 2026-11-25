import { Link, useLocation } from 'react-router-dom'
import ApiStatus from './ApiStatus.jsx'

export default function Navbar() {
  const { pathname } = useLocation()

  const isActive = (path) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top" id="mainNavbar">
      <div className="container-fluid px-lg-5">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <i className="fas fa-gear brand-icon" />
          <span className="brand-text">
            AUTOTECH <span className="text-accent">3D</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
          aria-controls="navContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fas fa-bars text-white" />
        </button>

        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                <i className="fas fa-house me-1" /> Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/catalogo') ? 'active' : ''}`} to="/catalogo">
                <i className="fas fa-boxes-stacked me-1" /> Catálogo
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/visor3d') ? 'active' : ''}`} to="/visor3d">
                <i className="fas fa-cube me-1" /> Visor 3D
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/guias') ? 'active' : ''}`} to="/guias">
                <i className="fas fa-book-open me-1" /> Guías
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <ApiStatus compact />
            <a
              href="https://github.com/Incognito2175/autotech-3d-platform"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
              style={{ borderRadius: '6px', fontSize: '0.8rem' }}
            >
              <i className="fab fa-github" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
