import React, { useState, useEffect, useCallback } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { Navbar } from './components/Navbar'
import { WeatherWidget } from './components/WeatherWidget'
import { RecommendationBanner } from './components/RecommendationBanner'
import { ProductFilter } from './components/ProductFilter'
import { ProductCard } from './components/ProductCard'
import { AddProductModal } from './components/AddProductModal'
import { CartModal } from './components/CartModal'
import { OrderHistoryModal } from './components/OrderHistoryModal'
import { AuthModal } from './components/AuthModal'
import { Product } from './types/product'
import { WeatherResponse } from './types/weather'
import { fetchProducts, fetchWeather, deleteProduct } from './services/api'

/**
 * MainDashboard coordinates views, data synchronization, and global application modals.
 *
 * @returns JSX Element presenting active application tab and modals.
 */
function MainDashboard(): React.JSX.Element {
  const { token } = useAuth()

  const [activeTab, setActiveTab] = useState<'marketplace' | 'weather' | 'manage'>('marketplace')
  const [selectedRegion, setSelectedRegion] = useState<string>('Jawa Barat')
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false)

  const [products, setProducts] = useState<Product[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<string>('Semua')

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false)

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
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      <main className="main-content">
        <RecommendationBanner recommendation={weather?.recommendation || null} />

        {activeTab === 'weather' ? (
          <WeatherWidget
            weather={weather}
            isLoading={isWeatherLoading}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        ) : (
          <section className="marketplace-section">
            <div className="section-header">
              <div>
                <h2>🌾 Katalog Komoditas Hasil Panen Indonesia</h2>
                <p className="section-desc">Pesan komoditas segar langsung dari petani dengan jaminan kualitas dan transaksi transparan.</p>
              </div>
            </div>

            <ProductFilter
              search={search}
              onSearchChange={setSearch}
              selectedCategory={category}
              onCategoryChange={setCategory}
            />

            {isProductsLoading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Memuat komoditas panen dari database MongoDB...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-catalog">
                <p>Tidak ada komoditas hasil panen yang sesuai dengan pencarian.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>© 2026 AgroConnect Platform. Dibuat oleh Fredli Fourqoni untuk Uji Kompetensi Full-Stack Developer BNSP.</p>
      </footer>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => {
          setIsCartOpen(false)
          setIsAuthOpen(true)
        }}
        onOrderCompleted={loadProducts}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductCreated={loadProducts}
      />

      <OrderHistoryModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  )
}

/**
 * App root entrypoint providing top-level context wrappers.
 *
 * @returns JSX Element hierarchy.
 */
export default function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <MainDashboard />
      </CartProvider>
    </AuthProvider>
  )
}
