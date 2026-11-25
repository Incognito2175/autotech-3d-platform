export default function Footer() {
  return (
    <footer
      className="footer mt-auto py-4 border-top border-secondary-subtle"
      style={{ background: 'rgba(10, 10, 25, 0.9)' }}
    >
      <div className="container-fluid px-lg-5 text-center text-muted">
        <div className="row align-items-center">
          <div className="col-md-6 text-md-start mb-2 mb-md-0">
            <span className="brand-text text-white me-2">
              AUTOTECH <span className="text-accent">3D</span>
            </span>
            <small>| Plataforma de Mecánica y Electricidad Automotriz</small>
          </div>
          <div className="col-md-6 text-md-end">
            <small>React • Flask API • SQLAlchemy • Three.js • MySQL</small>
          </div>
        </div>
      </div>
    </footer>
  )
}
