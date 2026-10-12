import React, { useEffect, useState } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Package,
  Truck,
  XCircle,
  LucideIcon,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchAdminStats } from '../../services/adminService'
import { PlatformAdminStats } from '../../types/admin'
import { OrderStatus } from '../../types/order'

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
 * AdminOverviewTab presents consolidated executive health metrics and recent platform-wide trades.
 *
 * @returns JSX Element rendering the executive overview panel.
 */
export function AdminOverviewTab(): React.JSX.Element {
  const { token } = useAuth()
  const [stats, setStats] = useState<PlatformAdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async (): Promise<void> => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAdminStats(token)
      setStats(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat ringkasan data admin'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  if (loading && !stats) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
        <RefreshCw className="animate-spin mx-auto text-emerald-600 mb-3" size={32} />
        <p className="text-xs font-semibold text-slate-500">Mengkonsolidasikan data eksekutif platform...</p>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
        <AlertTriangle className="mx-auto text-rose-600" size={36} />
        <h3 className="text-sm font-bold text-rose-900">Kendala Sinkronisasi Data</h3>
        <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={loadData}
          className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Ringkasan Eksekutif Platform</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pemantauan transaksi global, pertumbuhan mitra, dan likuiditas escrow.</p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
          <span>Segarkan Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider block">Total Volume GMV</span>
            <div className="text-2xl font-black tracking-tight">{formatRupiah(stats?.total_gmv || 0)}</div>
            <p className="text-[10px] text-emerald-100/90 pt-1">Akumulasi seluruh transaksi sukses & terbayar</p>
          </div>
          <TrendingUp className="absolute right-4 -bottom-2 text-white/10" size={88} />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1 relative overflow-hidden">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Pesanan</span>
          <div className="text-2xl font-black text-slate-900">{stats?.total_orders || 0}</div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-600 font-semibold pt-1">
            <CheckCircle2 size={13} />
            <span>{stats?.completed_orders || 0} pesanan selesai</span>
          </div>
          <ShoppingBag className="absolute right-4 -bottom-2 text-slate-100" size={80} />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1 relative overflow-hidden">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Mitra Petani & Pembeli</span>
          <div className="text-2xl font-black text-slate-900">
            {(stats?.total_farmers || 0) + (stats?.total_buyers || 0)}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
            <span className="font-bold text-emerald-700">{stats?.total_farmers || 0} Petani</span>
            <span>&bull;</span>
            <span className="font-bold text-teal-700">{stats?.total_buyers || 0} Pembeli</span>
          </div>
          <Users className="absolute right-4 -bottom-2 text-slate-100" size={80} />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1 relative overflow-hidden">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pencairan Escrow Antrean</span>
          <div className="text-2xl font-black text-amber-600">{stats?.pending_withdrawals_count || 0} Permohonan</div>
          <p className="text-[11px] text-slate-500 font-semibold pt-1">
            Total {formatRupiah(stats?.pending_withdrawals_amount || 0)}
          </p>
          <Clock className="absolute right-4 -bottom-2 text-amber-100/60" size={80} />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Distribusi Status Pesanan Platform</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3">
            <div className="text-[11px] font-bold text-amber-800">Menunggu (Pending)</div>
            <div className="text-lg font-black text-amber-900 mt-1">{stats?.pending_orders || 0}</div>
          </div>
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3">
            <div className="text-[11px] font-bold text-blue-800">Terbayar (Paid)</div>
            <div className="text-lg font-black text-blue-900 mt-1">{stats?.paid_orders || 0}</div>
          </div>
          <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-xl p-3">
            <div className="text-[11px] font-bold text-indigo-800">Dikirim (Shipped)</div>
            <div className="text-lg font-black text-indigo-900 mt-1">{stats?.shipped_orders || 0}</div>
          </div>
          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3">
            <div className="text-[11px] font-bold text-emerald-800">Selesai (Completed)</div>
            <div className="text-lg font-black text-emerald-900 mt-1">{stats?.completed_orders || 0}</div>
          </div>
          <div className="bg-rose-50/70 border border-rose-200/60 rounded-xl p-3">
            <div className="text-[11px] font-bold text-rose-800">Batal (Cancelled)</div>
            <div className="text-lg font-black text-rose-900 mt-1">{stats?.cancelled_orders || 0}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Transaksi Global Terbaru</h2>
            <p className="text-xs text-slate-500">Aktivitas pesanan lintas seluruh pengguna di ekosistem AgroConnect.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Kode Pesanan</th>
                <th className="py-3 px-4">Pembeli</th>
                <th className="py-3 px-4">Total Nilai</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Pesanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recent_orders && stats.recent_orders.length > 0 ? (
                stats.recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{order.order_code}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{order.customer_name || 'Pelanggan'}</div>
                      <div className="text-[11px] text-slate-400">{order.customer_email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatRupiah(order.total_amount)}</td>
                    <td className="py-3.5 px-4">{renderStatusBadge(order.status)}</td>
                    <td className="py-3.5 px-4 text-slate-500">{order.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data transaksi yang tercatat di platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
