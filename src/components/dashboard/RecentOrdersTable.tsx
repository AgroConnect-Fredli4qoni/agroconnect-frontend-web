import React from 'react'
import { History, Calendar, Loader2 } from 'lucide-react'
import { Order, OrderStatus } from '../../types/order'
import { getAllowedNextStatuses } from '../../services/orderPipeline'
import { OrderStatusBadge } from './OrderStatusBadge'
import { formatIDR } from '../../utils'

/**
 * RecentOrdersTableProps defines properties required by RecentOrdersTable.
 */
export interface RecentOrdersTableProps {
  orders: Order[]
  onUpdateStatus?: (orderCode: string, newStatus: OrderStatus) => Promise<void>
  updatingCode?: string | null
  userRole?: string
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
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {canManageStatus && (
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        {updatingCode === order.order_code ? (
                          <div className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                            <Loader2 size={13} className="animate-spin text-emerald-600" />
                            <span>Memproses...</span>
                          </div>
                        ) : (
                          (() => {
                            const allowed = getAllowedNextStatuses(order.status, userRole)
                            if (allowed.length === 0) {
                              return <span className="text-[11px] font-bold text-slate-400">Terkunci</span>
                            }
                            return (
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateStatus?.(order.order_code, e.target.value as OrderStatus)}
                                className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                              >
                                <option value={order.status} disabled>
                                  {order.status}
                                </option>
                                {allowed.map((next) => (
                                  <option key={next} value={next}>
                                    {next}
                                  </option>
                                ))}
                              </select>
                            )
                          })()
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
