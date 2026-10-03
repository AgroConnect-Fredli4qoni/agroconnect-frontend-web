import React, { useState } from 'react'
import { Filter, RotateCcw, MapPin, DollarSign, Check, Navigation, X } from 'lucide-react'
import { CustomNumberInput } from '../../components/ui/CustomNumberInput'
import { LocationMapModal } from '../dashboard/LocationMapModal'

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
  onResetFilters: () => void
  totalFiltered: number
  isMobileDrawerOpen?: boolean
  onCloseMobileDrawer?: () => void
}

/**
 * CatalogSidebar provides multi-attribute filtering for commodity categories, origin locations, and price limits.
 * Features a desktop fixed sidebar card and an animated mobile bottom-sheet drawer.
 *
 * @param props - Filter configuration and event dispatchers.
 * @returns JSX Element presenting catalog filter sidebar and mobile drawer.
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
    onResetFilters,
    totalFiltered,
    isMobileDrawerOpen,
    onCloseMobileDrawer
  } = props

  const [isMapOpen, setIsMapOpen] = useState<boolean>(false)

  const hasActiveFilters =
    selectedCategory !== 'Semua' ||
    selectedLocation !== 'Semua' ||
    minPrice !== '' ||
    maxPrice !== ''

  const renderFilterBody = (isMobile: boolean = false): React.JSX.Element => (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">
          Kategori Komoditas
        </span>
        <div className={isMobile ? 'flex flex-wrap gap-1.5' : 'flex flex-col gap-1'}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-slate-50 border border-slate-200/50'
                }`}
              >
                <span>{cat}</span>
                {isSelected && !isMobile && <Check size={15} />}
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
            <label htmlFor={`min-price-${isMobile ? 'mobile' : 'desktop'}`} className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
              Minimum
            </label>
            <CustomNumberInput
              id={`min-price-${isMobile ? 'mobile' : 'desktop'}`}
              prefix="Rp"
              placeholder="0"
              value={minPrice}
              onChange={onMinPriceChange}
            />
          </div>
          <div>
            <label htmlFor={`max-price-${isMobile ? 'mobile' : 'desktop'}`} className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
              Maksimum
            </label>
            <CustomNumberInput
              id={`max-price-${isMobile ? 'mobile' : 'desktop'}`}
              prefix="Rp"
              placeholder="Maks"
              value={maxPrice}
              onChange={onMaxPriceChange}
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0 space-y-6">
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

          {renderFilterBody(false)}

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

      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobileDrawer}
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-emerald-700" />
                <h3 className="font-black text-sm text-slate-900">Filter Hasil Panen</h3>
              </div>
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
                title="Tutup Filter"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(85vh-130px)]">
              {renderFilterBody(true)}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={onCloseMobileDrawer}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors text-center cursor-pointer"
              >
                Terapkan Filter ({totalFiltered})
              </button>
            </div>
          </div>
        </div>
      )}

      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={(loc) => {
          onSelectLocation(loc)
        }}
        title="Pilih Lokasi Sentra Tani"
      />
    </>
  )
}
