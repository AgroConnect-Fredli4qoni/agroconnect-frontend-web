import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Store,
  CloudSun,
  ShieldCheck,
  CalendarCheck,
  ChevronRight,
} from 'lucide-react'
import { WeatherResponse } from '../../types/weather'
import { FarmingAdvisoryCard } from '../weather/FarmingAdvisoryCard'
import { WeatherMetricsGrid } from '../weather/WeatherMetricsGrid'

/**
 * HeroSlideshowProps defines data properties and callbacks for weather analytics and region selection.
 */
export interface HeroSlideshowProps {
  weather: WeatherResponse | null
  isWeatherLoading: boolean
  selectedRegion?: string
  onSelectRegion?: (region: string) => void
}

const TOTAL_SLIDES = 3
const AUTO_PLAY_INTERVAL = 7000

/**
 * HeroSlideshow integrates Platform Introduction, Farming Recommendations, and BMKG Weather Forecasts into an interactive carousel with minimalist styling.
 *
 * @param props - Weather state and region selector handler.
 * @returns JSX Element rendering hero banner slideshow.
 */
export function HeroSlideshow(props: HeroSlideshowProps): React.JSX.Element {
  const { weather, isWeatherLoading, selectedRegion = 'Indonesia' } = props
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


  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-emerald-900 text-white shadow-lg border border-emerald-800/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full">
        {currentSlide === 0 && (
          <div className="relative w-full min-h-[420px] sm:min-h-[390px] lg:min-h-[410px] p-6 sm:p-10 lg:p-12 pb-14 flex flex-col justify-between space-y-6 overflow-hidden">
            <div className="relative z-10 max-w-xl lg:max-w-xl xl:max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-800/90 border border-emerald-700/70 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles size={14} className="text-emerald-400" />
                <span>Platform Agrikultur Cerdas</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Hubungkan Hasil Panen Petani Langsung ke Meja Anda
              </h1>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg">
                Solusi digital rantai pasok agrikultur Indonesia dengan transparansi harga pasar, dan kepastian transaksi aman bagi petani maupun pembeli.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                <Link
                  to="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Store size={17} className="text-emerald-700" />
                  <span>Jelajahi Katalog Lengkap</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-700/60 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <CalendarCheck size={17} />
                  <span>Rekomendasi Tani</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSlide(2)}
                  className="hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-700/60 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <CloudSun size={17} />
                  <span>Cek Cuaca BMKG</span>
                </button>
              </div>
            </div>

            <div className="flex absolute right-0 sm:right-4 md:right-8 lg:right-12 bottom-0 items-end justify-end pointer-events-none z-0 sm:z-10">
              <img
                src="/images/banner/banner-model.png"
                alt="Petani dan Pembeli AgroConnect"
                className="h-[180px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[410px] w-auto max-w-[170px] sm:max-w-[340px] md:max-w-[390px] lg:max-w-[460px] xl:max-w-[500px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-105 pointer-events-auto opacity-40 sm:opacity-100"
              />
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-5 pt-4 text-xs text-emerald-200/90 border-t border-emerald-800/80 z-10 max-w-xl lg:max-w-2xl">
              <div className="flex items-center gap-1.5">
                <CloudSun size={15} className="text-emerald-400 shrink-0" />
                <span>Cek Cuaca BMKG</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>Transaksi Terlindungi & Mutu Terjamin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={15} className="text-emerald-400 shrink-0" />
                <span>Satelit & Sensor Agroklimat BMKG</span>
              </div>
            </div>
          </div>
        )}

        {currentSlide === 1 && (
          <div className="w-full min-h-[400px] sm:min-h-[360px] p-6 sm:p-10 lg:p-12 pb-14 flex flex-col justify-between space-y-6">
            <FarmingAdvisoryCard
              recommendation={weather?.recommendation || null}
              isLoading={isWeatherLoading}
            />

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

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-800/90 border border-emerald-700/70 text-emerald-100 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Wilayah: {weather?.region || selectedRegion}</span>
                </div>
              </div>

              <WeatherMetricsGrid
                weather={weather}
                isLoading={isWeatherLoading}
                variant="dark"
              />
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
          className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === 0 ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          title="Slide 1: AgroConnect Hero"
        />
        <button
          type="button"
          onClick={() => setCurrentSlide(1)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === 1 ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          title="Slide 2: Rekomendasi Aksi Tani"
        />
        <button
          type="button"
          onClick={() => setCurrentSlide(2)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === 2 ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          title="Slide 3: Parameter Cuaca BMKG"
        />
      </div>
    </div>
  )
}
