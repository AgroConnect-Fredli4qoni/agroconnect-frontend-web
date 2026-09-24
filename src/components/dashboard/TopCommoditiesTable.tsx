import React from 'react'
import { Trophy, Sprout, Package } from 'lucide-react'
import { TopProductStat } from '../../types/order'
import { formatIDR } from '../../utils/currency'

/**
 * TopCommoditiesTableProps defines properties required by TopCommoditiesTable.
 */
export interface TopCommoditiesTableProps {
  products: TopProductStat[]
}

/**
 * TopCommoditiesTable renders ranked commodities by sales volume and revenue.
 *
 * @param props - Component configuration containing array of top selling products.
 * @returns JSX Element rendering ranked commodity list.
 */
export function TopCommoditiesTable(props: TopCommoditiesTableProps): React.JSX.Element {
  const { products } = props

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Komoditas Terlaris</h3>
              <p className="text-[11px] text-slate-500">Peringkat produk hasil tani dengan volume penjualan tertinggi</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sprout size={13} />
            Katalog Unggulan
          </span>
        </div>

        {products.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
              <Package size={24} />
            </div>
            <p className="text-xs text-slate-500">Belum ada data transaksi penjualan komoditas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((item, index) => {
              const rank = index + 1
              const rankColor =
                rank === 1
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : rank === 2
                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                  : rank === 3
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'

              return (
                <div
                  key={`${item.product_id}-${index}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 hover:bg-slate-100/80 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-md font-black text-[11px] flex items-center justify-center border shrink-0 ${rankColor}`}
                    >
                      {rank}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate" title={item.product_name}>
                        {item.product_name}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Terjual: <span className="font-semibold text-emerald-700">{item.total_quantity} Kg</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <div className="text-xs font-black text-slate-900">
                      {formatIDR(item.total_revenue)}
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">Total Akumulasi</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
