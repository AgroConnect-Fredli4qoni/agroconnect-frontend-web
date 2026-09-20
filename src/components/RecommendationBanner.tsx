import React from 'react'
import { Sparkles, Sprout, ShieldAlert, CheckCircle, Droplet, Scissors } from 'lucide-react'
import { FarmingRecommendation } from '../types/weather'

/**
 * RecommendationBannerProps defines the recommendation data payload.
 */
export interface RecommendationBannerProps {
  recommendation: FarmingRecommendation | null
}

/**
 * RecommendationBanner presents agronomic advice derived from BMKG climate analytics.
 *
 * @param props - Farming recommendation data structure.
 * @returns JSX Element rendering farming advice card.
 */
export function RecommendationBanner(props: RecommendationBannerProps): React.JSX.Element {
  const { recommendation } = props

  if (!recommendation) {
    return <></>
  }

  const isAlert = recommendation.status === 'Waspada'
  const isOptimal = recommendation.status === 'Optimal'

  const bannerClass = isAlert
    ? 'bg-amber-50 border-amber-200 text-amber-900'
    : isOptimal
    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
    : 'bg-sky-50 border-sky-200 text-sky-900'

  return (
    <div className={`rounded-2xl border p-6 shadow-xs mb-6 ${bannerClass}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5 mb-4">
        <div className="flex items-center gap-2.5">
          {isAlert ? <ShieldAlert size={22} className="text-amber-700" /> : isOptimal ? <CheckCircle size={22} className="text-emerald-700" /> : <Sparkles size={22} className="text-sky-700" />}
          <span className="font-extrabold text-sm tracking-tight">Rekomendasi Aksi Tani Hari Ini</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span>Status: </span>
          <strong className="font-black">{recommendation.action_label}</strong>
          <span className="bg-white/80 font-bold px-2.5 py-0.5 rounded-full border border-black/10">
            Kesesuaian: {recommendation.suitability}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 rounded-xl p-4 border border-black/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Sprout size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-0.5">Aplikasi Pemupukan</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{recommendation.fertilizing_advice}</p>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-4 border border-black/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
            <Droplet size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-0.5">Manajemen Irigasi & Air</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{recommendation.irrigation_advice}</p>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-4 border border-black/5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Scissors size={18} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-800 mb-0.5">Jadwal Panen Komoditas</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{recommendation.harvest_advice}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
