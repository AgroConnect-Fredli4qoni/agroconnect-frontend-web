import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LayoutGrid } from 'lucide-react'

/**
 * CategoryItem defines representation of an agricultural commodity category.
 */
export interface CategoryItem {
  id: string
  name: string
  label: string
  icon: string
  description: string
  bgAccent: string
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    name: 'Semua',
    label: 'Semua Komoditas',
    icon: '🧺',
    description: 'Seluruh hasil panen Nusantara',
    bgAccent: 'bg-emerald-50 text-emerald-800'
  },
  {
    id: 'pangan',
    name: 'Pangan Pokok',
    label: 'Pangan Pokok',
    icon: '🌾',
    description: 'Beras, jagung & biji-bijian',
    bgAccent: 'bg-amber-50 text-amber-800'
  },
  {
    id: 'sayur',
    name: 'Sayur',
    label: 'Sayur Segar',
    icon: '🥬',
    description: 'Sayuran organik dataran tinggi',
    bgAccent: 'bg-green-50 text-green-800'
  },
  {
    id: 'bumbu',
    name: 'Bumbu',
    label: 'Bumbu & Rempah',
    icon: '🌶️',
    description: 'Cabai, bawang & rempah dapur',
    bgAccent: 'bg-rose-50 text-rose-800'
  },
  {
    id: 'palawija',
    name: 'Palawija',
    label: 'Palawija & Umbi',
    icon: '🌽',
    description: 'Kacang-kacangan & aneka umbi',
    bgAccent: 'bg-orange-50 text-orange-800'
  }
]

/**
 * CategorySection renders interactive commodity category cards directly navigating to the filtered catalog.
 *
 * @returns JSX Element presenting agricultural category grid.
 */
export function CategorySection(): React.JSX.Element {
  const navigate = useNavigate()

  const handleCategoryClick = (categoryName: string): void => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <LayoutGrid size={20} className="text-emerald-700" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Kategori Komoditas Pertanian</h2>
        </div>
        <p className="text-xs text-slate-500">
          Pilih kategori hasil tani untuk menemukan komoditas langsung dari kelompok tani daerah.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            role="button"
            tabIndex={0}
            onClick={() => handleCategoryClick(cat.name)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCategoryClick(cat.name)
              }
            }}
            className="group relative bg-white border border-slate-200/90 hover:border-emerald-500/60 rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl transition-transform duration-200 group-hover:scale-115 block">
                  {cat.icon}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.bgAccent}`}>
                  Katalog
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>Buka Produk</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
