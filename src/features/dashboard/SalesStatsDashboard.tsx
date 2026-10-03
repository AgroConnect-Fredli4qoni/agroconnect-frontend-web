import React, { useEffect, useState, useCallback } from 'react'
import { BarChart3, RotateCw, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { fetchOrderStats, updateOrderStatus } from '../../services/api'
import { OrderStats, OrderStatus } from '../../types/order'
import { StatCardsGrid } from './StatCardsGrid'
import { OrderStatusDistribution } from './OrderStatusDistribution'
import { TopCommoditiesTable } from './TopCommoditiesTable'
import { RecentOrdersTable } from '../orders/RecentOrdersTable'
import { TransactionPovToggle, TransactionPov } from './TransactionPovToggle'

/**
 * SalesStatsDashboard orchestrates real-time sales metrics, distribution breakdowns, and recent order transactions.
 *
 * @returns JSX Element rendering complete sales analytics panel.
 */
export function SalesStatsDashboard(): React.JSX.Element {
  const { token, user } = useAuth()
  const [currentPov, setCurrentPov] = useState<TransactionPov>(
    user?.role === 'farmer' ? 'seller' : 'buyer'
  )
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
        const activeRole = currentPov === 'seller' ? 'farmer' : 'buyer'
        const data = await fetchOrderStats(token, activeRole)
        setStats(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message)
        } else {
          setErrorMessage('Gagal memuat data statistik transaksi')
        }
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [token, currentPov]
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
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shrink-0">
              <BarChart3 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {currentPov === 'seller' ? 'Statistik Penjualan' : 'Statistik Belanja'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  <Sparkles size={10} />
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                {currentPov === 'seller'
                  ? 'Performa transaksi pesanan masuk, komoditas terlaris, dan metrik revenue'
                  : 'Ringkasan belanja komoditas panen, alokasi anggaran, dan riwayat pesanan Anda'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadStats(true)}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
            title="Segarkan data statistik"
          >
            <RotateCw size={13} className={isRefreshing ? 'animate-spin text-emerald-600' : ''} />
            <span className="hidden sm:inline">Segarkan</span>
          </button>
        </div>

        <div className="pt-0.5">
          <TransactionPovToggle
            currentPov={currentPov}
            onPovChange={setCurrentPov}
          />
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
            userRole={currentPov === 'seller' ? 'farmer' : 'buyer'}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
            userRole={currentPov === 'seller' ? 'farmer' : 'buyer'}
          />
        </>
      )}
    </div>
  )
}
