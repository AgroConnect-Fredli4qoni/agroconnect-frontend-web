/**
 * WeatherParameter represents climate observations from the BMKG service.
 */
export interface WeatherParameter {
  region: string
  temperature_c: number
  humidity_percent: number
  weather_condition: string
  wind_speed_kmh: number
  forecast_time: string
}

/**
 * FarmingRecommendation provides agronomic guidelines based on real-time weather.
 */
export interface FarmingRecommendation {
  status: string
  action_label: string
  suitability: string
  fertilizing_advice: string
  irrigation_advice: string
  harvest_advice: string
}

/**
 * WeatherResponse defines the full payload returned by the Weather microservice.
 */
export interface WeatherResponse {
  region: string
  current_weather: WeatherParameter
  recommendation: FarmingRecommendation
  source: string
  cached: boolean
  fallback: boolean
}
