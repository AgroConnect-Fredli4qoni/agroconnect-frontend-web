import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, PlusCircle, Store, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductFilter } from '../components/ProductFilter'
import { ProductCard } from '../components/ProductCard'
import { AddProductModal } from '../components/AddProductModal'
import { Product } from '../types/product'
import { fetchProducts, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

const ITEMS_PER_PAGE = 20

/**
 * CatalogPageProps defines modal controllers for farmer product publication.
 */
export interface CatalogPageProps {
  isAddProductOpen: boolean
  setIsAddProductOpen: (open: boolean) => void
}

/**
 * CatalogPage presents the dedicated comprehensive agricultural marketplace, search filters, and pagination.
 *
 * @param props - Modal controller state for commodity creation.
 * @returns JSX Element rendering complete commodity catalog with pagination.
 */
export function CatalogPage(props: CatalogPageProps): React.JSX.Element {
  const { isAddProductOpen, setIsAddProductOpen } = props
  const { token, user, isAuthenticated } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('Semua')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const loadProducts = useCallback(async (): Promise<void> => {
    setIsProductsLoading(true)
    try {
      const data = await fetchProducts(search, category)
      setProducts(data)
    } catch {
      setProducts([])
    } finally {
      setIsProductsLoading(false)
    }
  }, [search, category])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, category])

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

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = products.slice(startIndex, endIndex)

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

      <ProductFilter
        search={search}
        onSearchChange={setSearch}
        selectedCategory={category}
        onCategoryChange={setCategory}
      />

      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>
          {products.length > 0
            ? `Menampilkan ${startIndex + 1} - ${Math.min(endIndex, products.length)} dari ${products.length} komoditas (Maks. ${ITEMS_PER_PAGE} per halaman)`
            : 'Menampilkan 0 komoditas'}
        </span>
        <span>Kategori: {category}</span>
      </div>

      {isProductsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Memuat komoditas panen dari database MongoDB...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-3">
          <p className="text-sm font-semibold text-slate-700">Tidak ada komoditas hasil panen yang sesuai dengan pencarian.</p>
          <p className="text-xs text-slate-400">Silakan gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                Halaman {currentPage} dari {totalPages} ({products.length} komoditas)
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

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={loadProducts}
      />
    </div>
  )
}
