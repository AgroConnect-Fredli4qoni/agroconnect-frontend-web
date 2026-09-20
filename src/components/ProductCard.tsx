import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Check, Plus, Minus, Trash2, Star, Wheat, Salad, Carrot, Flame, Sprout, Leaf, Apple } from 'lucide-react'
import { Product } from '../types/product'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { slugifyFarmerName } from '../services/farmerService'

/**
 * ProductCardProps defines item specification and optional deletion callback.
 */
export interface ProductCardProps {
  product: Product
  onDelete?: (id: string) => void
  onOpenDetail?: (product: Product) => void
}

/**
 * Resolves deterministic star rating based on product identity.
 *
 * @param id - Commodity identifier.
 * @param name - Commodity title.
 * @returns Rating number between 4.5 and 5.0.
 */
export function getProductRating(id: string, name: string): number {
  const seed = (id.charCodeAt(0) || 0) + name.length
  const step = seed % 6
  return Number((4.5 + step * 0.1).toFixed(1))
}

/**
 * Resolves estimated sold count for sales popularity.
 *
 * @param product - Commodity item.
 * @returns Estimated quantity sold.
 */
export function getProductSales(product: Product): number {
  const seed = (product.name.length * 17 + (product.price_per_kg % 100)) % 180
  return 25 + seed
}

function renderFallbackCategoryIcon(category: string, name: string): React.JSX.Element {
  const n = name.toLowerCase()
  if (n.includes('wortel')) return <Carrot size={38} className="text-emerald-700" />
  if (n.includes('cabai') || n.includes('rawit') || n.includes('bawang') || n.includes('jahe')) {
    return <Flame size={38} className="text-rose-600" />
  }
  if (category === 'Pangan Pokok' || n.includes('beras') || n.includes('jagung')) {
    return <Wheat size={38} className="text-amber-700" />
  }
  if (category === 'Sayur') {
    return <Salad size={38} className="text-emerald-700" />
  }
  if (category === 'Buah') {
    return <Apple size={38} className="text-rose-600" />
  }
  return <Sprout size={38} className="text-emerald-700" />
}

/**
 * ProductCard renders individual commodity item with details, stock, and add-to-cart trigger.
 *
 * @param props - Product specification and action handlers.
 * @returns JSX Element presenting commodity card.
 */
export function ProductCard(props: ProductCardProps): React.JSX.Element {
  const { product, onDelete, onOpenDetail } = props
  const { addItem } = useCart()
  const { user } = useAuth()
  const [qty, setQty] = useState<number>(1)
  const [isAdded, setIsAdded] = useState<boolean>(false)
  const [imageFailed, setImageFailed] = useState<boolean>(false)
  const [avatarFailed, setAvatarFailed] = useState<boolean>(false)

  const handleAdd = (): void => {
    if (product.stock_kg <= 0) return
    addItem(product, qty)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const rating = getProductRating(product.id, product.name)
  const sales = getProductSales(product)
  const hasImage = Boolean(product.image_url && !imageFailed)

  return (
    <div
      className="bg-white rounded-xl border border-slate-200/80 hover:border-emerald-300 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
      onClick={() => onOpenDetail?.(product)}
    >
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
        {hasImage ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-slate-50 to-emerald-100/40 text-emerald-800 p-4 select-none">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-2xs border border-emerald-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              {renderFallbackCategoryIcon(product.category, product.name)}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 text-center">
              Hasil Panen Petani
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/90 shadow-2xs">
            {product.category}
          </span>
          {product.is_organic && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              <Leaf size={11} className="text-emerald-700" />
              <span>Organik</span>
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">
            <Star size={11} className="fill-amber-400 text-amber-500" />
            <span>{rating}</span>
          </span>
          <span className="text-[10px] text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md font-semibold border border-slate-200 shadow-2xs">
            Terjual {sales} kg
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-black text-slate-900 text-base leading-snug">{product.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{product.origin_region}</span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <Link
              to={`/petani/${slugifyFarmerName(product.farmer_name)}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 group/farmer min-w-0"
              title={`Kunjungi profil toko ${product.farmer_name}`}
            >
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs group-hover/farmer:border-emerald-500 transition-colors">
                {product.farmer_avatar_url && !avatarFailed ? (
                  <img
                    src={product.farmer_avatar_url}
                    alt={product.farmer_name}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarFailed(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                    {product.farmer_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover/farmer:text-emerald-700 group-hover/farmer:underline transition-colors truncate">
                {product.farmer_name}
              </span>
            </Link>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Harga / {product.unit}</span>
            <span className="text-base font-black text-emerald-700">Rp {product.price_per_kg.toLocaleString('id-ID')}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Stok Panen</span>
            <span className={`text-xs font-black ${product.stock_kg < 50 ? 'text-amber-600' : 'text-slate-700'}`}>
              {product.stock_kg} {product.unit}
            </span>
          </div>
        </div>
      </div>

      <div
        className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {product.stock_kg > 0 ? (
          <div className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                onClick={() => setQty((prev: number): number => Math.max(1, prev - 1))}
                disabled={qty <= 1}
              >
                <Minus size={13} />
              </button>
              <span className="w-6 text-center text-xs font-bold text-slate-800">{qty}</span>
              <button
                type="button"
                className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                onClick={() => setQty((prev: number): number => Math.min(product.stock_kg, prev + 1))}
                disabled={qty >= product.stock_kg}
              >
                <Plus size={13} />
              </button>
            </div>

            <button
              type="button"
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isAdded ? 'bg-emerald-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              onClick={handleAdd}
            >
              {isAdded ? (
                <>
                  <Check size={14} />
                  <span>Ditambahkan</span>
                </>
              ) : (
                <span>Beli Panen</span>
              )}
            </button>
          </div>
        ) : (
          <span className="text-xs font-bold text-rose-500 py-1.5 px-3 bg-rose-50 rounded-lg border border-rose-100 w-full text-center">
            Stok Habis
          </span>
        )}

        {user?.role === 'admin' && onDelete && (
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            onClick={() => onDelete(product.id)}
            title="Hapus komoditas dari katalog"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
