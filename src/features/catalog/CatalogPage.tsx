import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PlusCircle, Store, ChevronLeft, ChevronRight } from 'lucide-react'
import { CatalogSidebar } from './CatalogSidebar'
import { CatalogSortBar, SortOption } from './CatalogSortBar'
import { ProductCard } from '../product/ProductCard'
import { AddProductModal } from '../product/AddProductModal'
import { ProductDetailModal } from '../product/ProductDetailModal'
import { Product } from '../../types/product'
import { fetchProducts, deleteProduct } from '../../services/api'
import { useAuth } from '../auth/AuthContext'

const ITEMS_PER_PAGE = 9

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
  const { token, isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [rawProducts, setRawProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)

  const [search, setSearch] = useState<string>(searchParams.get('search') || '')
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'Semua')
  const [selectedLocation, setSelectedLocation] = useState<string>('Semua')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (category !== 'Semua') count++
    if (selectedLocation !== 'Semua') count++
    if (minPrice) count++
    if (maxPrice) count++
    return count
  }, [category, selectedLocation, minPrice, maxPrice])

  const categories = useMemo(() => {
    const dynamicCats = Array.from(new Set(rawProducts.map((p) => p.category))).filter(Boolean).sort()
    return ['Semua', ...dynamicCats]
  }, [rawProducts])

  useEffect(() => {
    const urlCat = searchParams.get('category')
    if (urlCat && urlCat !== category) {
      setCategory(urlCat)
    }
    const urlSearch = searchParams.get('search')
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch)
    } else if (urlSearch === null && search !== '') {
      setSearch('')
    }
  }, [searchParams, category, search])

  const handleSearchChange = (newSearch: string): void => {
    setSearch(newSearch)
    const nextParams = new URLSearchParams(searchParams)
    if (newSearch.trim()) {
      nextParams.set('search', newSearch.trim())
    } else {
      nextParams.delete('search')
    }
    setSearchParams(nextParams, { replace: true })
  }

  const handleCategoryChange = (newCat: string): void => {
    setCategory(newCat)
    const nextParams = new URLSearchParams(searchParams)
    if (newCat === 'Semua') {
      nextParams.delete('category')
    } else {
      nextParams.set('category', newCat)
    }
    setSearchParams(nextParams)
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
  }, [search, category, selectedLocation, minPrice, maxPrice, sortBy])

  const filteredAndSortedProducts = useMemo(() => {
    return rawProducts
      .filter((p) => {
        if (category !== 'Semua' && p.category !== category) return false
        if (selectedLocation !== 'Semua') {
          const productLoc = p.origin_region.toLowerCase()
          const filterLoc = selectedLocation.toLowerCase()
          if (!productLoc.includes(filterLoc) && !filterLoc.includes(productLoc)) {
            return false
          }
        }
        if (minPrice && p.price_per_kg < Number(minPrice)) return false
        if (maxPrice && p.price_per_kg > Number(maxPrice)) return false
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
        return dateB - dateA || b.id.localeCompare(a.id)
      })
  }, [rawProducts, category, selectedLocation, minPrice, maxPrice, search, sortBy])

  const handleResetFilters = (): void => {
    setCategory('Semua')
    setSelectedLocation('Semua')
    setMinPrice('')
    setMaxPrice('')
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
    <div className="max-w-[1680px] mx-auto px-3.5 sm:px-8 lg:px-12 py-4 sm:py-8 pb-24 lg:pb-8 space-y-3.5 sm:space-y-6">
      <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Store size={20} className="text-emerald-700 sm:w-6 sm:h-6 shrink-0" />
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">Katalog Hasil Panen</h1>
          </div>
          <p className="hidden sm:block text-xs text-slate-500 mt-1">
            Jelajahi dan pesan komoditas pangan segar berkualitas tinggi langsung dari sentra pertanian lokal.
          </p>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
            onClick={() => setIsAddProductOpen(true)}
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Tambah Komoditas Baru</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-8">
        <CatalogSidebar
          categories={categories}
          selectedCategory={category}
          onSelectCategory={handleCategoryChange}
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onResetFilters={handleResetFilters}
          totalFiltered={filteredAndSortedProducts.length}
          isMobileDrawerOpen={isMobileFilterOpen}
          onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
        />

        <main className="flex-1 min-w-0 space-y-5 sm:space-y-6 w-full">
          <CatalogSortBar
            search={search}
            onSearchChange={handleSearchChange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            totalCount={filteredAndSortedProducts.length}
            startIndex={startIndex}
            endIndex={endIndex}
            onOpenFilter={() => setIsMobileFilterOpen(true)}
            activeFiltersCount={activeFiltersCount}
          />

          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -mt-2">
            {categories.map((cat) => {
              const isActive = category === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {isProductsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-500 font-medium">Memuat komoditas panen dari database MongoDB...</p>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80 p-8 shadow-xs space-y-3">
              <p className="text-sm font-semibold text-slate-700">Tidak ada komoditas hasil panen yang sesuai dengan kriteria filter.</p>
              <p className="text-xs text-slate-400">Silakan sesuaikan batas harga, lokasi, atau tekan tombol reset filter.</p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer mt-2"
              >
                <span>Hapus Semua Filter</span>
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
                {paginatedProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                    onOpenDetail={setSelectedProductForDetail}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">
                    Halaman {currentPage} dari {totalPages} ({filteredAndSortedProducts.length} komoditas)
                  </span>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                    >
                      <ChevronLeft size={16} />
                      <span>Sebelumnya</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <span className="sm:hidden text-xs font-bold text-slate-700 px-2">
                      {currentPage} / {totalPages}
                    </span>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
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

      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onDelete={handleDeleteProduct}
      />
    </div>
  )
}
