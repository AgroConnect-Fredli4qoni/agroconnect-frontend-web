import React, { useState } from 'react'
import { MapPin, User, Check, Plus, Minus, Trash2, Star } from 'lucide-react'
import { Product } from '../types/product'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

/**
 * ProductCardProps defines item specification and optional deletion callback.
 */
export interface ProductCardProps {
  product: Product
  onDelete?: (id: string) => void
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

/**
 * Resolves visual emoji illustration based on commodity name and category.
 *
 * @param name - Product title.
 * @param category - Agricultural category.
 * @returns Emoji character.
 */
function getProductEmoji(name: string, category: string): string {
  const n = name.toLowerCase()
  if (n.includes('beras') || n.includes('padi')) return '🌾'
  if (n.includes('cabai') || n.includes('rawit')) return '🌶️'
  if (n.includes('jagung')) return '🌽'
  if (n.includes('tomat')) return '🍅'
  if (n.includes('bawang')) return '🧅'
  if (n.includes('kentang')) return '🥔'
  if (n.includes('wortel')) return '🥕'
  if (n.includes('brokoli')) return '🥦'
  if (n.includes('kubis') || n.includes('kol')) return '🥬'
  if (n.includes('kacang') || n.includes('kedelai')) return '🥜'
  if (n.includes('ubi') || n.includes('singkong') || n.includes('talas')) return '🍠'
  if (n.includes('jahe') || n.includes('kunyit') || n.includes('lengkuas')) return '🫚'
  if (category === 'Sayur') return '🥬'
  if (category === 'Buah') return '🍎'
  if (category === 'Palawija') return '🌽'
  return '🌱'
}

/**
 * ProductCard renders individual commodity item with details, stock, and add-to-cart trigger.
 *
 * @param props - Product specification and action handlers.
 * @returns JSX Element presenting commodity card.
 */
export function ProductCard(props: ProductCardProps): React.JSX.Element {
  const { product, onDelete } = props
  const { addItem } = useCart()
  const { user } = useAuth()
  const [qty, setQty] = useState<number>(1)
  const [isAdded, setIsAdded] = useState<boolean>(false)

  const handleAdd = (): void => {
    if (product.stock_kg <= 0) return
    addItem(product, qty)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const emoji = getProductEmoji(product.name, product.category)
  const rating = getProductRating(product.id, product.name)
  const sales = getProductSales(product)

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="bg-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
        <span className="text-5xl group-hover:scale-110 transition-transform select-none">{emoji}</span>
        <div className="flex flex-col gap-1.5 items-end">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Star size={11} className="fill-amber-400 text-amber-500" />
              <span>{rating}</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200">
              {product.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-semibold">
              Terjual {sales} kg
            </span>
            {product.is_organic && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                🌱 Organik
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-black text-slate-900 text-base leading-snug">{product.name}</h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
        </div>

        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-slate-400" />
            <span>{product.origin_region}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={13} className="text-slate-400" />
            <span>{product.farmer_name}</span>
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

      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
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
