import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Store, Info, SlidersHorizontal, ArrowUpDown, AlertCircle, ArrowLeft } from 'lucide-react'
import { Product } from '../types/product'
import { FarmerApiRecord } from '../types/farmer'
import { fetchProducts, fetchFarmerBySlug, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { slugifyFarmerName, buildFarmerProfile } from '../services/farmerService'
import { FarmerProfileHeader } from '../components/FarmerProfileHeader'
import { FarmerAboutTab } from '../components/FarmerAboutTab'
import { ProductCard } from '../components/ProductCard'
import { ProductDetailModal } from '../components/ProductDetailModal'

type TabType = 'catalog' | 'about'
type SortType = 'latest' | 'price_asc' | 'price_desc' | 'stock'

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
  const [farmerRecord, setFarmerRecord] = useState<FarmerApiRecord | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('catalog')
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua')
  const [sortBy, setSortBy] = useState<SortType>('latest')
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)

  const targetSlug = slug || 'kelompok-tani-makmur'

  const loadData = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const [productsData, farmerData] = await Promise.all([
        fetchProducts(),
        fetchFarmerBySlug(targetSlug)
      ])
      setAllProducts(productsData)
      setFarmerRecord(farmerData)
    } catch {
      setErrorMessage(`Profil kelompok tani "${targetSlug}" tidak ditemukan di database katalog.`)
    } finally {
      setIsLoading(false)
    }
  }, [targetSlug])

  useEffect(() => {
    loadData()
  }, [loadData])

  const farmerProducts = useMemo(() => {
    if (!farmerRecord) return []
    return allProducts.filter((p) => {
      const pSlug = slugifyFarmerName(p.farmer_name)
      return pSlug === targetSlug || p.farmer_name.toLowerCase() === farmerRecord.name.toLowerCase()
    })
  }, [allProducts, targetSlug, farmerRecord])

  const farmer = useMemo(() => {
    if (!farmerRecord) return null
    return buildFarmerProfile(farmerRecord, farmerProducts)
  }, [farmerRecord, farmerProducts])

  const filteredAndSortedProducts = useMemo(() => {
    return farmerProducts
      .filter((p) => {
        if (selectedCategory !== 'Semua' && p.category !== selectedCategory) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price_per_kg - b.price_per_kg
        }
        if (sortBy === 'price_desc') {
          return b.price_per_kg - a.price_per_kg
        }
        if (sortBy === 'stock') {
          return b.stock_kg - a.stock_kg
        }
        const dateA = new Date(a.created_at).getTime() || 0
        const dateB = new Date(b.created_at).getTime() || 0
        return dateB - dateA
      })
  }, [farmerProducts, selectedCategory, sortBy])

  const handleDeleteProduct = async (id: string): Promise<void> => {
    if (!token) return
    if (!window.confirm('Hapus komoditas ini dari katalog?')) return

    try {
      await deleteProduct(id, token)
      loadData()
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
        <p className="text-xs text-slate-500 font-medium">Memuat profil dan etalase komoditas mitra petani dari database...</p>
      </div>
    )
  }

  if (errorMessage || !farmer) {
    return (
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900">Profil Mitra Tani Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {errorMessage || 'Data profil petani belum terdaftar dalam basis data katalog.'}
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Katalog Komoditas</span>
          </Link>
        </div>
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
                  <option value="latest">Panen Terbaru</option>
                  <option value="price_asc">Harga Terendah</option>
                  <option value="price_desc">Harga Tertinggi</option>
                  <option value="stock">Stok Terbanyak</option>
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
