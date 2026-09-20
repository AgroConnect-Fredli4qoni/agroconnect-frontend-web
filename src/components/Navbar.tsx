import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, PlusCircle, ClipboardList, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * NavbarProps defines callback for farmer product addition modal.
 */
export interface NavbarProps {
  onOpenAddProduct: () => void
}

/**
 * Navbar provides top application header, routing navigation, and user session controls.
 *
 * @param props - Trigger callback for farmer product addition modal.
 * @returns JSX Element rendering application navigation bar.
 */
export function Navbar(props: NavbarProps): React.JSX.Element {
  const { onOpenAddProduct } = props
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🌱</span>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-emerald-900 leading-tight">AgroConnect</span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Smart Agro-Commerce & Weather</span>
          </div>
        </Link>

        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all cursor-pointer"
              onClick={onOpenAddProduct}
            >
              <PlusCircle size={18} />
              <span>Tambah Komoditas</span>
            </button>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Link
            to="/orders"
            className={`relative inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              location.pathname === '/orders' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Riwayat Transaksi Pesanan"
          >
            <ClipboardList size={20} />
            <span className="hidden sm:inline">Pesanan</span>
          </Link>
        )}

        <Link
          to="/cart"
          className={`relative p-2.5 rounded-lg transition-all cursor-pointer ${
            location.pathname === '/cart' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
          }`}
          title="Keranjang Belanja"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          )}
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 self-end">
                {user.role === 'admin' ? 'Admin' : 'Mitra Tani'}
              </span>
            </div>
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
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all cursor-pointer ${
                location.pathname === '/login'
                  ? 'bg-slate-100 text-slate-900 border-slate-300'
                  : ''
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
  </header>
  )
}
