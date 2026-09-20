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
  Scale
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
  if (n.includes('wortel')) return <Carrot size={54} className="text-emerald-700" />
  if (n.includes('cabai') || n.includes('rawit') || n.includes('bawang') || n.includes('jahe')) {
    return <Flame size={54} className="text-rose-600" />
  }
  if (category === 'Pangan Pokok' || n.includes('beras') || n.includes('jagung')) {
    return <Wheat size={54} className="text-amber-700" />
  }
  if (category === 'Sayur') {
    return <Salad size={54} className="text-emerald-700" />
  }
  if (category === 'Buah') {
    return <Apple size={54} className="text-rose-600" />
  }
  return <Sprout size={54} className="text-emerald-700" />
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
export function ProductDetailModal(props: ProductDetailModalProps): React.JSX.Element {
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
    }
  }, [product])

  if (!isOpen || !product) {
    return <></>
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
        className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs border border-slate-200/80 cursor-pointer"
          title="Tutup dialog"
        >
          <X size={18} />
        </button>

        <div className="overflow-y-auto p-5 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="md:col-span-5 space-y-4">
              <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-2xs">
                {hasImage ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageFailed(true)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/50 p-6 text-emerald-800 select-none">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-xs border border-emerald-100 flex items-center justify-center mb-3">
                      {renderFallbackCategoryIcon(product.category, product.name)}
                    </div>
                    <span className="text-xs font-bold text-slate-600">Dokumentasi Panen Segar</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">Langsung dari Lahan Petani</span>
                  </div>
                )}

                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {product.category}
                  </span>
                  {product.is_organic && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs">
                      <Leaf size={12} className="text-emerald-700" />
                      <span>100% Organik</span>
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
                    <Star size={13} className="fill-amber-400 text-amber-500" />
                    <span>{rating}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    Terjual {sales} {product.unit}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldCheck size={16} className="text-emerald-700 shrink-0" />
                  <span>Jaminan Standar Mutu AgroConnect</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800">
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

            <div className="md:col-span-7 flex flex-col space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h2>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-700">
                    Rp {product.price_per_kg.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    / {product.unit}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                    {product.farmer_avatar_url && !farmerAvatarFailed ? (
                      <img
                        src={product.farmer_avatar_url}
                        alt={product.farmer_name}
                        className="w-full h-full object-cover"
                        onError={() => setFarmerAvatarFailed(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                        {product.farmer_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mitra Petani</span>
                    <span className="text-xs font-black text-slate-900 block">{product.farmer_name}</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span>{product.origin_region}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck size={12} />
                    <span>Terverifikasi</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate(`/petani/${slugifyFarmerName(product.farmer_name)}`)
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    Kunjungi Toko Petani &rarr;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Sprout size={12} />
                    <span className="text-[10px] font-bold uppercase">Kategori</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{product.category}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Leaf size={12} />
                    <span className="text-[10px] font-bold uppercase">Metode Tanam</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {product.is_organic ? 'Organik' : 'Konvensional'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Scale size={12} />
                    <span className="text-[10px] font-bold uppercase">Stok Tersedia</span>
                  </div>
                  <span className={`text-xs font-bold mt-0.5 block truncate ${product.stock_kg < 50 ? 'text-amber-600' : 'text-slate-800'}`}>
                    {product.stock_kg} {product.unit}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold uppercase">Waktu Panen</span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                    {formatHarvestDate(product.created_at)}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Deskripsi Hasil Panen</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  {product.description || 'Komoditas pertanian segar pilihan bermutu tinggi langsung dari lahan petani terverifikasi AgroConnect.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">Jumlah Pembelian</span>
                    <span className="text-xs text-slate-400">Pilih kuantitas sesuai kebutuhan</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                        disabled={qty <= 1 || product.stock_kg <= 0}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-slate-800">{qty}</span>
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                        onClick={() => setQty((prev) => Math.min(product.stock_kg, prev + 1))}
                        disabled={qty >= product.stock_kg}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Subtotal</span>
                      <span className="text-sm font-black text-emerald-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  {product.stock_kg > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className={`w-full sm:flex-1 py-3 px-4 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                          isAdded
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-white hover:bg-slate-50 text-emerald-700 border-emerald-600'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check size={16} />
                            <span>Berhasil Ditambahkan</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={16} />
                            <span>Tambah ke Keranjang</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full sm:flex-1 py-3 px-4 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Beli Sekarang</span>
                        <ArrowRight size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs text-center">
                      Stok Komoditas Sedang Kosong
                    </div>
                  )}

                  {user?.role === 'admin' && onDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer"
                      title="Hapus komoditas panen dari sistem"
                    >
                      <Trash2 size={16} />
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
