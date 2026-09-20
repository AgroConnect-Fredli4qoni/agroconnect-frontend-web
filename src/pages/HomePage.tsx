import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { HeroSlideshow } from '../components/HeroSlideshow'
import { CategorySection } from '../components/CategorySection'
import { ProductCard } from '../components/ProductCard'
import { ProductDetailModal } from '../components/ProductDetailModal'
import { Product } from '../types/product'
import { WeatherResponse } from '../types/weather'
import { fetchProducts, fetchWeather, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * HomePage presents the primary platform landing view, hero banner slideshow, category navigation, and featured commodities.
 *
 * @returns JSX Element rendering homepage view.
 */
export function HomePage(): React.JSX.Element {
  const { token } = useAuth()

  const [selectedRegion, setSelectedRegion] = useState<string>('Jawa Barat')
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false)

  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null)

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
      const data = await fetchProducts()
      setProducts(data)
    } catch {
      setProducts([])
    } finally {
      setIsProductsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWeather(selectedRegion)
  }, [loadWeather, selectedRegion])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const handleDeleteProduct = async (id: string): Promise<void> => {
    if (!token) return
    if (!window.confirm('Apakah Anda yakin ingin menghapus komoditas ini?')) return

    try {
      await deleteProduct(id, token)
      loadProducts()
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message)
      }
    }
  }

  const featuredProducts = products.slice(0, 4)

  return (
    <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
      <HeroSlideshow
        weather={weather}
        isWeatherLoading={isWeatherLoading}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg: string) => setSelectedRegion(reg)}
      />

      <CategorySection />

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles size={22} className="text-emerald-700" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Komoditas Pilihan Unggulan</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Beberapa hasil panen terbaik dari mitra petani lokal yang siap dikirim langsung hari ini.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors self-start sm:self-auto"
          >
            <span>Buka Seluruh Katalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {isProductsLoading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat komoditas pilihan...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200/80 p-8 shadow-xs">
            <p className="text-xs text-slate-500">Belum ada komoditas pilihan yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
                onOpenDetail={setSelectedProductForDetail}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center pt-4 pb-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-lg shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
          >
            <span>Lihat Semua Katalog Hasil Tani</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onDelete={handleDeleteProduct}
      />
    </div>
  )
}
