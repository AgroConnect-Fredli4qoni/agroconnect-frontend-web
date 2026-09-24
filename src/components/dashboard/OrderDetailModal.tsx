import React from 'react'
import {
  X,
  Printer,
  Calendar,
  MapPin,
  User,
  Mail,
  Truck,
  CheckCircle,
  AlertOctagon,
  CreditCard,
  Loader2,
} from 'lucide-react'
import { Order, OrderStatus } from '../../types/order'

/**
 * OrderDetailModalProps defines configuration for viewing and updating order invoice details.
 */
export interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderCode: string, newStatus: OrderStatus) => Promise<void>
  isUpdating?: boolean
  userRole?: string
}

/**
 * OrderDetailModal renders an interactive modal displaying transaction breakdown, buyer info, and status management.
 *
 * @param props - Modal properties including selected order and status handler.
 * @returns JSX Element rendering the invoice popup.
 */
export function OrderDetailModal(props: OrderDetailModalProps): React.JSX.Element | null {
  const { order, isOpen, onClose, onStatusUpdate, isUpdating = false, userRole } = props

  if (!isOpen || !order) {
    return null
  }

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'PAID':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'SHIPPED':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                  {order.order_code}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <Calendar size={12} />
                <span>
                  {new Date(order.created_at).toLocaleDateString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                <User size={14} className="text-emerald-600" />
                Informasi Pemesan
              </span>
              <div className="space-y-1 text-slate-600">
                <p className="font-semibold text-slate-900">{order.customer_name || 'Pelanggan AgroConnect'}</p>
                {order.customer_email && (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" />
                    {order.customer_email}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                <MapPin size={14} className="text-emerald-600" />
                Alamat Tujuan Pengiriman
              </span>
              <p className="text-slate-700 leading-relaxed">{order.shipping_address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-2.5">Rincian Komoditas Pertanian</h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Komoditas</th>
                    <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                    <th className="py-2.5 px-3 text-center">Kuantitas</th>
                    <th className="py-2.5 px-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item) => (
                      <tr key={item.id || item.product_id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.product_name}</td>
                        <td className="py-3 px-3 text-right text-slate-500">
                          Rp {item.price.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700">
                          {item.quantity} kg
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400">
                        Tidak ada rincian item komoditas
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-slate-50/70 border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="py-3 px-4 font-bold text-slate-700 text-right">
                      Total Pembayaran:
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-700 text-sm">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-600" />
                Ubah Status Pemrosesan Pesanan
              </span>
              {isUpdating && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <Loader2 size={12} className="animate-spin" />
                  Menyimpan pembaruan ACID...
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {order.status === 'PENDING' && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(order.order_code, 'PAID')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <CreditCard size={13} />
                  <span>Konfirmasi Pembayaran (PAID)</span>
                </button>
              )}

              {(order.status === 'PAID' || (order.status === 'PENDING' && userRole === 'admin')) && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(order.order_code, 'SHIPPED')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Truck size={13} />
                  <span>Kirim Pesanan (SHIPPED)</span>
                </button>
              )}

              {(order.status === 'SHIPPED' || order.status === 'PAID') && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(order.order_code, 'COMPLETED')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle size={13} />
                  <span>Tandai Selesai (COMPLETED)</span>
                </button>
              )}

              {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => onStatusUpdate(order.order_code, 'CANCELLED')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <AlertOctagon size={13} />
                  <span>Batalkan (CANCELLED)</span>
                </button>
              )}

              {order.status === 'COMPLETED' && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle size={14} />
                  <span>Pesanan ini telah tuntas diselesaikan.</span>
                </div>
              )}

              {order.status === 'CANCELLED' && (
                <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                  <AlertOctagon size={14} />
                  <span>Pesanan ini telah dibatalkan.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Cetak Faktur</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
