import React from 'react'
import { Store, ShoppingBag } from 'lucide-react'

export type TransactionPov = 'seller' | 'buyer'

/**
 * TransactionPovToggleProps defines the properties required by TransactionPovToggle.
 */
export interface TransactionPovToggleProps {
  currentPov: TransactionPov
  onPovChange: (pov: TransactionPov) => void
  sellerCount?: number
  buyerCount?: number
}

/**
 * TransactionPovToggle renders a dual-mode segmented toggle enabling users to switch between seller and buyer transactional views.
 *
 * @param props - Component configuration including current POV mode and order counts.
 * @returns JSX Element presenting interactive viewpoint switcher.
 */
export function TransactionPovToggle(props: TransactionPovToggleProps): React.JSX.Element {
  const { currentPov, onPovChange, sellerCount, buyerCount } = props

  return (
    <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
      <button
        type="button"
        onClick={() => onPovChange('seller')}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentPov === 'seller'
            ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <Store size={15} className={currentPov === 'seller' ? 'text-emerald-600' : 'text-slate-400'} />
        <span>Pesanan Masuk (Penjual)</span>
        {typeof sellerCount === 'number' && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              currentPov === 'seller'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {sellerCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onPovChange('buyer')}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentPov === 'buyer'
            ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
        }`}
      >
        <ShoppingBag size={15} className={currentPov === 'buyer' ? 'text-emerald-600' : 'text-slate-400'} />
        <span>Belanjaan Saya (Pembeli)</span>
        {typeof buyerCount === 'number' && (
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
              currentPov === 'buyer'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {buyerCount}
          </span>
        )}
      </button>
    </div>
  )
}
