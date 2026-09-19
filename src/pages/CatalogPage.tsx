import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, PlusCircle, Store, ChevronLeft, ChevronRight } from 'lucide-react'
import { CatalogSidebar } from '../components/CatalogSidebar'
import { CatalogSortBar, SortOption } from '../components/CatalogSortBar'
import { ProductCard, getProductRating, getProductSales } from '../components/ProductCard'
import { AddProductModal } from '../components/AddProductModal'
import { Product } from '../types/product'
import { fetchProducts, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ITEMS_PER_PAGE = 20
const CATEGORIES = ['Semua', 'Pangan Pokok', 'Sayur', 'Bumbu', 'Palawija']

/**
 * CatalogPageProps defines modal controllers for farmer product publication.
 */
export interface CatalogPageProps {
  isAddProductOpen: boolean
  setIsAddProductOpen: (open: boolean) => void
}

/**
 * CatalogPage presents the dedicated comprehensive agricultural marketplace with sidebar filters and sort bar.
 *
 * @param props - Modal controller state for commodity creation.
 * @returns JSX Element rendering complete commodity catalog with multi-filter and pagination.
 */
export function CatalogPage(props: CatalogPageProps): React.JSX.Element {
  const { isAddProductOpen, setIsAddProductOpen } = props
  const { token, user, isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [rawProducts, setRawProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)

  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'Semua')
  const [selectedLocation, setSelectedLocation] = useState<string>('Semua')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    const urlCat = searchParams.get('category')
    if (urlCat && urlCat !== category) {
      setCategory(urlCat)
    }
  }, [searchParams, category])

  const handleCategoryChange = (newCat: string): void => {
    setCategory(newCat)
    if (newCat === 'Semua') {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('category')
      setSearchParams(nextParams)
    } else {
      setSearchParams({ category: newCat })
    }
  }

  const loadProducts = useCallback(async (): Promise<void> => {
    setIsProductsLoading(true)
    try {
      const data = await fetchProducts()
      setRawProducts(data)
    } catch {
      setRawProducts([])
    } finally {
      setIsProductsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, category, selectedLocation, minPrice, maxPrice, selectedRating, sortBy])

  const availableLocations = useMemo(() => {
    const set = new Set<string>()
    rawProducts.forEach((p) => {
      if (p.origin_region) set.add(p.origin_region)
    })
    return Array.from(set).sort()
  }, [rawProducts])

  const filteredAndSortedProducts = useMemo(() => {
    return rawProducts
      .filter((p) => {
        if (category !== 'Semua' && p.category !== category) return false
        if (selectedLocation !== 'Semua' && !p.origin_region.toLowerCase().includes(selectedLocation.toLowerCase())) {
          return false
        }
        if (minPrice && p.price_per_kg < Number(minPrice)) return false
        if (maxPrice && p.price_per_kg > Number(maxPrice)) return false
        if (selectedRating > 0 && getProductRating(p.id, p.name) < selectedRating) return false
        if (search) {
          const q = search.toLowerCase()
          const matchesName = p.name.toLowerCase().includes(q)
          const matchesDesc = p.description.toLowerCase().includes(q)
          const matchesFarmer = p.farmer_name.toLowerCase().includes(q)
          if (!matchesName && !matchesDesc && !matchesFarmer) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return getProductRating(b.id, b.name) - getProductRating(a.id, a.name)
        }
        if (sortBy === 'latest') {
          const dateA = new Date(a.created_at).getTime() || 0
          const dateB = new Date(b.created_at).getTime() || 0
          return dateB - dateA || b.id.localeCompare(a.id)
        }
        if (sortBy === 'best_seller') {
          return getProductSales(b) - getProductSales(a)
        }
        return 0
      })
  }, [rawProducts, category, selectedLocation, minPrice, maxPrice, selectedRating, search, sortBy])

  const handleResetFilters = (): void => {
    setCategory('Semua')
    setSelectedLocation('Semua')
    setMinPrice('')
    setMaxPrice('')
    setSelectedRating(0)
    setSearch('')
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('category')
    setSearchParams(nextParams)
  }

  const handleDeleteProduct = async (id: string): Promise<void> => {
    if (!token) return
    if (!window.confirm('Apakah Anda yakin ingin menghapus komoditas ini dari katalog?')) return

    try {
      await deleteProduct(id, token)
      loadProducts()
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      }
    }
  }

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-2"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Store size={24} className="text-emerald-700" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Hasil Panen Petani</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Jelajahi dan pesan komoditas pangan segar berkualitas tinggi langsung dari sentra pertanian lokal.
          </p>
        </div>

        {isAuthenticated && (user?.role === 'farmer' || user?.role === 'admin') && (
          <button
            type="button"
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-all cursor-pointer"
            onClick={() => setIsAddProductOpen(true)}
          >
            <PlusCircle size={18} />
            <span>Tambah Komoditas Baru</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        <CatalogSidebar
          categories={CATEGORIES}
          selectedCategory={category}
          onSelectCategory={handleCategoryChange}
          availableLocations={availableLocations}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredAndSortedProducts.length}
        />

        <main className="flex-1 min-w-0 space-y-6 w-full">
          <CatalogSortBar
            search={search}
            onSearchChange={setSearch}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            totalCount={filteredAndSortedProducts.length}
            startIndex={startIndex}
            endIndex={endIndex}
          />

          {isProductsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Memuat komoditas panen dari database MongoDB...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-3">
              <p className="text-sm font-semibold text-slate-700">Tidak ada komoditas hasil panen yang sesuai dengan kriteria filter.</p>
              <p className="text-xs text-slate-400">Silakan sesuaikan batas harga, lokasi, atau tekan tombol reset filter.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer mt-2"
              >
                <span>Hapus Semua Filter</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">
                    Halaman {currentPage} dari {totalPages} ({filteredAndSortedProducts.length} komoditas)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                    >
                      <ChevronLeft size={16} />
                      <span>Sebelumnya</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Berikutnya</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={loadProducts}
      />
    </div>
  )
}
