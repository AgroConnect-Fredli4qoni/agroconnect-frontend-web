import React, { useState } from 'react'
import { Filter, RotateCcw, MapPin, DollarSign, Star, Check, Navigation, X } from 'lucide-react'
import { CustomNumberInput } from './CustomNumberInput'
import { LocationMapModal } from './LocationMapModal'

/**
 * CatalogSidebarProps defines filtering attributes, options, and callbacks.
 */
export interface CatalogSidebarProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
  selectedLocation: string
  onSelectLocation: (location: string) => void
  minPrice: string
  maxPrice: string
  onMinPriceChange: (val: string) => void
  onMaxPriceChange: (val: string) => void
  selectedRating: number
  onSelectRating: (rating: number) => void
  onResetFilters: () => void
  totalFiltered: number
}

const RATING_OPTIONS = [
  { value: 0, label: 'Semua Penilaian' },
  { value: 4.8, label: '4.8 ke atas' },
  { value: 4.5, label: '4.5 ke atas' },
  { value: 4.0, label: '4.0 ke atas' }
]

/**
 * CatalogSidebar provides left-hand multi-attribute filtering for commodity categories, origin locations, price limits, and star ratings.
 *
 * @param props - Filter configuration and event dispatchers.
 * @returns JSX Element presenting catalog filter sidebar.
 */
export function CatalogSidebar(props: CatalogSidebarProps): React.JSX.Element {
  const {
    categories,
    selectedCategory,
    onSelectCategory,
    selectedLocation,
    onSelectLocation,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
    selectedRating,
    onSelectRating,
    onResetFilters,
    totalFiltered
  } = props

  const [isMapOpen, setIsMapOpen] = useState(false)

  const hasActiveFilters =
    selectedCategory !== 'Semua' ||
    selectedLocation !== 'Semua' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    selectedRating > 0

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
              <span>Lokasi Sentra Tani</span>
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

          <button
            type="button"
            onClick={() => setIsMapOpen(true)}
            className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-2xs group ${
              selectedLocation !== 'Semua'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/80'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Navigation
                size={14}
                className={`shrink-0 group-hover:scale-110 transition-transform ${
                  selectedLocation !== 'Semua' ? 'text-white' : 'text-emerald-700'
                }`}
              />
              <span className="truncate">
                {selectedLocation === 'Semua' ? 'Pilih di Peta / GPS' : selectedLocation}
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                selectedLocation !== 'Semua'
                  ? 'bg-emerald-700 text-white border-emerald-500'
                  : 'bg-white text-emerald-800 border-emerald-200'
              }`}
            >
              <MapPin size={10} />
              <span>Peta</span>
            </span>
          </button>

          {selectedLocation !== 'Semua' && (
            <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 px-3 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-1.5 text-emerald-950 truncate">
                <MapPin size={13} className="text-emerald-600 shrink-0" />
                <span className="truncate font-semibold">{selectedLocation}</span>
              </div>
              <button
                type="button"
                onClick={() => onSelectLocation('Semua')}
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors ml-2 shrink-0 cursor-pointer"
                title="Hapus filter lokasi"
              >
                <X size={12} />
              </button>
            </div>
          )}
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

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs">
            <Star size={15} className="text-amber-500 fill-amber-500" />
            <span>Penilaian Mutu Komoditas</span>
          </div>
          <div className="flex flex-col gap-1">
            {RATING_OPTIONS.map((opt) => {
              const isSelected = selectedRating === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onSelectRating(opt.value)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {opt.value > 0 && <Star size={13} className="fill-amber-400 text-amber-500" />}
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-amber-600" />}
                </button>
              )
            })}
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

      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={(loc) => {
          onSelectLocation(loc)
        }}
        title="Pilih Lokasi Sentra Tani"
      />
    </aside>
  )
}
