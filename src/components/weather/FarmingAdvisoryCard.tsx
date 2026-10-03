import React from 'react'
import { Sprout, Droplet, Scissors, Loader2 } from 'lucide-react'
import { FarmingRecommendation } from '../../types/weather'
import { getAdvisoryConfig } from '../../services/weatherService'

/**
 * FarmingAdvisoryCardProps defines properties required to render agronomic guidelines.
 */
export interface FarmingAdvisoryCardProps {
  recommendation: FarmingRecommendation | null
  isLoading?: boolean
  className?: string
}

/**
 * FarmingAdvisoryCard presents actionable agricultural recommendations across fertilization, irrigation, and harvest.
 *
 * @param props - Component configuration including recommendation data and loading indicator.
 * @returns JSX Element rendering the agronomic guidance panel.
 */
export function FarmingAdvisoryCard(props: FarmingAdvisoryCardProps): React.JSX.Element {
  const { recommendation, isLoading = false, className = '' } = props
  const config = getAdvisoryConfig(recommendation?.status)
  const StatusIcon = config.icon

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 space-y-3 ${className}`}>
        <Loader2 size={32} className="animate-spin text-emerald-400" />
        <p className="text-xs text-emerald-200 font-medium">Memuat kalkulasi rekomendasi agroklimat BMKG...</p>
      </div>
    )
  }

  if (!recommendation) {
    return (
      <div className={`py-8 text-center text-xs text-emerald-200 ${className}`}>
        <p>Belum ada data rekomendasi aksi tani untuk wilayah ini.</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${config.iconBgClass} ${config.iconTextClass}`}>
            <StatusIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Rekomendasi Aksi Tani Hari Ini
            </h2>
            <p className="text-xs text-emerald-200/80 mt-0.5">
              Kalkulasi presisi agronomi berbasis pantauan satelit cuaca BMKG.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-emerald-200/90">Status Tindakan:</span>
          <span className={`px-3 py-1 rounded-lg font-bold text-xs ${config.actionClass}`}>
            {recommendation.action_label || 'Pemeriksaan Cuaca'}
          </span>
          <span className={`border font-semibold px-3 py-1 rounded-lg ${config.suitabilityClass}`}>
            Kesesuaian: {recommendation.suitability || 'Sedang Dihitung'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-4.5 space-y-2 hover:bg-emerald-800/80 transition-all">
          <div className="flex items-center gap-2 text-emerald-300">
            <div className="p-1.5 rounded-lg bg-emerald-700/50">
              <Sprout size={18} />
            </div>
            <h3 className="font-bold text-xs text-white">Aplikasi Pemupukan</h3>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {recommendation.fertilizing_advice}
          </p>
        </div>

        <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-4.5 space-y-2 hover:bg-emerald-800/80 transition-all">
          <div className="flex items-center gap-2 text-sky-300">
            <div className="p-1.5 rounded-lg bg-emerald-700/50">
              <Droplet size={18} />
            </div>
            <h3 className="font-bold text-xs text-white">Manajemen Irigasi & Air</h3>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {recommendation.irrigation_advice}
          </p>
        </div>

        <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-4.5 space-y-2 hover:bg-emerald-800/80 transition-all">
          <div className="flex items-center gap-2 text-amber-300">
            <div className="p-1.5 rounded-lg bg-emerald-700/50">
              <Scissors size={18} />
            </div>
            <h3 className="font-bold text-xs text-white">Jadwal Panen Komoditas</h3>
          </div>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {recommendation.harvest_advice}
          </p>
        </div>
      </div>
    </div>
  )
}
