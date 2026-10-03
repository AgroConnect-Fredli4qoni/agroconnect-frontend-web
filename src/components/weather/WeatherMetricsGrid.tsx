import React from 'react'
import { Thermometer, Droplets, Wind, CloudRain, CheckCircle2, Loader2 } from 'lucide-react'
import { WeatherResponse } from '../../types/weather'
import { formatTemperature, formatHumidity, formatWindSpeed } from '../../services/weatherService'

/**
 * WeatherMetricsGridProps defines properties required to render BMKG climate parameters.
 */
export interface WeatherMetricsGridProps {
  weather: WeatherResponse | null
  variant?: 'dark' | 'light'
  isLoading?: boolean
  className?: string
}

/**
 * WeatherMetricsGrid visualizes core BMKG agrometeorological parameters with theme adaptability.
 *
 * @param props - Component configuration including weather data, theme variant, and loading state.
 * @returns JSX Element presenting meteorological observations.
 */
export function WeatherMetricsGrid(props: WeatherMetricsGridProps): React.JSX.Element {
  const { weather, variant = 'dark', isLoading = false, className = '' } = props

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 space-y-3 ${className}`}>
        <Loader2 size={32} className={`animate-spin ${variant === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <p className={`text-xs font-medium ${variant === 'dark' ? 'text-emerald-200' : 'text-slate-500'}`}>
          Memuat parameter agroklimat BMKG...
        </p>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className={`text-center py-8 text-xs ${variant === 'dark' ? 'text-rose-300' : 'text-rose-600'} ${className}`}>
        <p>Gagal memuat parameter cuaca BMKG. Silakan coba kembali.</p>
      </div>
    )
  }

  const { current_weather: current, region, source } = weather

  if (variant === 'light') {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
        <div className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{region}</span>
            <div className="my-4">
              <span className="text-4xl lg:text-5xl font-black tracking-tight block">
                {formatTemperature(current.temperature_c)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full mt-2">
                <CloudRain size={14} />
                {current.weather_condition}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100">
            <span>Diperbarui: {current.forecast_time}</span>
            <span className="inline-flex items-center gap-1 font-semibold">
              <CheckCircle2 size={12} />
              {source}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <Thermometer size={22} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Suhu Udara Rata-rata</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {formatTemperature(current.temperature_c)}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <Droplets size={22} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Kelembaban Relatif</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {formatHumidity(current.humidity_percent)}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 flex flex-col justify-between hover:shadow-xs transition-all">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
              <Wind size={22} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Kecepatan Angin</span>
              <span className="text-xl font-black text-slate-900 mt-1 block">
                {formatWindSpeed(current.wind_speed_kmh)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-4 gap-4 pt-1 ${className}`}>
      <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">{region}</span>
          <div className="my-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white block">
              {formatTemperature(current.temperature_c)}
            </span>
            <span className="text-xs font-semibold text-emerald-200 mt-1 block">
              {current.weather_condition}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-emerald-700/60 text-[10px] text-emerald-200/80 flex items-center justify-between">
          <span>{current.forecast_time}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
            <CheckCircle2 size={11} />
            {source}
          </span>
        </div>
      </div>

      <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-5 flex flex-col justify-between hover:bg-emerald-800/80 transition-all">
        <div className="w-8 h-8 rounded-lg bg-emerald-700/50 text-amber-300 flex items-center justify-center mb-2">
          <Thermometer size={18} />
        </div>
        <div>
          <span className="text-[11px] font-medium text-emerald-200/90 block">Suhu Udara Rata-rata</span>
          <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
            {formatTemperature(current.temperature_c)}
          </span>
        </div>
      </div>

      <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-5 flex flex-col justify-between hover:bg-emerald-800/80 transition-all">
        <div className="w-8 h-8 rounded-lg bg-emerald-700/50 text-sky-300 flex items-center justify-center mb-2">
          <Droplets size={18} />
        </div>
        <div>
          <span className="text-[11px] font-medium text-emerald-200/90 block">Kelembaban Relatif</span>
          <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
            {formatHumidity(current.humidity_percent)}
          </span>
        </div>
      </div>

      <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-xl p-5 flex flex-col justify-between hover:bg-emerald-800/80 transition-all">
        <div className="w-8 h-8 rounded-lg bg-emerald-700/50 text-teal-300 flex items-center justify-center mb-2">
          <Wind size={18} />
        </div>
        <div>
          <span className="text-[11px] font-medium text-emerald-200/90 block">Kecepatan Angin</span>
          <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
            {formatWindSpeed(current.wind_speed_kmh)}
          </span>
        </div>
      </div>
    </div>
  )
}
