import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Store,
  CloudSun,
  ShieldCheck,
  Sprout,
  Droplet,
  Scissors,
  Thermometer,
  Droplets,
  Wind,
  CheckCircle2,
  ShieldAlert,
  CalendarCheck,
  ChevronRight
} from 'lucide-react'
import { WeatherResponse } from '../types/weather'

/**
 * HeroSlideshowProps defines data properties and callbacks for weather analytics and region selection.
 */
export interface HeroSlideshowProps {
  weather: WeatherResponse | null
  isWeatherLoading: boolean
  selectedRegion: string
  onSelectRegion: (region: string) => void
}

const regions = ['Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Nasional']
const TOTAL_SLIDES = 3
const AUTO_PLAY_INTERVAL = 7000

/**
 * HeroSlideshow integrates Platform Introduction, Farming Recommendations, and BMKG Weather Forecasts into an interactive carousel with minimalist styling.
 *
 * @param props - Weather state and region selector handler.
 * @returns JSX Element rendering hero banner slideshow.
 */
export function HeroSlideshow(props: HeroSlideshowProps): React.JSX.Element {
  const { weather, isWeatherLoading, selectedRegion, onSelectRegion } = props
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPaused) return

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES)
    }, AUTO_PLAY_INTERVAL)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPaused])

  const recommendation = weather?.recommendation || null
  const isAlert = recommendation?.status === 'Waspada'
  const isOptimal = recommendation?.status === 'Optimal'

  return (
    <div
      className="relative rounded-3xl overflow-hidden bg-emerald-900 text-white shadow-lg border border-emerald-800/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full">
        {currentSlide === 0 && (
          <div className="w-full min-h-[400px] sm:min-h-[360px] p-6 sm:p-10 lg:p-12 pb-14 flex flex-col justify-between space-y-6">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-800 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
                <Sparkles size={14} />
                <span>Platform Agrikultur Cerdas Terintegrasi BMKG</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Hubungkan Hasil Panen Petani Langsung ke Meja Anda
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
                Solusi digital rantai pasok agrikultur Indonesia dengan panduan cuaca presisi BMKG,
                transparansi harga pasar adil, dan kepastian transaksi aman bagi petani maupun pembeli.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Store size={17} />
                  <span>Jelajahi Katalog Lengkap</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-700/60 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <CalendarCheck size={17} />
                  <span>Rekomendasi Tani</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(2)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 text-white border border-emerald-700/60 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <CloudSun size={17} />
                  <span>Cek Cuaca BMKG</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 pt-4 text-xs text-emerald-200/80 border-t border-emerald-800/80">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>Transaksi Terlindungi & Mutu Terjamin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CloudSun size={16} className="text-emerald-400" />
                <span>Satelit & Sensor Agroklimat BMKG</span>
              </div>
            </div>
          </div>
        )}

        {currentSlide === 1 && (
          <div className="w-full min-h-[400px] sm:min-h-[360px] p-6 sm:p-10 lg:p-12 pb-14 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/80">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isAlert ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'}`}>
                    {isAlert ? <ShieldAlert size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Rekomendasi Aksi Tani Hari Ini</h2>
                    <p className="text-xs text-emerald-200/80 mt-0.5">Kalkulasi presisi agronomi berbasis pantauan satelit cuaca BMKG.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-emerald-200/90">Status Tindakan:</span>
                  <span className={`px-3 py-1 rounded-lg font-bold text-xs ${
                    isAlert
                      ? 'bg-amber-400 text-amber-950'
                      : isOptimal
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-sky-300 text-sky-950'
                  }`}>
                    {recommendation?.action_label || 'Pemeriksaan Cuaca'}
                  </span>
                  <span className="bg-emerald-800 border border-emerald-700/60 font-semibold px-3 py-1 rounded-lg text-emerald-100">
                    Kesesuaian: {recommendation?.suitability || 'Sedang Dihitung'}
                  </span>
                </div>
              </div>

              {recommendation ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-4.5 space-y-2 hover:bg-emerald-800/80 transition-all">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <div className="p-1.5 rounded-lg bg-emerald-700/50">
                        <Sprout size={18} />
                      </div>
                      <h3 className="font-bold text-xs text-white">Aplikasi Pemupukan</h3>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">{recommendation.fertilizing_advice}</p>
                  </div>

                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-4.5 space-y-2 hover:bg-emerald-800/80 transition-all">
                    <div className="flex items-center gap-2 text-sky-300">
                      <div className="p-1.5 rounded-lg bg-emerald-700/50">
                        <Droplet size={18} />
                      </div>
                      <h3 className="font-bold text-xs text-white">Manajemen Irigasi & Air</h3>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">{recommendation.irrigation_advice}</p>
                  </div>

                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-4.5 space-y-2 hover:bg-emerald-800/80 transition-all">
                    <div className="flex items-center gap-2 text-amber-300">
                      <div className="p-1.5 rounded-lg bg-emerald-700/50">
                        <Scissors size={18} />
                      </div>
                      <h3 className="font-bold text-xs text-white">Jadwal Panen Komoditas</h3>
                    </div>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">{recommendation.harvest_advice}</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-emerald-200">
                  <p>Memuat kalkulasi rekomendasi agroklimat dari BMKG...</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80 text-xs text-emerald-200/80">
              <span>Wilayah Pemantauan: {weather?.region || selectedRegion}</span>
              <Link to="/catalog" className="font-semibold text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-1">
                <span>Belanja Komoditas Tani Sesuai Panen</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {currentSlide === 2 && (
          <div className="w-full min-h-[400px] sm:min-h-[360px] p-6 sm:p-10 lg:p-12 pb-14 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-emerald-800/80">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-800 border border-emerald-700/60 text-emerald-200 text-xs font-semibold mb-1">
                    <CloudSun size={14} />
                    <span>BMKG Agroklimat Real-Time</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Parameter Cuaca Pertanian</h2>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-emerald-200/80 mr-1 hidden sm:inline">Wilayah:</span>
                  {regions.map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        selectedRegion === reg
                          ? 'bg-emerald-500 text-emerald-950 font-bold'
                          : 'bg-emerald-800/70 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/50'
                      }`}
                      onClick={() => onSelectRegion(reg)}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              {isWeatherLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-emerald-200 font-medium">Memuat parameter cuaca BMKG...</p>
                </div>
              ) : weather ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pt-1">
                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">{weather.region}</span>
                      <div className="my-2">
                        <span className="text-3xl sm:text-4xl font-black tracking-tight text-white block">
                          {weather.current_weather.temperature_c}°C
                        </span>
                        <span className="text-xs font-semibold text-emerald-200 mt-1 block">
                          {weather.current_weather.weather_condition}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-emerald-700/60 text-[10px] text-emerald-200/80 flex items-center justify-between">
                      <span>{weather.current_weather.forecast_time}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                        <CheckCircle2 size={11} />
                        {weather.source}
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-emerald-800/80 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700/50 text-amber-300 flex items-center justify-center mb-2">
                      <Thermometer size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-emerald-200/90 block">Suhu Udara Rata-rata</span>
                      <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                        {weather.current_weather.temperature_c} °C
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-emerald-800/80 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700/50 text-sky-300 flex items-center justify-center mb-2">
                      <Droplets size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-emerald-200/90 block">Kelembaban Relatif</span>
                      <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                        {weather.current_weather.humidity_percent} %
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-800/60 border border-emerald-700/60 rounded-2xl p-5 flex flex-col justify-between hover:bg-emerald-800/80 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700/50 text-teal-300 flex items-center justify-center mb-2">
                      <Wind size={18} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-emerald-200/90 block">Kecepatan Angin</span>
                      <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                        {weather.current_weather.wind_speed_kmh} km/j
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-rose-300">
                  <p>Gagal memuat parameter cuaca BMKG.</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-emerald-800/80 text-xs text-emerald-200/80">
              <span>Data resmi BMKG Open Data Agrometeorologi</span>
              <Link to="/catalog" className="font-semibold text-emerald-200 hover:text-white transition-colors inline-flex items-center gap-1">
                <span>Pesan Hasil Panen Sesuai Kondisi Cuaca</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={() => setCurrentSlide(0)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            currentSlide === 0 ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
          }`}
          title="Slide 1: AgroConnect Hero"
        />
        <button
          type="button"
          onClick={() => setCurrentSlide(1)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            currentSlide === 1 ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
          }`}
          title="Slide 2: Rekomendasi Aksi Tani"
        />
        <button
          type="button"
          onClick={() => setCurrentSlide(2)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            currentSlide === 2 ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
          }`}
          title="Slide 3: Parameter Cuaca BMKG"
        />
      </div>
    </div>
  )
}
