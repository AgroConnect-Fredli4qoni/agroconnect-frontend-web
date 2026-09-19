import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, Calendar, MapPin, PackageCheck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserOrders } from '../services/api'
import { Order, OrderItem } from '../types/order'

/**
 * OrdersPage presents full-page user order history and transactional invoice details.
 *
 * @returns JSX Element rendering order cards and delivery information.
 */
export function OrdersPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const loadOrders = async (): Promise<void> => {
    if (!token || !user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const data = await fetchUserOrders(user.id, token)
      setOrders(data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memuat riwayat transaksi pesanan Anda')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: { pathname: '/orders' } } })
      return
    }
    loadOrders()
  }, [isAuthenticated, token, user])

  if (!isAuthenticated) {
    return (
      <div className="orders-page-wrapper">
        <div className="orders-auth-prompt">
          <AlertCircle size={48} className="prompt-icon" />
          <h2>Autentikasi Diperlukan</h2>
          <p>Silakan masuk ke akun Anda untuk meninjau riwayat pesanan komoditas pertanian.</p>
          <Link to="/auth" className="login-redirect-btn">
            Masuk ke Akun
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page-wrapper">
      <div className="orders-page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog</span>
          </Link>
          <h1>Riwayat Transaksi Pesanan</h1>
          <p className="orders-subtitle">Daftar pesanan hasil panen yang tercatat resmi pada database transaksional MySQL</p>
        </div>

        <button
          type="button"
          className="refresh-orders-btn"
          onClick={loadOrders}
          disabled={isLoading}
          title="Muat ulang data pesanan"
        >
          <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {errorMsg && <div className="orders-error-alert">{errorMsg}</div>}

      {isLoading ? (
        <div className="orders-loading-state">
          <div className="spinner" />
          <p>Memuat riwayat transaksi pesanan...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty-state">
          <PackageCheck size={56} className="empty-icon" />
          <h2>Belum Ada Riwayat Pesanan</h2>
          <p>Anda belum pernah melakukan pemesanan komoditas pertanian di AgroConnect.</p>
          <Link to="/" className="browse-now-btn">
            Mulai Belanja Hasil Panen
          </Link>
        </div>
      ) : (
        <div className="orders-cards-list">
          {orders.map((order: Order) => (
            <div key={order.order_code} className="order-history-card">
              <div className="order-card-header">
                <div className="order-id-block">
                  <ClipboardList size={18} className="order-icon" />
                  <span className="order-code">{order.order_code}</span>
                  <span className={`status-pill ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-date-block">
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>
                </div>
              </div>

              <div className="order-address-box">
                <MapPin size={16} className="pin-icon" />
                <div className="address-text">
                  <span className="address-label">Tujuan Pengiriman:</span>
                  <span className="address-val">{order.shipping_address}</span>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items-table">
                  <div className="items-table-header">
                    <span>Komoditas</span>
                    <span>Harga Satuan</span>
                    <span>Kuantitas</span>
                    <span>Subtotal</span>
                  </div>
                  {order.items.map((it: OrderItem) => (
                    <div key={it.id || it.product_id} className="items-table-row">
                      <span className="item-name">{it.product_name}</span>
                      <span className="item-price">Rp {it.price.toLocaleString('id-ID')}</span>
                      <span className="item-qty">{it.quantity}</span>
                      <span className="item-subtotal">Rp {it.subtotal.toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-card-footer">
                <span className="total-label">Total Pembayaran:</span>
                <span className="total-value">Rp {order.total_amount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
