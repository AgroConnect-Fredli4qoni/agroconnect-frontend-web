import { Sparkles, CheckCircle2, ShieldAlert, LucideIcon } from 'lucide-react'
import { WeatherResponse } from '../types/weather'
import { fetchWeather } from './api'

/**
 * SUPPORTED_REGIONS lists official agroclimate monitoring territories in Indonesia.
 */
export const SUPPORTED_REGIONS = [
  'Indonesia',
  'Jawa Barat',
  'Jawa Tengah',
  'Jawa Timur',
] as const

/**
 * SupportedRegion represents any officially supported territory string.
 */
export type SupportedRegion = typeof SUPPORTED_REGIONS[number] | string

/**
 * AdvisoryStatus defines operational alert levels for agronomic advisories.
 */
export type AdvisoryStatus = 'Optimal' | 'Kondusif' | 'Waspada'

/**
 * AdvisoryConfig encapsulates visual tokens and icons for an advisory alert status.
 */
export interface AdvisoryConfig {
  status: AdvisoryStatus
  badgeClass: string
  iconBgClass: string
  iconTextClass: string
  icon: LucideIcon
  actionClass: string
  suitabilityClass: string
}

/**
 * ADVISORY_CONFIG provides canonical styling and iconography for advisory statuses.
 */
export const ADVISORY_CONFIG: Record<AdvisoryStatus, AdvisoryConfig> = {
  Optimal: {
    status: 'Optimal',
    badgeClass: 'bg-emerald-400 text-emerald-950',
    iconBgClass: 'bg-emerald-400/20',
    iconTextClass: 'text-emerald-300',
    icon: Sparkles,
    actionClass: 'bg-emerald-400 text-emerald-950',
    suitabilityClass: 'bg-emerald-800 border-emerald-700/60 text-emerald-100',
  },
  Kondusif: {
    status: 'Kondusif',
    badgeClass: 'bg-sky-300 text-sky-950',
    iconBgClass: 'bg-sky-400/20',
    iconTextClass: 'text-sky-300',
    icon: CheckCircle2,
    actionClass: 'bg-sky-300 text-sky-950',
    suitabilityClass: 'bg-emerald-800 border-emerald-700/60 text-emerald-100',
  },
  Waspada: {
    status: 'Waspada',
    badgeClass: 'bg-amber-400 text-amber-950',
    iconBgClass: 'bg-amber-400/20',
    iconTextClass: 'text-amber-300',
    icon: ShieldAlert,
    actionClass: 'bg-amber-400 text-amber-950',
    suitabilityClass: 'bg-amber-900/60 border-amber-700/60 text-amber-200',
  },
}

/**
 * getAdvisoryConfig resolves the presentation configuration for an advisory status.
 *
 * @param status - Advisory status string from BMKG analytics service.
 * @returns Matched AdvisoryConfig with fallback to Kondusif.
 */
export function getAdvisoryConfig(status?: string): AdvisoryConfig {
  if (status === 'Waspada') {
    return ADVISORY_CONFIG.Waspada
  }
  if (status === 'Optimal') {
    return ADVISORY_CONFIG.Optimal
  }
  return ADVISORY_CONFIG.Kondusif
}

interface CacheEntry {
  data: WeatherResponse
  timestamp: number
}

const weatherMemoryCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 5 * 60 * 1000

/**
 * fetchCachedWeather retrieves weather data from in-memory cache or requests fresh observations.
 *
 * @param region - Target agricultural territory name.
 * @returns Promise resolving to WeatherResponse.
 */
export async function fetchCachedWeather(region: string = 'Indonesia'): Promise<WeatherResponse> {
  const cached = weatherMemoryCache.get(region)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const fresh = await fetchWeather(region)
  weatherMemoryCache.set(region, {
    data: fresh,
    timestamp: now,
  })

  return fresh
}

/**
 * formatTemperature formats a Celsius reading with appropriate degree notation.
 *
 * @param celsius - Temperature numeric value.
 * @returns Formatted temperature string.
 */
export function formatTemperature(celsius: number): string {
  return `${celsius}°C`
}

/**
 * formatHumidity formats a relative humidity percentage.
 *
 * @param percent - Humidity numeric percentage.
 * @returns Formatted humidity string.
 */
export function formatHumidity(percent: number): string {
  return `${percent}%`
}

/**
 * formatWindSpeed formats a wind speed metric in kilometers per hour.
 *
 * @param speedKmh - Wind velocity in km/h.
 * @returns Formatted wind speed string.
 */
export function formatWindSpeed(speedKmh: number): string {
  return `${speedKmh} km/jam`
}
