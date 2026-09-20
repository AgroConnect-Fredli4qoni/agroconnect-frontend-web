import React, { useState } from 'react'
import { X, PlusCircle, Navigation } from 'lucide-react'
import { CreateProductInput } from '../types/product'
import { createProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { CustomDropdown, DropdownOption } from './CustomDropdown'
import { CustomCheckbox } from './CustomCheckbox'
import { CustomNumberInput } from './CustomNumberInput'
import { LocationMapModal } from './LocationMapModal'

/**
 * AddProductModalProps defines modal visibility and completion callbacks.
 */
export interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated: () => void
}

const CATEGORY_OPTIONS: DropdownOption[] = [
  { value: 'Pangan Pokok', label: 'Pangan Pokok', icon: '🌾' },
  { value: 'Sayur', label: 'Sayur', icon: '🥬' },
  { value: 'Bumbu', label: 'Bumbu', icon: '🌶️' },
  { value: 'Palawija', label: 'Palawija', icon: '🌽' },
  { value: 'Buah', label: 'Buah', icon: '🍎' }
]

/**
 * AddProductModal presents commodity registration form for farmers and administrators.
 *
 * @param props - Modal controller and refresh triggers.
 * @returns JSX Element rendering product publication dialog.
 */
export function AddProductModal(props: AddProductModalProps): React.JSX.Element {
  const { isOpen, onClose, onProductCreated } = props
  const { token, user } = useAuth()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Pangan Pokok')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [region, setRegion] = useState('Jawa Barat')
  const [farmerName, setFarmerName] = useState(user?.name || 'Kelompok Tani Makmur')
  const [isOrganic, setIsOrganic] = useState(true)
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isMapOpen, setIsMapOpen] = useState(false)

  if (!isOpen) return <></>

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!token) {
      setErrorMsg('Otentikasi dibutuhkan. Silakan login terlebih dahulu.')
      return
    }

    const priceNum = parseFloat(price)
    const stockNum = parseInt(stock, 10)

    if (!name || isNaN(priceNum) || priceNum <= 0 || isNaN(stockNum) || stockNum < 0) {
      setErrorMsg('Harap lengkapi seluruh field wajib dengan angka yang valid.')
      return
    }

    setIsLoading(true)
    setErrorMsg('')

    try {
      const payload: CreateProductInput = {
        name,
        category,
        price_per_kg: priceNum,
        stock_kg: stockNum,
        unit: 'Kg',
        origin_region: region,
        farmer_name: farmerName,
        is_organic: isOrganic,
        description,
      }

      await createProduct(payload, token)
      onProductCreated()
      onClose()
      setName('')
      setPrice('')
      setStock('')
      setDescription('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('Gagal menambahkan produk komoditas.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 my-8 transition-all">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <PlusCircle size={22} className="text-emerald-600" />
            <h3 className="font-black text-slate-900 text-lg tracking-tight">Unggah Komoditas Panen Baru</h3>
          </div>
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prod-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Komoditas / Hasil Tani *
            </label>
            <input
              id="prod-name"
              type="text"
              required
              placeholder="Contoh: Beras Rojolele Super"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prod-cat" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Pertanian *
              </label>
              <CustomDropdown
                id="prod-cat"
                value={category}
                onChange={setCategory}
                options={CATEGORY_OPTIONS}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="prod-region" className="block text-xs font-semibold text-slate-700">
                  Asal Daerah Sentra *
                </label>
                <button
                  type="button"
                  onClick={() => setIsMapOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <Navigation size={12} />
                  <span>Pilih di Peta</span>
                </button>
              </div>
              <input
                id="prod-region"
                type="text"
                required
                placeholder="Contoh: Cianjur, Jawa Barat"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prod-price" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Harga per Kg (Rp) *
              </label>
              <CustomNumberInput
                id="prod-price"
                prefix="Rp"
                required
                min={500}
                placeholder="16500"
                value={price}
                onChange={setPrice}
              />
            </div>

            <div>
              <label htmlFor="prod-stock" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah Stok Panen (Kg) *
              </label>
              <CustomNumberInput
                id="prod-stock"
                suffix="Kg"
                required
                min={1}
                placeholder="500"
                value={stock}
                onChange={setStock}
              />
            </div>
          </div>

          <div>
            <label htmlFor="prod-farmer" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Petani / Kelompok Tani *
            </label>
            <input
              id="prod-farmer"
              type="text"
              required
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <CustomCheckbox
              id="prod-organic"
              checked={isOrganic}
              onChange={setIsOrganic}
              label="Kultivasi Organik (Bebas Pestisida Kimia)"
              description="Sertifikasi bebas pupuk & pestisida sintetis"
            />
          </div>

          <div>
            <label htmlFor="prod-desc" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi & Spesifikasi Mutu
            </label>
            <textarea
              id="prod-desc"
              rows={3}
              placeholder="Jelaskan kualitas hasil panen, varietas benih, dan jadwal pemetikan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              className="py-2.5 px-5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan ke Katalog'}
            </button>
          </div>
        </form>
      </div>

      <LocationMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        currentLocation={region}
        onSelectLocation={(loc) => {
          setRegion(loc)
        }}
        title="Tentukan Lokasi Sentra Kebun / Lahan"
      />
    </div>
  )
}
