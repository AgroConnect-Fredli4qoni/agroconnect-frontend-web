import React from 'react'
import { History, Calendar, CheckCircle2, Clock, Truck, ShieldCheck, XCircle, Loader2, LucideIcon } from 'lucide-react'
import { Order, OrderStatus } from '../../types/order'
import { formatIDR } from '../../utils/currency'

/**
 * RecentOrdersTableProps defines properties required by RecentOrdersTable.
 */
export interface RecentOrdersTableProps {
  orders: Order[]
  onUpdateStatus?: (orderCode: string, newStatus: OrderStatus) => Promise<void>
  updatingCode?: string | null
  userRole?: string
}

const STATUS_BADGES: Record<OrderStatus, { bg: string; text: string; border: string; icon: LucideIcon }> = {
  COMPLETED: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
  PAID: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: ShieldCheck },
  SHIPPED: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Truck },
  PENDING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  CANCELLED: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle },
}

/**
 * RecentOrdersTable displays real-time recorded transactions with status management controls.
 *
 * @param props - Component configuration including orders array and update action callback.
 * @returns JSX Element rendering recent transaction table.
 */
export function RecentOrdersTable(props: RecentOrdersTableProps): React.JSX.Element {
  const { orders, onUpdateStatus, updatingCode, userRole } = props
  const canManageStatus = userRole === 'farmer' || userRole === 'admin'

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <History size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Riwayat Transaksi Penjualan Terbaru</h3>
            <p className="text-[11px] text-slate-500">Daftar transaksi pesanan komoditas yang tercatat</p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
          {orders.length} Transaksi Terkini
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Belum ada riwayat transaksi pesanan yang tercatat dalam sistem.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Kode Pesanan</th>
                <th className="py-3 px-3">Komoditas Dipesan</th>
                <th className="py-3 px-3">Waktu Transaksi</th>
                <th className="py-3 px-3">Total Nominal</th>
                <th className="py-3 px-3">Status Transaksi</th>
                {canManageStatus && <th className="py-3 px-3 text-right">Kelola Status</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {orders.map((order) => {
                const badge = STATUS_BADGES[order.status] || STATUS_BADGES.PENDING
                const IconComponent = badge.icon
                const itemsCount = order.items?.length || 0
                const firstItemName = order.items && order.items.length > 0 ? order.items[0].product_name : 'Komoditas Pertanian'

                return (
                  <tr key={order.id || order.order_code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-bold text-slate-900">{order.order_code}</span>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px]" title={order.shipping_address}>
                        {order.shipping_address}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-slate-800 line-clamp-1">{firstItemName}</span>
                      {itemsCount > 1 && (
                        <span className="text-[10px] text-emerald-600 font-medium">
                          +{itemsCount - 1} komoditas lainnya
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{formatIDR(order.total_amount)}</span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <IconComponent size={13} />
                        {order.status}
                      </span>
                    </td>

                    {canManageStatus && (
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {updatingCode === order.order_code ? (
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                            <Loader2 size={13} className="animate-spin text-emerald-600" />
                            <span>Memproses...</span>
                          </div>
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateStatus?.(order.order_code, e.target.value as OrderStatus)}
                            className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
