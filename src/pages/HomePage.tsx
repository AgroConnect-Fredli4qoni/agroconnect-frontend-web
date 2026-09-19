import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Store, CloudSun, ShieldCheck } from 'lucide-react'
import { WeatherWidget } from '../components/WeatherWidget'
import { RecommendationBanner } from '../components/RecommendationBanner'
import { ProductCard } from '../components/ProductCard'
import { Product } from '../types/product'
import { WeatherResponse } from '../types/weather'
import { fetchProducts, fetchWeather, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * HomePage presents the primary platform landing view, hero banner, BMKG weather analytics, and featured commodities.
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
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-semibold">
            <Sparkles size={14} />
            <span>Platform Agrikultur Cerdas Terintegrasi BMKG</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Hubungkan Hasil Panen Petani Langsung ke Meja Anda
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-2xl">
            Solusi digital rantai pasok agrikultur Indonesia dengan panduan cuaca presisi BMKG,
            transparansi harga pasar adil, dan kepastian transaksi aman bagi petani maupun pembeli.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-black rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Store size={18} />
              <span>Jelajahi Katalog Lengkap</span>
            </Link>
            <a
              href="#cuaca"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
            >
              <CloudSun size={18} />
              <span>Pantau Cuaca Tani BMKG</span>
            </a>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 text-xs text-emerald-200 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={16} />
              <span>Transaksi Aman & Bergaransi Mutu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CloudSun size={16} />
              <span>Satelit & Sensor Agroklimat BMKG</span>
            </div>
          </div>
        </div>
      </section>

      <RecommendationBanner recommendation={weather?.recommendation || null} />

      <WeatherWidget
        weather={weather}
        isLoading={isWeatherLoading}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg: string) => setSelectedRegion(reg)}
      />

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">🌾 Komoditas Pilihan Unggulan</h2>
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
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <p className="text-xs text-slate-500">Belum ada komoditas pilihan yang tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center pt-4 pb-2">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all text-sm cursor-pointer"
          >
            <span>Lihat Semua Katalog Hasil Tani</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
