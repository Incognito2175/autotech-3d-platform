import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const links = [
    { to: '/', label: 'Inicio', icon: 'fa-house' },
    { to: '/catalogo', label: 'Catálogo', icon: 'fa-boxes-stacked' },
    { to: '/guias', label: 'Guías', icon: 'fa-book-open' },
  ]

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-gear" />
          Auto<span>Tech</span> 3D
        </Link>
        <ul className="navbar-links">
          {links.map(({ to, label, icon }) => (
            <li key={to}>
              <Link
                to={to}
                className={pathname === to ? 'active' : ''}
              >
                <i className={`fas ${icon}`} style={{ marginRight: '5px' }} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
