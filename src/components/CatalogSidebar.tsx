import React from 'react'
import { Filter, RotateCcw, MapPin, DollarSign, Check } from 'lucide-react'
import { CustomNumberInput } from './CustomNumberInput'

/**
 * CatalogSidebarProps defines filtering attributes, options, and callbacks.
 */
export interface CatalogSidebarProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  locations: string[]
  selectedLocation: string
  onSelectLocation: (location: string) => void
  minPrice: string
  maxPrice: string
  onMinPriceChange: (val: string) => void
  onMaxPriceChange: (val: string) => void
  onResetFilters: () => void
  totalFiltered: number
}

/**
 * CatalogSidebar provides left-hand multi-attribute filtering for commodity categories, origin locations, and price limits.
 *
 * @param props - Filter configuration and event dispatchers.
 * @returns JSX Element presenting catalog filter sidebar.
 */
export function CatalogSidebar(props: CatalogSidebarProps): React.JSX.Element {
  const {
    categories,
    selectedCategory,
    onSelectCategory,
    locations,
    selectedLocation,
    onSelectLocation,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    onResetFilters,
    totalFiltered
  } = props

  const hasActiveFilters =
    selectedCategory !== 'Semua' ||
    selectedLocation !== 'Semua' ||
    minPrice !== '' ||
    maxPrice !== ''

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
            <Filter size={18} className="text-emerald-700" />
            <span>Filter Hasil Tani</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
              title="Hapus semua filter"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
            Semua Kategori
          </span>
          <div className="flex flex-col gap-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  {isSelected && <Check size={15} />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-slate-800 font-bold text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-emerald-700" />
              <span>Lokasi Sentra Panen</span>
            </div>
            {selectedLocation !== 'Semua' && (
              <button
                type="button"
                onClick={() => onSelectLocation('Semua')}
                className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1 max-h-52 overflow-y-auto pr-1">
            {locations.map((loc) => {
              const isSelected = selectedLocation === loc
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onSelectLocation(loc)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={12} className={isSelected ? 'text-white' : 'text-emerald-600 shrink-0'} />
                    <span className="truncate">{loc}</span>
                  </div>
                  {isSelected && <Check size={14} />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
            <DollarSign size={15} className="text-emerald-700" />
            <span>Batas Harga (Rp / Kg)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="catalog-min-price" className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                Minimum
              </label>
              <CustomNumberInput
                id="catalog-min-price"
                prefix="Rp"
                placeholder="0"
                value={minPrice}
                onChange={onMinPriceChange}
              />
            </div>
            <div>
              <label htmlFor="catalog-max-price" className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                Maksimum
              </label>
              <CustomNumberInput
                id="catalog-max-price"
                prefix="Rp"
                placeholder="Maks"
                value={maxPrice}
                onChange={onMaxPriceChange}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Hasil Ditemukan:</span>
          <span className="font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            {totalFiltered} Komoditas
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="w-full py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Hapus Semua Filter</span>
          </button>
        )}
      </div>
    </aside>
  )
}
