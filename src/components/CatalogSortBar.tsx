import React from 'react'
import { Search, X, Flame, Clock, TrendingUp, ArrowUpDown } from 'lucide-react'

/**
 * SortOption defines available sorting mechanisms for commodity marketplace.
 */
export type SortOption = 'popular' | 'latest' | 'best_seller'

/**
 * CatalogSortBarProps defines search input, sort options, and count indicators.
 */
export interface CatalogSortBarProps {
  search: string
  onSearchChange: (search: string) => void
  sortBy: SortOption
  onSortByChange: (sortBy: SortOption) => void
  totalCount: number
  startIndex: number
  endIndex: number
}

const SORT_BUTTONS: { id: SortOption; label: string; icon: React.ReactNode }[] = [
  { id: 'popular', label: 'Populer', icon: <Flame size={14} /> },
  { id: 'latest', label: 'Terbaru', icon: <Clock size={14} /> },
  { id: 'best_seller', label: 'Terlaris', icon: <TrendingUp size={14} /> }
]

/**
 * CatalogSortBar provides top search input and sorting criteria switcher.
 *
 * @param props - Sort bar state and event handlers.
 * @returns JSX Element presenting top sorting bar.
 */
export function CatalogSortBar(props: CatalogSortBarProps): React.JSX.Element {
  const {
    search,
    onSearchChange,
    sortBy,
    onSortByChange,
    totalCount,
    startIndex,
    endIndex
  } = props

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama komoditas tani (contoh: Beras Pandan Wangi, Cabai Rawit)..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 font-medium"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              title="Bersihkan pencarian"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mr-1 shrink-0">
            <ArrowUpDown size={14} className="text-emerald-700" />
            <span className="hidden md:inline">Urutkan:</span>
          </div>

          {SORT_BUTTONS.map((btn) => {
            const isActive = sortBy === btn.id
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => onSortByChange(btn.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1 pt-2 border-t border-slate-100">
        <span>
          {totalCount > 0
            ? `Menampilkan ${startIndex + 1} - ${Math.min(endIndex, totalCount)} dari ${totalCount} komoditas pangan`
            : 'Tidak ada komoditas yang ditemukan'}
        </span>
        <span className="font-semibold text-emerald-800">
          Maks. 9 produk per halaman
        </span>
      </div>
    </div>
  )
}
