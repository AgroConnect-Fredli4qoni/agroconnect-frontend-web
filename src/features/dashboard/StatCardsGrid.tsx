import React from 'react'
import { TrendingUp, ShoppingBag, PackageCheck, Coins } from 'lucide-react'
import { formatIDR } from '../../utils'

/**
 * StatCardsGridProps defines the metrics rendered by StatCardsGrid.
 */
export interface StatCardsGridProps {
  totalRevenue: number
  totalOrders: number
  totalItemsSold: number
  averageOrderValue: number
  userRole?: string
}

/**
 * StatCardsGrid renders four KPI summary cards featuring revenue, orders, volume, and average order value.
 *
 * @param props - Component configuration containing aggregate numerical metrics.
 * @returns JSX Element rendering KPI metric grid.
 */
export function StatCardsGrid(props: StatCardsGridProps): React.JSX.Element {
  const { totalRevenue, totalOrders, totalItemsSold, averageOrderValue, userRole } = props
  const isBuyer = userRole === 'buyer'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate pr-1">
            {isBuyer ? 'Pengeluaran' : 'Pendapatan'}
          </span>
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="text-sm sm:text-xl xl:text-2xl font-black text-slate-900 tracking-tight truncate" title={formatIDR(totalRevenue)}>
            {formatIDR(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-emerald-600 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="truncate">{isBuyer ? 'Total Belanja' : 'Gross Revenue'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate pr-1">
            {isBuyer ? 'Transaksi' : 'Pesanan'}
          </span>
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="text-sm sm:text-xl xl:text-2xl font-black text-slate-900 tracking-tight truncate">
            {totalOrders.toLocaleString('id-ID')}
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 ml-1">Pesanan</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-blue-600 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="truncate">Status Transaksi ACID</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate pr-1">
            {isBuyer ? 'Komoditas' : 'Volume'}
          </span>
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shadow-2xs group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <PackageCheck className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="text-sm sm:text-xl xl:text-2xl font-black text-slate-900 tracking-tight truncate">
            {totalItemsSold.toLocaleString('id-ID')}
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 ml-1">Unit</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-amber-600 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className="truncate">Hasil Panen Tani</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate pr-1">
            Rata-rata
          </span>
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shadow-2xs group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shrink-0">
            <Coins className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
        <div className="space-y-0.5 sm:space-y-1">
          <div className="text-sm sm:text-xl xl:text-2xl font-black text-slate-900 tracking-tight truncate" title={formatIDR(averageOrderValue)}>
            {formatIDR(averageOrderValue)}
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] text-purple-600 font-semibold truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span className="truncate">Average Value</span>
          </div>
        </div>
      </div>
    </div>
  )
}
