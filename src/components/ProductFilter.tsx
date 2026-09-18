import React from 'react'
import { Search } from 'lucide-react'

/**
 * ProductFilterProps defines filtering search term and category selector handlers.
 */
export interface ProductFilterProps {
  search: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = ['Semua', 'Pangan Pokok', 'Sayur', 'Bumbu']

/**
 * ProductFilter component provides real-time search filtering and category segmentation.
 *
 * @param props - Current filter states and event emitters.
 * @returns JSX Element rendering category bar and search input.
 */
export function ProductFilter(props: ProductFilterProps): React.JSX.Element {
  const { search, onSearchChange, selectedCategory, onCategoryChange } = props

  return (
    <div className="product-filter-bar">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Cari komoditas tani (contoh: Beras, Cabai, Jagung)..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
