import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ShoppingCart, ClipboardList, User, LogOut, Search, X, Menu } from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'
import { useCart } from '../../features/catalog/CartContext'
import { MobileSidebar } from './MobileSidebar'

/**
 * NavbarProps defines callback for farmer product addition modal.
 */
export interface NavbarProps {
  onOpenAddProduct?: () => void
}

/**
 * Navbar provides top application header, routing navigation, search bar, and user session controls.
 *
 * @param props - Trigger callback for farmer product addition modal.
 * @returns JSX Element rendering application navigation bar.
 */
export function Navbar(_props?: NavbarProps): React.JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  useEffect(() => {
    if (location.pathname === '/catalog') {
      setSearchQuery(searchParams.get('search') || '')
    }
  }, [location.pathname, searchParams])

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      navigate(`/catalog?search=${encodeURIComponent(trimmed)}`)
    } else {
      navigate('/catalog')
    }
  }

  const handleClearSearch = (): void => {
    setSearchQuery('')
    if (location.pathname === '/catalog') {
      navigate('/catalog')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <img
              src="/images/logo/logo.png"
              alt="AgroConnect"
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-emerald-900 leading-tight">
                AgroConnect
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium block">
                Smart Agro-Commerce & Weather
              </span>
            </div>
          </Link>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-2 sm:mx-6 min-w-[130px]"
        >
          <div className="relative flex items-center w-full">
            <Search
              size={15}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari beras, sayur, rempah..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all placeholder:text-slate-400 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer transition-colors"
                title="Hapus pencarian"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            to="/cart"
            className={`relative p-2 sm:p-2.5 rounded-lg transition-all cursor-pointer ${
              location.pathname === '/cart' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
            title="Keranjang Belanja"
          >
            <ShoppingCart size={21} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-emerald-900 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer"
            title="Buka Menu Navigasi"
          >
            <Menu size={22} />
          </button>

          {isAuthenticated && (
            <Link
              to="/orders"
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                location.pathname === '/orders' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Riwayat Transaksi Pesanan"
            >
              <ClipboardList size={18} />
              <span>Pesanan</span>
            </Link>
          )}

          {isAuthenticated && user ? (
            <div className="hidden lg:flex items-center gap-2 sm:gap-3 pl-3 border-l border-slate-200">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 pl-1 pr-3.5 py-1 rounded-full border transition-all cursor-pointer group ${
                  location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile')
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-2xs'
                    : 'border-transparent hover:bg-slate-100 hover:border-slate-200 text-slate-700'
                }`}
                title="Dashboard Pengguna"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/20 shadow-2xs overflow-hidden shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors max-w-[130px] truncate leading-none">
                    {user.name}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                onClick={logout}
                title="Keluar dari akun"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all cursor-pointer ${
                  location.pathname === '/login' ? 'bg-slate-100 text-slate-900 border-slate-300' : ''
                }`}
                title="Masuk ke Akun"
              >
                <User size={15} />
                <span>Masuk</span>
              </Link>
              <Link
                to="/register"
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer ${
                  location.pathname === '/register'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white hover:shadow-sm'
                }`}
                title="Daftar Akun Baru"
              >
                <span>Daftar</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
    </header>
  )
}
