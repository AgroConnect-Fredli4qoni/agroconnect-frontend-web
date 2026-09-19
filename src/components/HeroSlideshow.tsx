import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
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
  CalendarCheck
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
 * HeroSlideshow integrates Platform Introduction, Farming Recommendations, and BMKG Weather Forecasts into an interactive carousel.
 *
 * @param props - Weather state and region selector handler.
 * @returns JSX Element rendering hero banner slideshow.
 */
export function HeroSlideshow(props: HeroSlideshowProps): React.JSX.Element {
  const { weather, isWeatherLoading, selectedRegion, onSelectRegion } = props
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES)
  }

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES)
  }

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
      className="relative rounded-3xl overflow-hidden shadow-xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative min-h-[460px] sm:min-h-[420px] lg:min-h-[380px] flex items-center">
        {currentSlide === 0 && (
          <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 p-8 sm:p-12 text-white flex flex-col justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-semibold">
                <Sparkles size={14} />
                <span>Platform Agrikultur Cerdas Terintegrasi BMKG</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Hubungkan Hasil Panen Petani Langsung ke Meja Anda
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
                Solusi digital rantai pasok agrikultur Indonesia dengan panduan cuaca presisi BMKG,
                transparansi harga pasar adil, dan kepastian transaksi aman bagi petani maupun pembeli.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-black rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Store size={18} />
                  <span>Jelajahi Katalog Lengkap</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(2)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  <CloudSun size={18} />
                  <span>Cek Cuaca BMKG</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  <CalendarCheck size={18} />
                  <span>Rekomendasi Tani</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6 text-xs text-emerald-200/90 border-t border-white/10 mt-6">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span>Transaksi Terlindungi & Mutu Terjamin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CloudSun size={16} />
                <span>Satelit & Sensor Agroklimat BMKG</span>
              </div>
            </div>
          </div>
        )}

        {currentSlide === 1 && (
          <div className="w-full h-full bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isAlert ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                    {isAlert ? <ShieldAlert size={22} /> : <Sparkles size={22} />}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Rekomendasi Aksi Tani Hari Ini</h2>
                    <p className="text-xs text-emerald-200/80 mt-0.5">Kalkulasi presisi agronomi berbasis pantauan satelit cuaca BMKG.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-emerald-200">Status Tindakan:</span>
                  <span className={`px-3 py-1 rounded-full font-black text-xs ${
                    isAlert
                      ? 'bg-amber-400 text-amber-950'
                      : isOptimal
                      ? 'bg-emerald-400 text-emerald-950'
                      : 'bg-sky-400 text-sky-950'
                  }`}>
                    {recommendation?.action_label || 'Pemeriksaan Cuaca'}
                  </span>
                  <span className="bg-white/15 backdrop-blur-xs font-bold px-3 py-1 rounded-full text-white border border-white/15">
                    Kesesuaian: {recommendation?.suitability || 'Sedang Dihitung'}
                  </span>
                </div>
              </div>

              {recommendation ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4.5 space-y-2 hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <div className="p-2 rounded-lg bg-emerald-500/20">
                        <Sprout size={18} />
                      </div>
                      <h3 className="font-bold text-xs text-white">Aplikasi Pemupukan</h3>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">{recommendation.fertilizing_advice}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4.5 space-y-2 hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-2 text-sky-300">
                      <div className="p-2 rounded-lg bg-sky-500/20">
                        <Droplet size={18} />
                      </div>
                      <h3 className="font-bold text-xs text-white">Manajemen Irigasi & Air</h3>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">{recommendation.irrigation_advice}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4.5 space-y-2 hover:bg-white/15 transition-all">
                    <div className="flex items-center gap-2 text-amber-300">
                      <div className="p-2 rounded-lg bg-amber-500/20">
                        <Scissors size={18} />
                      </div>
                      <h3 className="font-bold text-xs text-white">Jadwal Panen Komoditas</h3>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed">{recommendation.harvest_advice}</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-emerald-200">
                  <p>Memuat kalkulasi rekomendasi agroklimat dari BMKG...</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4 text-xs text-emerald-200/80">
              <span>Wilayah Pemantauan: {weather?.region || selectedRegion}</span>
              <Link to="/catalog" className="font-bold text-white hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
                <span>Belanja Komoditas Tani Sesuai Panen</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {currentSlide === 2 && (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 p-8 sm:p-12 text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/15">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold mb-1">
                    <CloudSun size={14} />
                    <span>BMKG Agroklimat Real-Time</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Parameter Cuaca Pertanian</h2>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-emerald-200/90 mr-1 hidden sm:inline">Pilih Wilayah:</span>
                  {regions.map((reg) => (
                    <button
                      key={reg}
                      type="button"
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                        selectedRegion === reg
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                          : 'bg-white/15 text-emerald-100 hover:bg-white/25'
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
                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">{weather.region}</span>
                      <div className="my-2">
                        <span className="text-4xl font-black tracking-tight text-white block">
                          {weather.current_weather.temperature_c}°C
                        </span>
                        <span className="text-xs font-semibold text-emerald-200 mt-1 block">
                          {weather.current_weather.weather_condition}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 text-[10px] text-emerald-200/80 flex items-center justify-between">
                      <span>{weather.current_weather.forecast_time}</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                        <CheckCircle2 size={11} />
                        {weather.source}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/15 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2">
                      <Thermometer size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-emerald-200 block">Suhu Udara Rata-rata</span>
                      <span className="text-2xl font-black text-white mt-0.5 block">
                        {weather.current_weather.temperature_c} °C
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/15 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center mb-2">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-emerald-200 block">Kelembaban Relatif</span>
                      <span className="text-2xl font-black text-white mt-0.5 block">
                        {weather.current_weather.humidity_percent} %
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/15 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center mb-2">
                      <Wind size={20} />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium text-emerald-200 block">Kecepatan Angin</span>
                      <span className="text-2xl font-black text-white mt-0.5 block">
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

            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-4 text-xs text-emerald-200/80">
              <span>Data resmi BMKG Open Data Agrometeorologi</span>
              <Link to="/catalog" className="font-bold text-white hover:text-emerald-300 transition-colors inline-flex items-center gap-1">
                <span>Pesan Hasil Panen Sesuai Kondisi Cuaca</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-md"
        aria-label="Slide Sebelumnya"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer shadow-md"
        aria-label="Slide Berikutnya"
      >
        <ChevronRight size={22} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full z-20">
        <button
          type="button"
          onClick={() => setCurrentSlide(0)}
          className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === 0 ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          title="Slide 1: AgroConnect Hero"
        />
        <button
          type="button"
          onClick={() => setCurrentSlide(1)}
          className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === 1 ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          title="Slide 2: Rekomendasi Aksi Tani"
        />
        <button
          type="button"
          onClick={() => setCurrentSlide(2)}
          className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === 2 ? 'w-6 bg-emerald-400' : 'w-2 bg-white/50 hover:bg-white/80'}`}
          title="Slide 3: Parameter Cuaca BMKG"
        />
      </div>
    </div>
  )
}
