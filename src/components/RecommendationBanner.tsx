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

  return (
    <div className={`recommendation-banner ${isAlert ? 'alert-mode' : isOptimal ? 'optimal-mode' : 'normal-mode'}`}>
      <div className="recommendation-header">
        <div className="recommendation-badge-wrap">
          {isAlert ? <ShieldAlert size={22} /> : isOptimal ? <CheckCircle size={22} /> : <Sparkles size={22} />}
          <span className="recommendation-title">Rekomendasi Aksi Tani Hari Ini</span>
        </div>
        <div className="action-pill">
          <span>Status: </span>
          <strong>{recommendation.action_label}</strong>
          <span className="suitability-badge">Kesesuaian: {recommendation.suitability}</span>
        </div>
      </div>

      <div className="advice-grid">
        <div className="advice-card">
          <div className="advice-icon-wrap">
            <Sprout size={20} />
          </div>
          <div>
            <h4>Aplikasi Pemupukan</h4>
            <p>{recommendation.fertilizing_advice}</p>
          </div>
        </div>

        <div className="advice-card">
          <div className="advice-icon-wrap">
            <Droplet size={20} />
          </div>
          <div>
            <h4>Manajemen Irigasi & Air</h4>
            <p>{recommendation.irrigation_advice}</p>
          </div>
        </div>

        <div className="advice-card">
          <div className="advice-icon-wrap">
            <Scissors size={20} />
          </div>
          <div>
            <h4>Jadwal Panen Komoditas</h4>
            <p>{recommendation.harvest_advice}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
