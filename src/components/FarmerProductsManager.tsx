import React, { useEffect, useState } from 'react'
import { PlusCircle, Edit2, Trash2, Sprout, AlertCircle, RefreshCw, CheckCircle2, Package, MapPin } from 'lucide-react'
import { Product } from '../types/product'
import { fetchProducts, deleteProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AddProductModal } from './AddProductModal'
import { EditProductModal } from './EditProductModal'

/**
 * FarmerProductsManager renders the commodity catalog management dashboard for farmers and administrators.
 *
 * @returns JSX Element presenting commodity table, statistics, and mutation dialogs.
 */
export function FarmerProductsManager(): React.JSX.Element {
  const { user, token } = useAuth()

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [actionError, setActionError] = useState<string>('')
  const [actionSuccess, setActionSuccess] = useState<string>('')

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const loadFarmerProducts = async (): Promise<void> => {
    if (!user) return
    setIsLoading(true)
    setActionError('')

    try {
      const allProducts = await fetchProducts()
      const filtered = user.role === 'admin'
        ? allProducts
        : allProducts.filter((p) => {
            if (p.farmer_id && p.farmer_id === user.id) return true
            if (p.farmer_name && p.farmer_name.trim().toLowerCase() === user.name.trim().toLowerCase()) return true
            return false
          })
      setProducts(filtered)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message)
      } else {
        setActionError('Gagal memuat daftar komoditas Anda.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFarmerProducts()
  }, [user])

  const handleDelete = async (product: Product): Promise<void> => {
    if (!token) return

    const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus komoditas "${product.name}"?`)
    if (!confirmed) return

    setActionError('')
    setActionSuccess('')

    try {
      await deleteProduct(product.id, token)
      setActionSuccess(`Komoditas "${product.name}" berhasil dihapus dari katalog.`)
      await loadFarmerProducts()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setActionError(err.message)
      } else {
        setActionError('Gagal menghapus komoditas.')
      }
    }
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Kelola Komoditas Hasil Tani</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.role === 'admin'
              ? 'Kelola seluruh komoditas terdaftar dalam ekosistem AgroConnect.'
              : `Daftar komoditas aktif yang dikelola oleh ${user?.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadFarmerProducts}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Muat Ulang Komoditas"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Tambah Komoditas</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <RefreshCw size={24} className="animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Memuat katalog komoditas Anda...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Belum Ada Komoditas yang Dipublikasikan</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Mulailah mempublikasikan hasil panen segar Anda agar dapat dipesan langsung oleh pembeli di nusantara.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Tambah Komoditas Pertama</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Komoditas</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Harga Satuan</th>
                  <th className="py-3.5 px-4">Stok Tersedia</th>
                  <th className="py-3.5 px-4">Wilayah Asal</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none'
                              }}
                            />
                          ) : (
                            <Sprout size={20} className="text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">{item.name}</span>
                          {item.is_organic && (
                            <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Organik
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatPrice(item.price_per_kg)} / {item.unit || 'Kg'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          item.stock_kg > 20
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.stock_kg > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {item.stock_kg} {item.unit || 'Kg'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="inline-flex items-center gap-1 text-[11px]">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span>{item.origin_region}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Sunting Komoditas"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Komoditas"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductCreated={() => {
          setActionSuccess('Komoditas baru berhasil ditambahkan!')
          loadFarmerProducts()
        }}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={() => {
          setActionSuccess('Komoditas berhasil diperbarui!')
          loadFarmerProducts()
        }}
      />
    </div>
  )
}
