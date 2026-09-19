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
    <div className="home-page-container">
      <RecommendationBanner recommendation={weather?.recommendation || null} />

      <WeatherWidget
        weather={weather}
        isLoading={isWeatherLoading}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg: string) => setSelectedRegion(reg)}
      />

      <section className="marketplace-section" id="katalog">
        <div className="section-header">
          <div>
            <h2>🌾 Katalog Hasil Panen Petani</h2>
            <p className="section-desc">Pesan komoditas pangan segar langsung dari sentra pertanian tanpa perantara.</p>
          </div>
        </div>

        <ProductFilter
          search={search}
          onSearchChange={setSearch}
          selectedCategory={category}
          onCategoryChange={setCategory}
        />

        {isProductsLoading ? (
          <div className="catalog-loading">
            <div className="spinner" />
            <p>Memuat komoditas panen dari database MongoDB...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-catalog">
            <p>Tidak ada komoditas hasil panen yang sesuai dengan pencarian.</p>
          </div>
        ) : (
          <div className="products-grid">
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
