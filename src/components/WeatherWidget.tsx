import React from 'react'
import { Thermometer, Droplets, Wind, CloudRain, CheckCircle2 } from 'lucide-react'
import { WeatherResponse } from '../types/weather'

/**
 * WeatherWidgetProps defines component parameters including data and region handler.
 */
export interface WeatherWidgetProps {
  weather: WeatherResponse | null
  isLoading: boolean
  selectedRegion: string
  onSelectRegion: (region: string) => void
}

const regions = ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Nasional']

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
          <h2 className="text-xl font-black text-slate-900 tracking-tight">🌤️ Parameter Cuaca Pertanian (BMKG)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Prakiraan cuaca spesifik sentra pertanian untuk efisiensi jadwal tanam & panen.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {regions.map((reg) => (
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Memuat data agroklimat BMKG...</p>
        </div>
      ) : weather ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-xl p-6 text-white shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{weather.region}</span>
              <div className="my-4">
                <span className="text-4xl lg:text-5xl font-black tracking-tight block">
                  {weather.current_weather.temperature_c}°C
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full mt-2">
                  <CloudRain size={14} />
                  {weather.current_weather.weather_condition}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-100">
              <span>Diperbarui: {weather.current_weather.forecast_time}</span>
              <span className="inline-flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} />
                {weather.source}
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
                  {weather.current_weather.temperature_c} °C
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
                  {weather.current_weather.humidity_percent} %
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
                  {weather.current_weather.wind_speed_kmh} km/jam
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-rose-600">
          <p>Gagal memuat informasi cuaca. Silakan coba kembali.</p>
        </div>
      )}
    </section>
  )
}
