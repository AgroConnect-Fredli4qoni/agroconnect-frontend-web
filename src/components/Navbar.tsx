import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Store, PlusCircle, ClipboardList, User, LogOut } from 'lucide-react'
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-6 lg:gap-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl transition-transform group-hover:scale-110">🌱</span>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-emerald-900 leading-tight">AgroConnect</span>
            <span className="text-[10px] text-slate-400 font-medium hidden sm:block">Smart Agro-Commerce & Weather</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              location.pathname === '/' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Store size={18} />
            <span>Katalog Hasil Tani</span>
          </Link>
          {isAuthenticated && (user?.role === 'farmer' || user?.role === 'admin') && (
            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer"
              onClick={onOpenAddProduct}
            >
              <PlusCircle size={18} />
              <span>Tambah Komoditas</span>
            </button>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Link
            to="/orders"
            className={`relative inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
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
          className={`relative p-2.5 rounded-xl transition-all cursor-pointer ${
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
                {user.role === 'farmer' ? 'Petani' : user.role === 'admin' ? 'Admin' : 'Pembeli'}
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
          <Link
            to="/auth"
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              location.pathname === '/auth' ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <User size={18} />
            <span>Masuk / Daftar</span>
          </Link>
        )}
      </div>
    </header>
  )
}
