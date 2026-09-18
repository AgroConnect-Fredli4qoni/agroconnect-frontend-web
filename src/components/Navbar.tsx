import React from 'react'
import { ShoppingCart, CloudSun, Store, PlusCircle, ClipboardList, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

/**
 * NavbarProps defines configurable callbacks for navigation and modal toggles.
 */
export interface NavbarProps {
  activeTab: 'marketplace' | 'weather' | 'manage'
  setActiveTab: (tab: 'marketplace' | 'weather' | 'manage') => void
  onOpenCart: () => void
  onOpenOrders: () => void
  onOpenAuth: () => void
  onOpenAddProduct: () => void
}

/**
 * Navbar header component with branding, navigation links, and session actions.
 *
 * @param props - Navigation states and trigger handlers.
 * @returns JSX Element representing top application header.
 */
export function Navbar(props: NavbarProps): React.JSX.Element {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="brand" onClick={() => props.setActiveTab('marketplace')}>
          <span className="brand-icon">🌱</span>
          <div className="brand-titles">
            <span className="brand-text">AgroConnect</span>
            <span className="brand-subtitle">Smart Agro-Commerce & Weather</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            type="button"
            className={`nav-btn ${props.activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => props.setActiveTab('marketplace')}
          >
            <Store size={18} />
            <span>Katalog Hasil Tani</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${props.activeTab === 'weather' ? 'active' : ''}`}
            onClick={() => props.setActiveTab('weather')}
          >
            <CloudSun size={18} />
            <span>Prakiraan Cuaca BMKG</span>
          </button>
          {isAuthenticated && (user?.role === 'farmer' || user?.role === 'admin') && (
            <button
              type="button"
              className="nav-btn action"
              onClick={props.onOpenAddProduct}
            >
              <PlusCircle size={18} />
              <span>Tambah Komoditas</span>
            </button>
          )}
        </nav>
      </div>

      <div className="navbar-right">
        {isAuthenticated && (
          <button
            type="button"
            className="action-icon-btn"
            title="Riwayat Transaksi Pesanan"
            onClick={props.onOpenOrders}
          >
            <ClipboardList size={20} />
            <span className="icon-label">Pesanan</span>
          </button>
        )}

        <button
          type="button"
          className="cart-btn"
          onClick={props.onOpenCart}
          title="Keranjang Belanja"
        >
          <ShoppingCart size={20} />
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>

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
          <button
            type="button"
            className="login-trigger-btn"
            onClick={props.onOpenAuth}
          >
            <User size={18} />
            <span>Masuk / Daftar</span>
          </button>
        )}
      </div>
    </header>
  )
}
