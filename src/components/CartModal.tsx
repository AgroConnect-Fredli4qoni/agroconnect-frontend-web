import React, { useState } from 'react'
import { X, ShoppingBag, Trash2, Plus, Minus, CheckCircle, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../services/api'
import { CheckoutPayload, Order } from '../types/order'

/**
 * CartModalProps defines visibility state, toggle handler, and login switch callback.
 */
export interface CartModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenAuth: () => void
  onOrderCompleted?: () => void
}

/**
 * CartModal manages shopping cart review, shipping destination input, and ACID order checkout.
 *
 * @param props - Dialog controllers and order listeners.
 * @returns JSX Element presenting cart drawer and checkout sequence.
 */
export function CartModal(props: CartModalProps): React.JSX.Element {
  const { isOpen, onClose, onOpenAuth, onOrderCompleted } = props
  const { items, totalAmount, updateQuantity, removeItem, clearCart } = useCart()
  const { user, token, isAuthenticated } = useAuth()

  const [address, setAddress] = useState('Jl. Merdeka No. 45, Sentra Pangan, Jakarta Pusat')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null)

  if (!isOpen) return <></>

  const handleCheckout = async (): Promise<void> => {
    if (!isAuthenticated || !token || !user) {
      onOpenAuth()
      return
    }

    if (items.length === 0) {
      setErrorMsg('Keranjang belanja kosong.')
      return
    }

    if (!address.trim()) {
      setErrorMsg('Alamat pengiriman pesanan wajib diisi.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const payload: CheckoutPayload = {
        user_id: user.id,
        shipping_address: address,
        items: items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        })),
      }

      const order = await createOrder(payload, token)
      setConfirmedOrder(order)
      clearCart()
      if (onOrderCompleted) {
        onOrderCompleted()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memproses transaksi pesanan.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinish = (): void => {
    setConfirmedOrder(null)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card cart-modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ShoppingBag size={22} className="text-primary" />
            <h3>Keranjang Belanja Komoditas</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="order-success-view">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="text-primary" />
            </div>
            <h3>Transaksi Berhasil Dikonfirmasi!</h3>
            <p className="order-code-badge">Kode Pesanan: <strong>{confirmedOrder.order_code}</strong></p>
            <p className="order-subnote">
              Pesanan telah tercatat secara transaksional (ACID) dan stok komoditas di katalog otomatis disinkronisasi.
            </p>
            <div className="invoice-summary-box">
              <div className="invoice-row">
                <span>Total Tagihan:</span>
                <strong>Rp {confirmedOrder.total_amount.toLocaleString('id-ID')}</strong>
              </div>
              <div className="invoice-row">
                <span>Status Pesanan:</span>
                <span className="status-pill pending">{confirmedOrder.status}</span>
              </div>
              <div className="invoice-row">
                <span>Alamat Kirim:</span>
                <span>{confirmedOrder.shipping_address}</span>
              </div>
            </div>
            <button type="button" className="finish-btn" onClick={handleFinish}>
              <span>Selesai & Belanja Lagi</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="cart-flow-content">
            {errorMsg && <div className="modal-error-alert">{errorMsg}</div>}

            {items.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={48} className="empty-icon" />
                <p>Keranjang Anda masih kosong.</p>
                <button type="button" className="browse-btn" onClick={onClose}>
                  Jelajahi Hasil Panen
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {items.map((item) => (
                    <div key={item.product_id} className="cart-item-row">
                      <div className="cart-item-meta">
                        <h4>{item.product_name}</h4>
                        <span className="cart-item-price">
                          Rp {item.price.toLocaleString('id-ID')} / {item.unit}
                        </span>
                      </div>

                      <div className="cart-item-controls">
                        <div className="qty-control small">
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-number">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock_available}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <div className="item-subtotal">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </div>

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeItem(item.product_id)}
                          title="Hapus dari keranjang"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="shipping-address-block">
                  <label htmlFor="shipping-address">Alamat Pengiriman Lengkap *</label>
                  <textarea
                    id="shipping-address"
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Masukkan alamat jalan, nomor rumah, kelurahan, dan kota tujuan..."
                  />
                </div>

                <div className="cart-checkout-footer">
                  <div className="total-breakdown">
                    <span className="total-label">Total Belanja Komoditas</span>
                    <span className="total-value">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Memproses Transaksi ACID...' : 'Konfirmasi & Buat Pesanan'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="checkout-btn auth-req"
                      onClick={onOpenAuth}
                    >
                      Masuk untuk Menyelesaikan Pesanan
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
