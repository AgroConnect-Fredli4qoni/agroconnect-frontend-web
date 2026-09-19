import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, CloudSun, Store, PlusCircle, ClipboardList, User, LogOut } from 'lucide-react'
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
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">
          <span className="brand-icon">🌱</span>
          <div className="brand-titles">
            <span className="brand-text">AgroConnect</span>
            <span className="brand-subtitle">Smart Agro-Commerce & Weather</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Store size={18} />
            <span>Katalog Hasil Tani</span>
          </Link>
          <a
            href="/#cuaca"
            className="nav-btn"
          >
            <CloudSun size={18} />
            <span>Prakiraan Cuaca BMKG</span>
          </a>
          {isAuthenticated && (user?.role === 'farmer' || user?.role === 'admin') && (
            <button
              type="button"
              className="nav-btn action"
              onClick={onOpenAddProduct}
            >
              <PlusCircle size={18} />
              <span>Tambah Komoditas</span>
            </button>
          )}
        </nav>
      </div>

      <div className="navbar-right">
        {isAuthenticated && (
          <Link
            to="/orders"
            className={`action-icon-btn ${location.pathname === '/orders' ? 'active' : ''}`}
            title="Riwayat Transaksi Pesanan"
          >
            <ClipboardList size={20} />
            <span className="icon-label">Pesanan</span>
          </Link>
        )}

        <Link
          to="/cart"
          className={`cart-btn ${location.pathname === '/cart' ? 'active' : ''}`}
          title="Keranjang Belanja"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>

        {isAuthenticated && user ? (
          <div className="user-profile-badge">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className={`role-tag ${user.role}`}>
                {user.role === 'farmer' ? 'Petani' : user.role === 'admin' ? 'Admin' : 'Pembeli'}
              </span>
            </div>
            <button
              type="button"
              className="logout-btn"
              onClick={logout}
              title="Keluar dari akun"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className={`login-trigger-btn ${location.pathname === '/auth' ? 'active' : ''}`}
          >
            <User size={18} />
            <span>Masuk / Daftar</span>
          </Link>
        )}
      </div>
    </header>
  )
}
