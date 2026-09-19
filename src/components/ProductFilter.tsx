import React from 'react'
import { Search } from 'lucide-react'

/**
 * ProductFilterProps defines filtering search term and category selector handlers.
 */
export interface ProductFilterProps {
  search: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = ['Semua', 'Pangan Pokok', 'Sayur', 'Bumbu', 'Palawija']

/**
 * ProductFilter component provides real-time search filtering and category segmentation.
 *
 * @param props - Current filter states and event emitters.
 * @returns JSX Element rendering category bar and search input.
 */
export function ProductFilter(props: ProductFilterProps): React.JSX.Element {
  const { search, onSearchChange, selectedCategory, onCategoryChange } = props

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="relative flex-1 w-full flex items-center">
        <Search size={18} className="absolute left-3.5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Cari komoditas tani (contoh: Beras, Cabai, Jagung)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
