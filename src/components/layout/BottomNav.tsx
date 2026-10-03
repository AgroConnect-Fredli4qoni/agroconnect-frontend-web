import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { useCart } from '../../features/catalog/CartContext'

/**
 * BottomNav renders a persistent, mobile-first bottom navigation bar conforming to platform mockups.
 *
 * @returns JSX Element presenting mobile bottom navigation bar.
 */
export function BottomNav(): React.JSX.Element {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const { totalItems } = useCart()

  const navItems = [
    {
      to: '/',
      label: 'Beranda',
      icon: Home,
      isActive: location.pathname === '/',
    },
    {
      to: '/catalog',
      label: 'Kategori',
      icon: LayoutGrid,
      isActive: location.pathname.startsWith('/catalog') || location.pathname.startsWith('/katalog'),
    },
    {
      to: '/cart',
      label: 'Keranjang',
      icon: ShoppingCart,
      isActive: location.pathname === '/cart',
      badge: totalItems > 0 ? totalItems : undefined,
    },
    {
      to: isAuthenticated ? '/dashboard' : '/login',
      label: 'Akun',
      icon: User,
      isActive:
        location.pathname.startsWith('/dashboard') ||
        location.pathname.startsWith('/login') ||
        location.pathname.startsWith('/profile') ||
        location.pathname.startsWith('/register'),
    },
  ]

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 py-1.5 px-4 flex items-center justify-around lg:hidden shadow-lg"
    >
      {navItems.map((item) => {
        const IconComponent = item.icon
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[64px] transition-colors cursor-pointer ${
              item.isActive
                ? 'text-emerald-700 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <div className="relative">
              <IconComponent size={20} className={item.isActive ? 'text-emerald-700' : 'text-slate-500'} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 bg-emerald-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            {item.isActive && (
              <span className="w-1 h-1 bg-emerald-700 rounded-full mt-0.5" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
