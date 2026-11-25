import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Inicio from './pages/Inicio.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Guias from './pages/Guias.jsx'
import DetalleGuia from './pages/DetalleGuia.jsx'
import DetallePieza from './pages/DetallePieza.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container" style={{ padding: '1.5rem' }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<DetallePieza />} />
          <Route path="/guias" element={<Guias />} />
          <Route path="/guias/:id" element={<DetalleGuia />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
