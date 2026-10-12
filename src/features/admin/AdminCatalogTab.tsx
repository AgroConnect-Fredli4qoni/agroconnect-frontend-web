import React, { useEffect, useState } from 'react'
import {
  Sprout,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Layers,
} from 'lucide-react'
import { fetchProducts } from '../../services/api'
import { Product } from '../../types/product'

/**
 * Format numeric value into Indonesian Rupiah currency notation.
 *
 * @param amount - Numeric monetary value.
 * @returns Formatted currency string.
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * AdminCatalogTab provides global commodity catalog moderation across all participating farmers.
 *
 * @returns JSX Element rendering the catalog moderation view.
 */
export function AdminCatalogTab(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')

  const categories = ['Semua', 'Beras', 'Sayuran', 'Buah-buahan', 'Rempah', 'Kacang-kacangan']

  const loadCatalog = async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts(undefined, selectedCategory)
      setProducts(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat katalog komoditas'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCatalog()
  }, [selectedCategory])

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.farmer_name && p.farmer_name.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Moderasi Komoditas Pertanian</h1>
          <p className="text-xs text-slate-500 mt-0.5">Pengawasan katalog produk, stok, dan kualitas komoditas seluruh mitra petani.</p>
        </div>
        <button
          type="button"
          onClick={loadCatalog}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-emerald-600' : ''} />
          <span>Muat Ulang</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama komoditas, petani, atau kategori..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-xs">
          <AlertTriangle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <Layers size={16} className="text-emerald-600" />
            <span>Total Komoditas Terdaftar: {filteredProducts.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Komoditas</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Mitra Petani</th>
                <th className="py-3 px-4">Harga / Satuan</th>
                <th className="py-3 px-4">Sisa Stok</th>
                <th className="py-3 px-4 text-center">Tautan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-emerald-600" size={24} />
                    <span>Memuat inventaris katalog...</span>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url || '/images/products/placeholder.jpg'}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{p.farmer_name || 'Mitra Petani'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatRupiah(p.price_per_kg)} / {p.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock_kg <= 5 ? 'text-rose-600 font-bold' : 'text-slate-700'
                        }`}
                      >
                        {p.stock_kg} {p.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <a
                        href={`/products/${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                      >
                        <span>Lihat</span>
                        <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Sprout size={28} className="mx-auto text-slate-300 mb-2" />
                    <span>Tidak ada komoditas ditemukan dalam kategori ini.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
