import React, { useState, useEffect } from 'react'
import { X, Save, Wheat, Salad, Flame, Sprout, Apple, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Product, UpdateProductInput } from '../types/product'
import { updateProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { CustomDropdown, DropdownOption } from './CustomDropdown'
import { CustomCheckbox } from './CustomCheckbox'
import { CustomNumberInput } from './CustomNumberInput'

/**
 * EditProductModalProps defines modal visibility, target commodity, and completion callbacks.
 */
export interface EditProductModalProps {
  isOpen: boolean
  product: Product | null
  onClose: () => void
  onProductUpdated: () => void
}

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'Pangan Pokok', label: 'Pangan Pokok', icon: <Wheat size={16} className="text-amber-700" /> },
  { value: 'Sayur', label: 'Sayur', icon: <Salad size={16} className="text-emerald-700" /> },
  { value: 'Bumbu', label: 'Bumbu', icon: <Flame size={16} className="text-rose-600" /> },
  { value: 'Palawija', label: 'Palawija', icon: <Sprout size={16} className="text-orange-700" /> },
  { value: 'Buah', label: 'Buah', icon: <Apple size={16} className="text-rose-600" /> },
]

/**
 * EditProductModal renders the modification dialog for editing an existing commodity.
 *
 * @param props - Modal controller, target product, and update listeners.
 * @returns JSX Element rendering product edit modal dialog.
 */
export function EditProductModal(props: EditProductModalProps): React.JSX.Element {
  const { isOpen, product, onClose, onProductUpdated } = props
  const { token } = useAuth()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Pangan Pokok')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [region, setRegion] = useState('Jawa Barat')
  const [imageUrl, setImageUrl] = useState('')
  const [isOrganic, setIsOrganic] = useState(true)
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (product) {
      setName(product.name || '')
      setCategory(product.category || 'Pangan Pokok')
      setPrice(product.price_per_kg ? product.price_per_kg.toString() : '')
      setStock(product.stock_kg ? product.stock_kg.toString() : '')
      setRegion(product.origin_region || 'Jawa Barat')
      setImageUrl(product.image_url || '')
      setIsOrganic(product.is_organic ?? true)
      setDescription(product.description || '')
      setErrorMsg('')
    }
  }, [product, isOpen])

  if (!isOpen || !product) return <></>

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token) {
      setErrorMsg('Otentikasi dibutuhkan. Silakan masuk kembali.')
      return
    }

    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock, 10)

    if (!name || isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Harap lengkapi seluruh field dengan nilai yang valid.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const payload: UpdateProductInput = {
        name,
        category,
        price_per_kg: priceNum,
        stock_kg: stockNum,
        unit: product.unit || 'Kg',
        origin_region: region,
        is_organic: isOrganic,
        description,
        image_url: imageUrl.trim() || undefined,
      }

      await updateProduct(product.id, payload, token)
      onProductUpdated()
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal memperbarui data komoditas.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Perbarui Komoditas</h2>
            <p className="text-xs text-slate-400">Sunting harga, stok, atau rincian hasil panen tani</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="my-3 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 space-y-4 pt-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Komoditas <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Beras Pandan Wangi Organik"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kategori <span className="text-rose-600">*</span>
              </label>
              <CustomDropdown
                options={CATEGORY_OPTIONS}
                value={category}
                onChange={setCategory}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Wilayah Asal <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Contoh: Jawa Barat"
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Harga per Kg (Rp) <span className="text-rose-600">*</span>
              </label>
              <CustomNumberInput
                value={price}
                onChange={setPrice}
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stok Awal (Kg) <span className="text-rose-600">*</span>
              </label>
              <CustomNumberInput
                value={stock}
                onChange={setStock}
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL Foto Produk
            </label>
            <div className="relative">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-9 pr-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <ImageIcon size={15} className="absolute left-3 top-2.5 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Komoditas
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsikan mutu hasil panen, varietas benih, dan karakteristik produk..."
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="pt-1">
            <CustomCheckbox
              id="edit-is-organic"
              label="Sertifikasi Organik (Bebas Pestisida Sintetis)"
              checked={isOrganic}
              onChange={setIsOrganic}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
