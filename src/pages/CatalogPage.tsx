import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, PlusCircle, Store } from 'lucide-react'
import { ProductFilter } from '../components/ProductFilter'
import { ProductCard } from '../components/ProductCard'
import { AddProductModal } from '../components/AddProductModal'
import { Product } from '../types/product'
import { fetchProducts, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * CatalogPageProps defines modal controllers for farmer product publication.
 */
export interface CatalogPageProps {
  isAddProductOpen: boolean
  setIsAddProductOpen: (open: boolean) => void
}

/**
 * CatalogPage presents the dedicated comprehensive agricultural marketplace and search filters.
 *
 * @param props - Modal controller state for commodity creation.
 * @returns JSX Element rendering complete commodity catalog.
 */
export function CatalogPage(props: CatalogPageProps): React.JSX.Element {
  const { isAddProductOpen, setIsAddProductOpen } = props
  const { token, user, isAuthenticated } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('Semua')

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
        <span>Menampilkan {products.length} komoditas pertanian</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
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
