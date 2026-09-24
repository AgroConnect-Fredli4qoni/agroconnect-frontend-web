import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, LayoutGrid } from 'lucide-react'

/**
 * CategoryItem defines representation of an agricultural commodity category with CDN visual assets.
 */
export interface CategoryItem {
  id: string
  name: string
  label: string
  iconUrl: string
  description: string
  bgAccent: string
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'all',
    name: 'Semua',
    label: 'Semua Komoditas',
    iconUrl: 'https://img.icons8.com/bubbles/100/more.png',
    description: 'Seluruh hasil panen Nusantara',
    bgAccent: 'bg-emerald-50/80',
  },
  {
    id: 'pangan',
    name: 'Pangan Pokok',
    label: 'Pangan Pokok',
    iconUrl: 'https://img.icons8.com/bubbles/100/rice-bowl.png',
    description: 'Beras, jagung & biji-bijian',
    bgAccent: 'bg-amber-50/80',
  },
  {
    id: 'sayur',
    name: 'Sayur',
    label: 'Sayur Segar',
    iconUrl: 'https://img.icons8.com/bubbles/100/broccoli.png',
    description: 'Sayuran organik dataran tinggi',
    bgAccent: 'bg-green-50/80',
  },
  {
    id: 'bumbu',
    name: 'Bumbu',
    label: 'Bumbu & Rempah',
    iconUrl: 'https://img.icons8.com/bubbles/100/chili-pepper.png',
    description: 'Cabai, bawang & rempah dapur',
    bgAccent: 'bg-rose-50/80',
  },
  {
    id: 'palawija',
    name: 'Palawija',
    label: 'Palawija & Umbi',
    iconUrl: 'https://img.icons8.com/bubbles/100/nutshell.png',
    description: 'Kacang-kacangan & aneka umbi',
    bgAccent: 'bg-orange-50/80',
  },
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
            className="group relative bg-white border border-slate-200/90 hover:border-emerald-500/60 rounded-xl p-4.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-start">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center p-1.5 transition-transform duration-200 group-hover:scale-110 shadow-2xs ${cat.bgAccent}`}
                >
                  <img
                    src={cat.iconUrl}
                    alt={cat.label}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
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
