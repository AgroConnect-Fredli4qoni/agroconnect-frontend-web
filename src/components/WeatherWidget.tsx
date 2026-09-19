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
    <section className="weather-section">
      <div className="section-header">
        <div>
          <h2>🌤️ Parameter Cuaca Pertanian (BMKG)</h2>
          <p className="section-desc">Prakiraan cuaca spesifik sentra pertanian untuk efisiensi jadwal tanam & panen.</p>
        </div>

        <div className="region-selector">
          {regions.map((reg) => (
            <button
              key={reg}
              type="button"
              className={`region-pill ${selectedRegion === reg ? 'active' : ''}`}
              onClick={() => onSelectRegion(reg)}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Memuat data agroklimat BMKG...</p>
        </div>
      ) : weather ? (
        <div className="weather-content">
          <div className="weather-hero-card">
            <div className="weather-hero-info">
              <span className="weather-location">{weather.region}</span>
              <div className="weather-temp-wrap">
                <span className="temperature-value">{weather.current_weather.temperature_c}°C</span>
                <span className="weather-condition-badge">
                  <CloudRain size={16} />
                  {weather.current_weather.weather_condition}
                </span>
              </div>
              <span className="weather-time">Diperbarui: {weather.current_weather.forecast_time}</span>
            </div>

            <div className="weather-meta-badges">
              <span className="source-tag">
                <CheckCircle2 size={14} />
                {weather.source}
              </span>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-icon-wrap temp">
                <Thermometer size={24} />
              </div>
              <div>
                <span className="metric-label">Suhu Udara Rata-rata</span>
                <span className="metric-val">{weather.current_weather.temperature_c} °C</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap humidity">
                <Droplets size={24} />
              </div>
              <div>
                <span className="metric-label">Kelembaban Relatif</span>
                <span className="metric-val">{weather.current_weather.humidity_percent} %</span>
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-icon-wrap wind">
                <Wind size={24} />
              </div>
              <div>
                <span className="metric-label">Kecepatan Angin</span>
                <span className="metric-val">{weather.current_weather.wind_speed_kmh} km/jam</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="error-state">
          <p>Gagal memuat informasi cuaca. Silakan coba kembali.</p>
        </div>
      )}
    </section>
  )
}
