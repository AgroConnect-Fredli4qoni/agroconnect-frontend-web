import React from 'react'
import { CloudSun } from 'lucide-react'
import { WeatherResponse } from '../../types/weather'
import { SUPPORTED_REGIONS } from '../../services/weatherService'
import { WeatherMetricsGrid } from './WeatherMetricsGrid'

/**
 * WeatherWidgetProps defines component parameters including data and region handler.
 */
export interface WeatherWidgetProps {
  weather: WeatherResponse | null
  isLoading: boolean
  selectedRegion: string
  onSelectRegion: (region: string) => void
}

/**
 * WeatherWidget renders real-time agroclimate conditions sourced from BMKG.
 *
 * @param props - Current weather state and region callback.
 * @returns JSX Element presenting weather metrics.
 */
export function WeatherWidget(props: WeatherWidgetProps): React.JSX.Element {
  const { weather, isLoading, selectedRegion, onSelectRegion } = props

  return (
    <section id="cuaca" className="bg-white rounded-2xl border border-slate-200/80 p-6 lg:p-8 shadow-xs my-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <CloudSun size={22} className="text-emerald-700" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Parameter Cuaca Pertanian (BMKG)</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Prakiraan cuaca spesifik sentra pertanian untuk efisiensi jadwal tanam & panen.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUPPORTED_REGIONS.map((reg: string) => (
            <button
              key={reg}
              type="button"
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => onSelectRegion(reg)}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      <WeatherMetricsGrid
        weather={weather}
        isLoading={isLoading}
        variant="light"
      />
    </section>
  )
}
