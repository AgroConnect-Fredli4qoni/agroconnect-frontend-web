import React, { useState, useEffect, useCallback } from 'react'
import { WeatherWidget } from '../components/WeatherWidget'
import { RecommendationBanner } from '../components/RecommendationBanner'
import { ProductFilter } from '../components/ProductFilter'
import { ProductCard } from '../components/ProductCard'
import { AddProductModal } from '../components/AddProductModal'
import { Product } from '../types/product'
import { WeatherResponse } from '../types/weather'
import { fetchProducts, fetchWeather, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * HomePageProps defines optional modal controllers for farmer product additions.
 */
export interface HomePageProps {
  isAddProductOpen: boolean
  setIsAddProductOpen: (open: boolean) => void
}

/**
 * HomePage presents the main agricultural marketplace, live BMKG weather analytics, and catalog cards.
 *
 * @param props - Modal controller state for adding products.
 * @returns JSX Element rendering home and catalog view.
 */
export function HomePage(props: HomePageProps): React.JSX.Element {
  const { isAddProductOpen, setIsAddProductOpen } = props
  const { token } = useAuth()

  const [selectedRegion, setSelectedRegion] = useState<string>('Jawa Barat')
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false)

  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('Semua')

  const loadWeather = useCallback(async (region: string): Promise<void> => {
    setIsWeatherLoading(true)
    try {
      const data = await fetchWeather(region)
      setWeather(data)
    } catch {
      setWeather(null)
    } finally {
      setIsWeatherLoading(false)
    }
  }, [])

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
    loadWeather(selectedRegion)
  }, [loadWeather, selectedRegion])

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
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      <RecommendationBanner recommendation={weather?.recommendation || null} />

      <WeatherWidget
        weather={weather}
        isLoading={isWeatherLoading}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg: string) => setSelectedRegion(reg)}
      />

      <section className="my-8" id="katalog">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">🌾 Katalog Hasil Panen Petani</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pesan komoditas pangan segar langsung dari sentra pertanian tanpa perantara.</p>
        </div>

        <ProductFilter
          search={search}
          onSearchChange={setSearch}
          selectedCategory={category}
          onCategoryChange={setCategory}
        />

        {isProductsLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat komoditas panen dari database MongoDB...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <p className="text-xs text-slate-500">Tidak ada komoditas hasil panen yang sesuai dengan pencarian.</p>
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
      </section>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={loadProducts}
      />
    </div>
  )
}
