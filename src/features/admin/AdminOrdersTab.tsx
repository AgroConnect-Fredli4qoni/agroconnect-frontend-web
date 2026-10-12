import React, { useEffect, useState } from 'react'
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  Eye,
  FileText,
  X,
  LucideIcon,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchAdminOrders } from '../../services/adminService'
import { Order, OrderStatus } from '../../types/order'

/**
 * Format numeric value into Indonesian Rupiah currency notation.
 *
 * @param amount - Numeric monetary value.
 * @returns Formatted currency string.
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Render transactional status pill badge with theme-compliant colors.
 *
 * @param status - Transactional status code.
 * @returns JSX Element badge.
 */
function renderStatusBadge(status: OrderStatus): React.JSX.Element {
  const configs: Record<OrderStatus, { bg: string; text: string; icon: LucideIcon }> = {
    PENDING: { bg: 'bg-amber-50 border-amber-200 text-amber-700', text: 'Menunggu', icon: Clock },
    PAID: { bg: 'bg-blue-50 border-blue-200 text-blue-700', text: 'Terbayar', icon: CheckCircle2 },
    SHIPPED: { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', text: 'Dikirim', icon: Truck },
    COMPLETED: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', text: 'Selesai', icon: Package },
    CANCELLED: { bg: 'bg-rose-50 border-rose-200 text-rose-700', text: 'Dibatalkan', icon: XCircle },
  }

  const cfg = configs[status] || configs.PENDING
  const Icon = cfg.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.bg}`}>
      <Icon size={12} />
      <span>{cfg.text}</span>
    </span>
  )
}

/**
 * AdminOrdersTab enables platform-wide order auditing, status verification, and invoice printing.
 *
 * @returns JSX Element rendering the global orders management panel.
 */
export function AdminOrdersTab(): React.JSX.Element {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = async (): Promise<void> => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminOrders(token, statusFilter)
      setOrders(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat audit pesanan'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [token, statusFilter])

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      o.order_code.toLowerCase().includes(q) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
      (o.shipping_address && o.shipping_address.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Audit Transaksi Global</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pengawasan menyeluruh terhadap pesanan antar-pengguna dan cetak faktur.</p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
          <span>Muat Ulang</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kode pesanan, nama, atau alamat..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'PENDING', label: 'Menunggu' },
              { id: 'PAID', label: 'Terbayar' },
              { id: 'SHIPPED', label: 'Dikirim' },
              { id: 'COMPLETED', label: 'Selesai' },
              { id: 'CANCELLED', label: 'Batal' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-xs">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <ShoppingBag size={16} className="text-emerald-600" />
            <span>Total Transaksi Ditemukan: {filteredOrders.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Kode Transaksi</th>
                <th className="py-3 px-4">Konsumen</th>
                <th className="py-3 px-4">Tujuan Pengiriman</th>
                <th className="py-3 px-4">Total Bayar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    <span>Mengaudit pesanan...</span>
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{o.order_code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{o.customer_name || 'Pelanggan'}</div>
                      <div className="text-[11px] text-slate-400">{o.customer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600" title={o.shipping_address}>
                      {o.shipping_address}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatRupiah(o.total_amount)}</td>
                    <td className="py-3.5 px-4">{renderStatusBadge(o.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{o.created_at}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Detail Item"
                        >
                          <Eye size={15} />
                        </button>
                        <a
                          href={`/orders?code=${encodeURIComponent(o.order_code)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 rounded-lg transition-colors cursor-pointer"
                          title="Buka Faktur Pesanan"
                        >
                          <FileText size={15} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada pesanan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">Rincian Komoditas Pesanan</h3>
                <span className="font-mono text-xs text-emerald-700 font-bold">{selectedOrder.order_code}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{item.product_name}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.quantity} unit &times; {formatRupiah(item.price)}
                      </div>
                    </div>
                    <div className="font-bold text-emerald-700">{formatRupiah(item.subtotal)}</div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">Data rincian item tidak tersedia.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Total Transaksi</span>
              <span className="font-black text-slate-900 text-base">{formatRupiah(selectedOrder.total_amount)}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
