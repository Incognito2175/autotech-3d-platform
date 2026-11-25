import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import Catalogo from './pages/Catalogo.jsx'
import DetalleGuia from './pages/DetalleGuia.jsx'
import DetallePieza from './pages/DetallePieza.jsx'
import Guias from './pages/Guias.jsx'
import Inicio from './pages/Inicio.jsx'
import Visor3D from './pages/Visor3D.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container-fluid px-lg-5 py-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<DetallePieza />} />
          <Route path="/visor3d" element={<Visor3D />} />
          <Route path="/guias" element={<Guias />} />
          <Route path="/guias/:id" element={<DetalleGuia />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
