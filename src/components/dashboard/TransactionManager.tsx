import React, { useEffect, useState, useMemo } from 'react'
import {
  Search,
  RefreshCw,
  Eye,
  PackageCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Truck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchUserOrders, updateOrderStatus } from '../../services/api'
import { Order, OrderStatus } from '../../types/order'
import { OrderDetailModal } from './OrderDetailModal'

/**
 * StatusFilterTab defines options for filtering order lists.
 */
export type StatusFilterTab = 'ALL' | OrderStatus

/**
 * TransactionManager provides comprehensive order management for farmers, buyers, and platform administrators.
 *
 * @returns JSX Element rendering transactional order management dashboard.
 */
export function TransactionManager(): React.JSX.Element {
  const { user, token } = useAuth()

  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [successMsg, setSuccessMsg] = useState<string>('')

  const [activeTab, setActiveTab] = useState<StatusFilterTab>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false)

  const loadOrders = async (): Promise<void> => {
    if (!token || !user) return

    setIsLoading(true)
    setErrorMsg('')

    try {
      const data = await fetchUserOrders(user.id, token)
      setOrders(data || [])
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memuat daftar transaksi pesanan')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [token, user])

  const handleStatusChange = async (orderCode: string, newStatus: OrderStatus): Promise<void> => {
    if (!token) return

    setIsUpdatingStatus(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await updateOrderStatus(orderCode, newStatus, token)
      setSuccessMsg(`Status pesanan ${orderCode} berhasil diperbarui menjadi ${newStatus}!`)

      setOrders((prev) =>
        prev.map((ord) => (ord.order_code === orderCode ? { ...ord, status: newStatus } : ord))
      )

      if (selectedOrder && selectedOrder.order_code === orderCode) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui status transaksi')
      }
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: orders.length,
      PENDING: 0,
      PAID: 0,
      SHIPPED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    }
    for (const ord of orders) {
      if (counts[ord.status] !== undefined) {
        counts[ord.status]++
      }
    }
    return counts
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === 'ALL' || order.status === activeTab

      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesTab

      const matchesCode = order.order_code.toLowerCase().includes(query)
      const matchesCustomer = (order.customer_name || '').toLowerCase().includes(query)
      const matchesAddress = order.shipping_address.toLowerCase().includes(query)
      const matchesItem = (order.items || []).some((it) =>
        it.product_name.toLowerCase().includes(query)
      )

      return matchesTab && (matchesCode || matchesCustomer || matchesAddress || matchesItem)
    })
  }, [orders, activeTab, searchQuery])

  const getStatusBadge = (status: OrderStatus): React.JSX.Element => {
    const styles: Record<OrderStatus, string> = {
      PAID: 'bg-blue-50 text-blue-700 border-blue-200',
      SHIPPED: 'bg-purple-50 text-purple-700 border-purple-200',
      COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    }

    return (
      <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
        {status}
      </span>
    )
  }

  const tabs: { key: StatusFilterTab; label: string }[] = [
    { key: 'ALL', label: 'Semua' },
    { key: 'PENDING', label: 'Menunggu' },
    { key: 'PAID', label: 'Terbayar' },
    { key: 'SHIPPED', label: 'Dikirim' },
    { key: 'COMPLETED', label: 'Selesai' },
    { key: 'CANCELLED', label: 'Dibatalkan' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {user?.role === 'farmer'
                ? 'Kelola Pesanan Masuk'
                : user?.role === 'admin'
                ? 'Manajemen Transaksi Platform'
                : 'Riwayat Pesanan Saya'}
            </h2>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              {orders.length} Transaksi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {user?.role === 'farmer'
              ? 'Pantau pesanan hasil panen dari pembeli dan perbarui status pengiriman komoditas.'
              : 'Daftar transaksi komoditas pertanian dengan integritas ACID.'}
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium animate-in fade-in">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.key ? 'bg-emerald-700/80 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {statusCounts[tab.key] || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode, pemesan, komoditas..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat data transaksi pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-14 px-4 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <PackageCheck size={28} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tidak Ada Transaksi</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ditemukan pesanan yang sesuai dengan filter status atau kata kunci pencarian.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Kode & Waktu</th>
                  <th className="py-3 px-3">Pemesan</th>
                  <th className="py-3 px-3">Rincian Komoditas</th>
                  <th className="py-3 px-3 text-right">Total Nilai</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.map((order) => (
                  <tr key={order.order_code} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-800 block">{order.order_code}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block">
                        {order.customer_name || 'Pelanggan'}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {order.shipping_address}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="space-y-0.5 max-w-[200px]">
                        {(order.items || []).map((it) => (
                          <div key={it.id || it.product_id} className="text-[11px] text-slate-600 truncate">
                            <span className="font-medium text-slate-800">{it.product_name}</span>{' '}
                            <span className="text-slate-400">({it.quantity} kg)</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-black text-emerald-700">
                      Rp {order.total_amount.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-3 text-center">{getStatusBadge(order.status)}</td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsModalOpen(true)
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-md transition-colors cursor-pointer"
                          title="Lihat Faktur & Rincian Lengkap"
                        >
                          <Eye size={12} />
                          <span>Nota</span>
                        </button>

                        {order.status === 'PAID' && (
                          <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={() => handleStatusChange(order.order_code, 'SHIPPED')}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-[11px] rounded-md transition-colors cursor-pointer"
                            title="Kirim Komoditas"
                          >
                            <Truck size={12} />
                            <span>Kirim</span>
                          </button>
                        )}

                        {order.status === 'SHIPPED' && (
                          <button
                            type="button"
                            disabled={isUpdatingStatus}
                            onClick={() => handleStatusChange(order.order_code, 'COMPLETED')}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[11px] rounded-md transition-colors cursor-pointer"
                            title="Selesaikan Pesanan"
                          >
                            <CheckCircle2 size={12} />
                            <span>Selesai</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOrder(null)
        }}
        onStatusUpdate={handleStatusChange}
        isUpdating={isUpdatingStatus}
        userRole={user?.role}
      />
    </div>
  )
}
