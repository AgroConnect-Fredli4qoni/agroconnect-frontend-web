import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Store, Info, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { Product } from '../types/product'
import { fetchProducts, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { slugifyFarmerName, getFarmerProfile } from '../services/farmerService'
import { FarmerProfileHeader } from '../components/FarmerProfileHeader'
import { FarmerAboutTab } from '../components/FarmerAboutTab'
import { ProductCard, getProductRating, getProductSales } from '../components/ProductCard'
import { ProductDetailModal } from '../components/ProductDetailModal'

type TabType = 'catalog' | 'about'
type SortType = 'popular' | 'latest' | 'price_asc' | 'price_desc'

const CATEGORY_TABS = ['Semua', 'Pangan Pokok', 'Sayur', 'Bumbu', 'Palawija']

/**
 * FarmerProfilePage renders comprehensive seller storefront including cover banner, statistics, catalog, reviews, and farm background.
 *
 * @returns JSX Element presenting complete farmer profile page.
 */
export function FarmerProfilePage(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>()
  const { token } = useAuth()

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<TabType>('catalog')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [sortBy, setSortBy] = useState<SortType>('popular')
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)

  const loadProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const data = await fetchProducts()
      setAllProducts(data)
    } catch {
      setAllProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const targetSlug = slug || 'kelompok-tani-makmur'
  const farmer = useMemo(() => {
    return getFarmerProfile(targetSlug, allProducts)
  }, [targetSlug, allProducts])

  const farmerProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const pSlug = slugifyFarmerName(p.farmer_name)
      return pSlug === targetSlug || p.farmer_name.toLowerCase() === farmer.name.toLowerCase()
    })
  }, [allProducts, targetSlug, farmer.name])

  const filteredAndSortedProducts = useMemo(() => {
    return farmerProducts
      .filter((p) => {
        if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return getProductRating(b.id, b.name) - getProductRating(a.id, a.name)
        }
        if (sortBy === 'latest') {
          const dateA = new Date(a.created_at).getTime() || 0
          const dateB = new Date(b.created_at).getTime() || 0
          return dateB - dateA
        }
        if (sortBy === 'price_asc') {
          return a.price_per_kg - b.price_per_kg
        }
        if (sortBy === 'price_desc') {
          return b.price_per_kg - a.price_per_kg
        }
        return getProductSales(b) - getProductSales(a)
      })
  }, [farmerProducts, selectedCategory, sortBy])

  const handleDeleteProduct = async (id: string): Promise<void> => {
    if (!token) return
    if (!window.confirm('Hapus komoditas ini dari katalog?')) return

    try {
      await deleteProduct(id, token)
      loadProducts()
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-16 flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Memuat profil dan etalase komoditas mitra petani...</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      <FarmerProfileHeader farmer={farmer} productCount={farmerProducts.length} />

      <div className="border-b border-slate-200">
        <nav className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`inline-flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store size={16} />
            <span>Katalog Hasil Panen</span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'catalog' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {farmerProducts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`inline-flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info size={16} />
            <span>Tentang Lahan & Sertifikasi</span>
          </button>
        </nav>
      </div>

      <main>
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <SlidersHorizontal size={14} className="text-slate-400 mr-1 shrink-0" />
                {CATEGORY_TABS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <ArrowUpDown size={14} className="text-slate-400" />
                <span className="text-xs text-slate-500 font-semibold">Urutkan:</span>
                <select
                  aria-label="Urutkan komoditas"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="popular">Paling Populer</option>
                  <option value="latest">Panen Terbaru</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80 p-8 shadow-xs space-y-3">
                <p className="text-sm font-semibold text-slate-700">
                  Tidak ada komoditas pada kategori {selectedCategory}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Semua')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  Tampilkan Semua Komoditas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onOpenDetail={setSelectedProductForDetail}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <FarmerAboutTab farmer={farmer} />
        )}
      </main>

      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onDelete={handleDeleteProduct}
      />
    </div>
  )
}
