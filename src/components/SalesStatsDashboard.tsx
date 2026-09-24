import React, { useEffect, useState, useCallback } from 'react'
import { BarChart3, RotateCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchOrderStats, updateOrderStatus } from '../services/api'
import { OrderStats, OrderStatus } from '../types/order'
import { StatCardsGrid } from './dashboard/StatCardsGrid'
import { OrderStatusDistribution } from './dashboard/OrderStatusDistribution'
import { TopCommoditiesTable } from './dashboard/TopCommoditiesTable'
import { RecentOrdersTable } from './dashboard/RecentOrdersTable'

/**
 * SalesStatsDashboard orchestrates real-time sales metrics, distribution breakdowns, and recent order transactions.
 *
 * @returns JSX Element rendering complete sales analytics panel.
 */
export function SalesStatsDashboard(): React.JSX.Element {
  const { token, user } = useAuth()
  const [stats, setStats] = useState<OrderStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [updatingCode, setUpdatingCode] = useState<string | null>(null)

  const loadStats = useCallback(
    async (silent: boolean = false): Promise<void> => {
      if (!token) return

      if (silent) {
        setIsRefreshing(true)
      } else {
        setIsLoading(true)
      }
      setErrorMessage('')

      try {
        const data = await fetchOrderStats(token)
        setStats(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage('Gagal memuat data statistik penjualan')
        }
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [token]
  )

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const handleUpdateStatus = async (orderCode: string, newStatus: OrderStatus): Promise<void> => {
    if (!token) return

    setUpdatingCode(orderCode)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      await updateOrderStatus(orderCode, newStatus, token)
      setSuccessMessage(`Status pesanan ${orderCode} berhasil diubah ke ${newStatus}`)
      await loadStats(true)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message)
      } else {
        setErrorMessage('Gagal memperbarui status transaksi')
      }
    } finally {
      setUpdatingCode(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white border border-slate-200/80 rounded-2xl p-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 bg-white border border-slate-200/80 rounded-2xl" />
          <div className="h-32 bg-white border border-slate-200/80 rounded-2xl" />
          <div className="h-32 bg-white border border-slate-200/80 rounded-2xl" />
          <div className="h-32 bg-white border border-slate-200/80 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-white border border-slate-200/80 rounded-2xl" />
          <div className="h-72 bg-white border border-slate-200/80 rounded-2xl" />
        </div>
        <div className="h-80 bg-white border border-slate-200/80 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shrink-0">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Ikhtisar & Statistik Penjualan</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <Sparkles size={11} />
                Live Data
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Performa transaksi pesanan, distribusi komoditas panen, dan metrik revenue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => loadStats(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RotateCw size={14} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {stats && (
        <>
          <StatCardsGrid
            totalRevenue={stats.total_revenue}
            totalOrders={stats.total_orders}
            totalItemsSold={stats.total_items_sold}
            averageOrderValue={stats.average_order_value}
            userRole={user?.role}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderStatusDistribution
              breakdown={stats.status_breakdown}
              totalOrders={stats.total_orders}
            />
            <TopCommoditiesTable products={stats.top_products} />
          </div>

          <RecentOrdersTable
            orders={stats.recent_orders}
            onUpdateStatus={handleUpdateStatus}
            updatingCode={updatingCode}
            userRole={user?.role}
          />
        </>
      )}
    </div>
  )
}
