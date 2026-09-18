import React, { useEffect, useState } from 'react'
import { X, ClipboardList, PackageCheck, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchUserOrders } from '../services/api'
import { Order } from '../types/order'

/**
 * OrderHistoryModalProps defines modal visibility controller.
 */
export interface OrderHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

/**
 * OrderHistoryModal displays transaction history and invoice statuses for the authenticated buyer.
 *
 * @param props - Modal controller properties.
 * @returns JSX Element rendering order history dialog.
 */
export function OrderHistoryModal(props: OrderHistoryModalProps): React.JSX.Element {
  const { isOpen, onClose } = props
  const { user, token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!isOpen || !user || !token) return

    const loadOrders = async (): Promise<void> => {
      setIsLoading(true)
      setErrorMsg('')
      try {
        const data = await fetchUserOrders(user.id, token)
        setOrders(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMsg(err.message)
        } else {
          setErrorMsg('Gagal memuat riwayat pesanan.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [isOpen, user, token])

  if (!isOpen) return <></>

  return (
    <div className="modal-overlay">
      <div className="modal-card wide-modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <ClipboardList size={22} className="text-primary" />
            <h3>Riwayat Transaksi Pesanan Anda</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="modal-error-alert">{errorMsg}</div>}

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Memuat riwayat transaksi MySQL...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-cart-state">
            <PackageCheck size={48} className="empty-icon" />
            <p>Belum ada riwayat pesanan yang tercatat.</p>
          </div>
        ) : (
          <div className="orders-scroll-list">
            {orders.map((order) => (
              <div key={order.order_code} className="order-history-card">
                <div className="order-card-head">
                  <div className="order-id-group">
                    <span className="order-code-text">{order.order_code}</span>
                    <span className={`status-pill ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-date-text">
                    <Calendar size={14} />
                    <span>{new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                  </div>
                </div>

                <div className="order-address-row">
                  <MapPin size={14} />
                  <span>{order.shipping_address}</span>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="order-items-snippet">
                    {order.items.map((it) => (
                      <div key={it.id || it.product_id} className="order-item-mini-row">
                        <span>{it.product_name} ({it.quantity}x)</span>
                        <span>Rp {it.subtotal.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="order-total-foot">
                  <span>Total Tagihan:</span>
                  <strong>Rp {order.total_amount.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
