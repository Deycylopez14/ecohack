import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/eco-tips', label: 'Eco-Tips', icon: 'star' },
  { to: '/juegos', label: 'Juegos', icon: 'sports_esports' },
  { to: '/mapa', label: 'Mapa', icon: 'location_on' },
  { to: '/comunidad', label: 'Comunidad', icon: 'chat' },
  { to: '/perfil', label: 'Perfil', icon: 'person' }
]

export default function NavBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around py-2 z-50 shadow-lg no-print md:py-3"
      role="navigation"
      aria-label="Navegación principal"
      style={{
        height: '64px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.12)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `nav-item flex flex-col items-center text-xs px-1 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 rounded transition-all duration-200 min-w-0 flex-1 md:px-2${isActive ? ' font-bold' : ''}`
          }
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            background: 'transparent'
          })}
          tabIndex={0}
        >
          <span
            className="nav-icon material-icons text-xl mb-0.5 md:text-2xl transition-transform duration-200 hover:scale-110"
            aria-hidden="true"
            style={{ color: 'inherit' }}
          >
            {item.icon}
          </span>
          <span className="truncate text-xs leading-tight">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}