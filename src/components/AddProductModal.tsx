import React, { useState } from 'react'
import { X, PlusCircle } from 'lucide-react'
import { CreateProductInput } from '../types/product'
import { createProduct } from '../services/api'
import { useAuth } from '../context/AuthContext'

/**
 * AddProductModalProps defines modal visibility and completion callbacks.
 */
export interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductCreated: () => void
}

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
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <PlusCircle size={22} className="text-primary" />
            <h3>Unggah Komoditas Panen Baru</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && <div className="modal-error-alert">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="prod-name">Nama Komoditas / Hasil Tani *</label>
            <input
              id="prod-name"
              type="text"
              required
              placeholder="Contoh: Beras Rojolele Super"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-cat">Kategori Pertanian *</label>
              <select
                id="prod-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Pangan Pokok">Pangan Pokok</option>
                <option value="Sayur">Sayur</option>
                <option value="Bumbu">Bumbu</option>
                <option value="Buah">Buah</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prod-region">Asal Daerah Sentra *</label>
              <input
                id="prod-region"
                type="text"
                required
                placeholder="Contoh: Cianjur, Jawa Barat"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-price">Harga per Kg (Rp) *</label>
              <input
                id="prod-price"
                type="number"
                required
                min="500"
                placeholder="16500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-stock">Jumlah Stok Panen (Kg) *</label>
              <input
                id="prod-stock"
                type="number"
                required
                min="1"
                placeholder="500"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prod-farmer">Nama Petani / Kelompok Tani *</label>
            <input
              id="prod-farmer"
              type="text"
              required
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
            />
          </div>

          <div className="checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isOrganic}
                onChange={(e) => setIsOrganic(e.target.checked)}
              />
              <span>Kultivasi Organik (Bebas Pestisida Kimia)</span>
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="prod-desc">Deskripsi & Spesifikasi Mutu</label>
            <textarea
              id="prod-desc"
              rows={3}
              placeholder="Jelaskan kualitas hasil panen, varietas benih, dan jadwal pemetikan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Batal
            </button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan ke Katalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
