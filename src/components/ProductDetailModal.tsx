import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  MapPin,
  Star,
  Leaf,
  ShieldCheck,
  Award,
  Sprout,
  Wheat,
  Salad,
  Carrot,
  Flame,
  Apple,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
  Trash2,
  Check,
  Calendar,
  Scale,
  Store
} from 'lucide-react'
import { Product } from '../types/product'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { getProductRating, getProductSales } from './ProductCard'
import { slugifyFarmerName } from '../services/farmerService'

/**
 * ProductDetailModalProps defines configuration for commodity detail dialog.
 */
export interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (id: string) => void
}

function renderFallbackCategoryIcon(category: string, name: string): React.JSX.Element {
  const n = name.toLowerCase()
  if (n.includes('wortel')) return <Carrot size={48} className="text-emerald-700" />
  if (n.includes('cabai') || n.includes('rawit') || n.includes('bawang') || n.includes('jahe')) {
    return <Flame size={48} className="text-rose-600" />
  }
  if (category === 'Pangan Pokok' || n.includes('beras') || n.includes('jagung')) {
    return <Wheat size={48} className="text-amber-700" />
  }
  if (category === 'Sayur') {
    return <Salad size={48} className="text-emerald-700" />
  }
  if (category === 'Buah') {
    return <Apple size={48} className="text-rose-600" />
  }
  return <Sprout size={48} className="text-emerald-700" />
}

function formatHarvestDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Panen Terbaru'
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return 'Panen Terbaru'
  }
}

/**
 * ProductDetailModal renders full specifications, verified farm information, and shopping actions for a selected commodity.
 *
 * @param props - Dialog controls, item reference, and mutation callbacks.
 * @returns JSX Element presenting detailed product modal.
 */
export function ProductDetailModal(props: ProductDetailModalProps): React.JSX.Element | null {
  const { product, isOpen, onClose, onDelete } = props
  const { addItem } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [qty, setQty] = useState<number>(1)
  const [isAdded, setIsAdded] = useState<boolean>(false)
  const [imageFailed, setImageFailed] = useState<boolean>(false)
  const [farmerAvatarFailed, setFarmerAvatarFailed] = useState<boolean>(false)

  useEffect(() => {
    if (product) {
      setQty(1)
      setIsAdded(false)
      setImageFailed(false)
      setFarmerAvatarFailed(false)
    }
  }, [product])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) {
    return null
  }

  const rating = getProductRating(product.id, product.name)
  const sales = getProductSales(product)
  const hasImage = Boolean(product.image_url && !imageFailed)
  const subtotal = product.price_per_kg * qty

  const handleAddToCart = (): void => {
    if (product.stock_kg <= 0) return
    addItem(product, qty)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const handleBuyNow = (): void => {
    if (product.stock_kg <= 0) return
    addItem(product, qty)
    onClose()
    navigate('/cart')
  }

  const handleDelete = (): void => {
    if (!onDelete) return
    if (window.confirm(`Hapus komoditas "${product.name}" dari katalog panen?`)) {
      onDelete(product.id)
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-3xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs border border-slate-200/80 cursor-pointer"
          title="Tutup dialog"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto p-5 sm:p-7">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5 space-y-3.5">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
                {hasImage ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/40 p-6 text-emerald-800 select-none">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center mb-2.5">
                      {renderFallbackCategoryIcon(product.category, product.name)}
                    </div>
                    <span className="text-xs font-bold text-slate-700">Hasil Panen Petani</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 font-medium">Dokumentasi Lahan Sentra</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {product.category}
                  </span>
                  {product.is_organic && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                      <Leaf size={11} className="text-emerald-700" />
                      <span>100% Organik</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{rating}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    Terjual {sales} {product.unit}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <ShieldCheck size={15} className="text-emerald-700 shrink-0" />
                  <span>Jaminan Mutu AgroConnect</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Award size={13} className="text-emerald-600 shrink-0" />
                    <span>Grade Panen A</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Sprout size={13} className="text-emerald-600 shrink-0" />
                    <span>Dipanen Langsung</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h2>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                    Rp {product.price_per_kg.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    / {product.unit}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white border border-slate-200 shrink-0 shadow-2xs">
                    {product.farmer_avatar_url && !farmerAvatarFailed ? (
                      <img
                        src={product.farmer_avatar_url}
                        alt={product.farmer_name}
                        className="w-full h-full object-cover"
                        onError={() => setFarmerAvatarFailed(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        {product.farmer_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider leading-none">Mitra Petani</span>
                    <span className="text-xs font-black text-slate-900 block truncate mt-0.5">{product.farmer_name}</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin size={11} className="text-slate-400 shrink-0" />
                      <span className="truncate">{product.origin_region}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck size={11} />
                    <span>Terverifikasi</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate(`/petani/${slugifyFarmerName(product.farmer_name)}`)
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    <Store size={12} />
                    <span>Kunjungi Toko</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Sprout size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Kategori</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{product.category}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Leaf size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Metode Tanam</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {product.is_organic ? '100% Organik Alami' : 'Konvensional Mutu Terjaga'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Scale size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Stok Tersedia</span>
                  </div>
                  <span className={`text-xs font-bold mt-0.5 block truncate ${product.stock_kg < 50 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {product.stock_kg.toLocaleString('id-ID')} {product.unit} Tersedia
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tanggal Panen</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {formatHarvestDate(product.created_at)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Deskripsi Hasil Panen</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  {product.description || 'Komoditas pertanian segar pilihan bermutu tinggi langsung dari lahan petani terverifikasi AgroConnect.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Jumlah Pembelian</span>
                    <span className="text-[11px] text-slate-500 font-medium">Tentukan kuantitas pesanan</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        disabled={qty <= 1 || product.stock_kg <= 0}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-slate-800">{qty}</span>
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer transition-colors"
                        onClick={() => setQty((prev) => Math.min(product.stock_kg, prev + 1))}
                        disabled={qty >= product.stock_kg}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">Subtotal</span>
                      <span className="text-sm font-black text-emerald-700 leading-tight block mt-0.5">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {product.stock_kg > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`flex-1 py-2.5 px-3.5 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs ${
                          isAdded
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-white hover:bg-slate-50 text-emerald-700 border-emerald-600'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} />
                            <span>Berhasil Ditambahkan</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={15} />
                            <span>Tambah ke Keranjang</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="flex-1 py-2.5 px-3.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Beli Sekarang</span>
                        <ArrowRight size={15} />
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-2.5 px-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs text-center">
                      Stok Komoditas Sedang Kosong
                    </div>
                  )}

                  {user?.role === 'admin' && onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                      title="Hapus komoditas panen dari sistem"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
