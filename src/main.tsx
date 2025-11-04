import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import EcoTips from './pages/EcoTips'
import Juegos from './pages/Juegos'
import Mapa from './pages/MapaInteligente'
import Comunidad from './pages/Comunidad'
import Perfil from './pages/Perfil'
import NavBar from './components/NavBar'
import ThemeToggle from './components/ThemeToggle'
import Educacion from './pages/Educacion'
import Gamificacion from './pages/Gamificacion'
import './styles/index.css'

function AppLayout() {
  const location = useLocation()
  const hideNavBar = ['/login', '/register'].includes(location.pathname)
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ecotips" element={<EcoTips />} />
        <Route path="/eco-tips" element={<EcoTips />} />
        <Route path="/juegos" element={<Juegos />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/comunidad" element={<Comunidad />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/educacion" element={<Educacion />} />
        <Route path="/gamificacion" element={<Gamificacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {!hideNavBar && <NavBar />}
    </>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </React.StrictMode>
)
