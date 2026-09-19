import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CheckCircle2, ShieldCheck, MapPin, User, CreditCard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import { CartItem, Order } from '../types/order'

/**
 * CartPage provides dedicated full-page shopping cart review, shipping details, and ACID checkout.
 *
 * @returns JSX Element presenting cart items and checkout invoice summary.
 */
export function CartPage(): React.JSX.Element {
  const navigate = useNavigate()
  const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } = useCart()
  const { user, token, isAuthenticated } = useAuth()

  const [customerName, setCustomerName] = useState<string>(user?.name || '')
  const [shippingAddress, setShippingAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)

  const handleCheckout = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!isAuthenticated || !token || !user) {
      navigate('/auth', { state: { from: { pathname: '/cart' } } })
      return
    }

    if (items.length === 0) {
      setErrorMsg('Keranjang belanja Anda masih kosong')
      return
    }

    if (!shippingAddress.trim()) {
      setErrorMsg('Mohon lengkapi alamat pengiriman komoditas')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    try {
      const payload = {
        user_id: user.id,
        shipping_address: shippingAddress.trim(),
        items: items.map((item: CartItem) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
      }

      const orderResult = await createOrder(payload, token)
      setCompletedOrder(orderResult)
      clearCart()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memproses transaksi pesanan ACID')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (completedOrder) {
    return (
      <div className="cart-page-wrapper">
        <div className="invoice-success-card">
          <div className="invoice-header">
            <CheckCircle2 size={56} className="success-icon" />
            <h2>Pesanan Berhasil Dikonfirmasi!</h2>
            <p className="invoice-subtext">Transaksi ACID telah tersimpan aman di database MySQL dan stok komoditas di MongoDB telah disinkronkan.</p>
          </div>

          <div className="invoice-details-box">
            <div className="detail-row">
              <span className="label">Nomor Pesanan</span>
              <span className="value code">{completedOrder.order_code}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status Pembayaran</span>
              <span className="status-badge paid">{completedOrder.status}</span>
            </div>
            <div className="detail-row">
              <span className="label">Metode Pembayaran</span>
              <span className="value">{paymentMethod}</span>
            </div>
            <div className="detail-row">
              <span className="label">Alamat Pengiriman</span>
              <span className="value address">{completedOrder.shipping_address}</span>
            </div>
            <div className="detail-row total">
              <span className="label">Total Pembayaran</span>
              <span className="value price">Rp {completedOrder.total_amount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="invoice-actions">
            <button
              type="button"
              className="view-orders-btn"
              onClick={() => navigate('/orders')}
            >
              Lihat Riwayat Pesanan
            </button>
            <Link to="/" className="continue-shop-link">
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="cart-empty-state">
          <div className="empty-icon-wrap">
            <ShoppingBag size={64} />
          </div>
          <h2>Keranjang Belanja Masih Kosong</h2>
          <p>Anda belum menambahkan komoditas hasil panen petani ke keranjang.</p>
          <Link to="/" className="browse-catalog-btn">
            <ArrowLeft size={16} />
            <span>Jelajahi Hasil Panen Petani</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-wrapper">
      <div className="cart-page-header">
        <Link to="/" className="back-catalog-link">
          <ArrowLeft size={16} />
          <span>Lanjut Belanja</span>
        </Link>
        <h1>Keranjang Belanja Komoditas</h1>
        <p className="cart-subtitle">Periksa pesanan hasil bumi Anda dan lengkapi rincian pengiriman</p>
      </div>

      {errorMsg && <div className="cart-error-banner">{errorMsg}</div>}

      <div className="cart-layout-grid">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Daftar Komoditas ({totalItems} item)</span>
            <button type="button" className="clear-cart-link" onClick={clearCart}>
              Kosongkan Keranjang
            </button>
          </div>

          <div className="cart-items-list">
            {items.map((item: CartItem) => (
              <div key={item.product_id} className="cart-item-row">
                <div className="item-info-col">
                  <h3>{item.product_name}</h3>
                  <span className="item-unit-price">Rp {item.price.toLocaleString('id-ID')} / {item.unit}</span>
                </div>

                <div className="item-qty-col">
                  <div className="qty-picker">
                    <button
                      type="button"
                      className="qty-step"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      type="button"
                      className="qty-step"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock_available}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="stock-info">Tersedia: {item.stock_available} {item.unit}</span>
                </div>

                <div className="item-subtotal-col">
                  <span className="subtotal-val">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  <button
                    type="button"
                    className="delete-item-btn"
                    onClick={() => removeItem(item.product_id)}
                    title="Hapus item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-checkout-section">
          <form onSubmit={handleCheckout} className="checkout-summary-card">
            <h2>Ringkasan & Pembayaran</h2>

            <div className="checkout-form-group">
              <label htmlFor="cust-name">Nama Penerima</label>
              <div className="checkout-input-box">
                <User size={16} className="input-icon" />
                <input
                  id="cust-name"
                  type="text"
                  required
                  placeholder="Nama lengkap pemesan"
                  value={customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-form-group">
              <label htmlFor="ship-address">Alamat Pengiriman Lengkap</label>
              <div className="checkout-input-box">
                <MapPin size={16} className="input-icon" />
                <textarea
                  id="ship-address"
                  required
                  rows={3}
                  placeholder="Jalan, Nomor, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  value={shippingAddress}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setShippingAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-form-group">
              <label htmlFor="pay-method">Metode Pembayaran</label>
              <div className="checkout-input-box">
                <CreditCard size={16} className="input-icon" />
                <select
                  id="pay-method"
                  value={paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value)}
                >
                  <option value="QRIS">QRIS Agrikultur Instan</option>
                  <option value="Transfer Bank BCA">Transfer Bank BCA Virtual Account</option>
                  <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                  <option value="Tunai saat Terima">Tunai saat Terima (COD Petani)</option>
                </select>
              </div>
            </div>

            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Subtotal ({totalItems} komoditas)</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="cost-row">
                <span>Biaya Layanan & Pengiriman</span>
                <span className="free">Gratis (Subsidi Tani)</span>
              </div>
              <div className="cost-row grand-total">
                <span>Total Tagihan</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {!isAuthenticated ? (
              <button
                type="button"
                className="checkout-submit-btn auth-prompt"
                onClick={() => navigate('/auth', { state: { from: { pathname: '/cart' } } })}
              >
                <span>Masuk untuk Melanjutkan Pembayaran</span>
              </button>
            ) : (
              <button type="submit" className="checkout-submit-btn" disabled={isSubmitting}>
                <ShieldCheck size={18} />
                <span>{isSubmitting ? 'Memproses Transaksi...' : 'Konfirmasi & Buat Pesanan (ACID)'}</span>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
