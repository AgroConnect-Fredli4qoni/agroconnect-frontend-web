import React, { useState } from 'react'
import { MapPin, User, Check, Plus, Minus, Trash2 } from 'lucide-react'
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
  if (category === 'Sayur') return '🥬'
  if (category === 'Buah') return '🍎'
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

  return (
    <div className="product-card">
      <div className="product-card-top">
        <div className="product-emoji-display">{emoji}</div>
        <div className="product-badges">
          <span className="category-tag">{product.category}</span>
          {product.is_organic && <span className="organic-tag">🌱 Organik</span>}
        </div>
      </div>

      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-meta">
          <div className="meta-row">
            <MapPin size={14} />
            <span>{product.origin_region}</span>
          </div>
          <div className="meta-row">
            <User size={14} />
            <span>{product.farmer_name}</span>
          </div>
        </div>

        <div className="product-pricing">
          <div>
            <span className="price-label">Harga per {product.unit}</span>
            <div className="price-value">
              Rp {product.price_per_kg.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="stock-info">
            <span className="stock-label">Stok Panen</span>
            <span className={`stock-value ${product.stock_kg < 50 ? 'low' : ''}`}>
              {product.stock_kg} {product.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="product-footer">
        {product.stock_kg > 0 ? (
          <div className="cart-action-group">
            <div className="qty-control">
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                disabled={qty <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="qty-number">{qty}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty((prev) => Math.min(product.stock_kg, prev + 1))}
                disabled={qty >= product.stock_kg}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              className={`add-cart-btn ${isAdded ? 'success' : ''}`}
              onClick={handleAdd}
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  <span>Ditambahkan</span>
                </>
              ) : (
                <span>Beli Panen</span>
              )}
            </button>
          </div>
        ) : (
          <div className="out-of-stock-notice">Stok Habis</div>
        )}

        {user?.role === 'admin' && onDelete && (
          <button
            type="button"
            className="delete-item-btn"
            onClick={() => onDelete(product.id)}
            title="Hapus komoditas dari katalog"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
