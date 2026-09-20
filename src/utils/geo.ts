import L from 'leaflet'

/**
 * AgriculturalRegion represents a documented Indonesian agricultural center with geographical coordinates.
 */
export interface AgriculturalRegion {
  name: string
  province: string
  lat: number
  lng: number
  description: string
}

/**
 * Predefined primary agricultural centers across Indonesia for instant matching and filtering.
 */
export const AGRICULTURAL_REGIONS: AgriculturalRegion[] = [
  {
    name: 'Cianjur, Jawa Barat',
    province: 'Jawa Barat',
    lat: -6.8172,
    lng: 107.1394,
    description: 'Sentra Padi Pandan Wangi & Hortikultura'
  },
  {
    name: 'Lembang, Jawa Barat',
    province: 'Jawa Barat',
    lat: -6.8168,
    lng: 107.6178,
    description: 'Sentra Sayuran Segar & Tomat Hidroponik'
  },
  {
    name: 'Garut, Jawa Barat',
    province: 'Jawa Barat',
    lat: -7.2278,
    lng: 107.9087,
    description: 'Sentra Cabai Keriting & Jeruk Garut'
  },
  {
    name: 'Pangalengan, Jawa Barat',
    province: 'Jawa Barat',
    lat: -7.1788,
    lng: 107.5684,
    description: 'Sentra Kubis Putih & Perkebunan Sayur Dataran Tinggi'
  },
  {
    name: 'Sukabumi, Jawa Barat',
    province: 'Jawa Barat',
    lat: -6.9277,
    lng: 106.9299,
    description: 'Sentra Singkong Gajah & Palawija Organik'
  },
  {
    name: 'Sumedang, Jawa Barat',
    province: 'Jawa Barat',
    lat: -6.8584,
    lng: 107.9266,
    description: 'Sentra Ubi Cilembu Madu Asli'
  },
  {
    name: 'Dieng, Jawa Tengah',
    province: 'Jawa Tengah',
    lat: -7.2045,
    lng: 109.9077,
    description: 'Sentra Kentang Granola Super & Carica'
  },
  {
    name: 'Brebes, Jawa Tengah',
    province: 'Jawa Tengah',
    lat: -6.8703,
    lng: 109.0436,
    description: 'Sentra Bawang Merah Terbesar Nasional'
  },
  {
    name: 'Grobogan, Jawa Tengah',
    province: 'Jawa Tengah',
    lat: -7.1082,
    lng: 110.9169,
    description: 'Sentra Jagung Hibrida & Kedelai Lokal Non-GMO'
  },
  {
    name: 'Temanggung, Jawa Tengah',
    province: 'Jawa Tengah',
    lat: -7.3186,
    lng: 110.1772,
    description: 'Sentra Bawang Putih Tunggal & Herbal'
  },
  {
    name: 'Pati, Jawa Tengah',
    province: 'Jawa Tengah',
    lat: -6.7562,
    lng: 111.0379,
    description: 'Sentra Kacang Hijau Organik & Padi'
  },
  {
    name: 'Kediri, Jawa Timur',
    province: 'Jawa Timur',
    lat: -7.848,
    lng: 112.0178,
    description: 'Sentra Cabai Rawit Merah & Nanas Madu'
  },
  {
    name: 'Tuban, Jawa Timur',
    province: 'Jawa Timur',
    lat: -6.8976,
    lng: 112.0649,
    description: 'Sentra Kacang Tanah Kupas Super'
  },
  {
    name: 'Banyuwangi, Jawa Timur',
    province: 'Jawa Timur',
    lat: -8.2192,
    lng: 114.3692,
    description: 'Sentra Jahe Merah Pilihan & Hortikultura'
  },
  {
    name: 'Solok, Sumatera Barat',
    province: 'Sumatera Barat',
    lat: -0.7938,
    lng: 100.6588,
    description: 'Sentra Beras Merah Aromatik Bareh Solok'
  },
  {
    name: 'Alahan Panjang, Sumatera Barat',
    province: 'Sumatera Barat',
    lat: -1.0772,
    lng: 100.7719,
    description: 'Sentra Brokoli Hijau Dataran Tinggi & Kol'
  },
  {
    name: 'Karo, Sumatera Utara',
    province: 'Sumatera Utara',
    lat: 3.1167,
    lng: 98.5,
    description: 'Sentra Wortel Brastagi Segar'
  }
]

/**
 * Calculates geographic distance in kilometers using the Haversine formula.
 *
 * @param lat1 - Latitude of starting point.
 * @param lon1 - Longitude of starting point.
 * @param lat2 - Latitude of destination point.
 * @param lon2 - Longitude of destination point.
 * @returns Distance in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const r = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return r * c
}

/**
 * Resolves the closest Indonesian agricultural region to the given coordinates.
 *
 * @param lat - Target latitude.
 * @param lng - Target longitude.
 * @returns Nearest AgriculturalRegion object.
 */
export function findNearestRegion(lat: number, lng: number): AgriculturalRegion {
  let closest = AGRICULTURAL_REGIONS[0]
  let minDistance = Infinity

  for (const reg of AGRICULTURAL_REGIONS) {
    const dist = calculateDistanceKm(lat, lng, reg.lat, reg.lng)
    if (dist < minDistance) {
      minDistance = dist
      closest = reg
    }
  }

  return closest
}

/**
 * Creates custom Leaflet DivIcon with emerald branding and optional radar animation.
 *
 * @param isGps - Boolean indicating whether marker denotes detected GPS coordinates.
 * @returns Leaflet DivIcon instance.
 */
export function createCustomPinIcon(isGps: boolean = false): L.DivIcon {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:#059669;color:#ffffff;border:2.5px solid #ffffff;border-radius:9999px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);position:relative;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
      ${isGps ? '<span style="position:absolute;inset:-6px;border-radius:9999px;border:2px solid #10b981;opacity:0.75;"></span>' : ''}
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34]
  })
}

/**
 * LocationSearchResult specifies unified search results across local sentras and OpenStreetMap.
 */
export interface LocationSearchResult {
  id: string
  name: string
  subtext: string
  badge: string
  lat: number
  lng: number
}

/**
 * Searches Indonesian locations, including specific remote villages and subdistricts.
 *
 * @param query - Search term entered by user.
 * @param signal - AbortSignal for canceling in-flight fetch requests.
 * @returns Promise resolving to an array of LocationSearchResult items.
 */
export async function searchIndonesianLocations(
  query: string,
  signal?: AbortSignal
): Promise<LocationSearchResult[]> {
  const trimmed = query.trim().toLowerCase()
  if (trimmed.length < 2) {
    return []
  }

  const results: LocationSearchResult[] = []
  const seenCoordinates = new Set<string>()

  for (const reg of AGRICULTURAL_REGIONS) {
    if (
      reg.name.toLowerCase().includes(trimmed) ||
      reg.province.toLowerCase().includes(trimmed) ||
      reg.description.toLowerCase().includes(trimmed)
    ) {
      const coordKey = `${reg.lat.toFixed(3)},${reg.lng.toFixed(3)}`
      seenCoordinates.add(coordKey)
      results.push({
        id: `sentra-${reg.name}`,
        name: reg.name,
        subtext: reg.description,
        badge: 'Sentra Tani',
        lat: reg.lat,
        lng: reg.lng
      })
    }
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=id&limit=8&addressdetails=1`

    const resp = await fetch(url, {
      signal,
      headers: {
        'Accept-Language': 'id'
      }
    })

    if (resp.ok) {
      const data = await resp.json()
      for (const item of data) {
        const lat = parseFloat(item.lat)
        const lng = parseFloat(item.lon)
        const coordKey = `${lat.toFixed(3)},${lng.toFixed(3)}`

        if (seenCoordinates.has(coordKey)) {
          continue
        }
        seenCoordinates.add(coordKey)

        let badge = 'Wilayah'
        const addr = item.address || {}
        if (addr.village || item.type === 'village') {
          badge = 'Desa / Pelosok'
        } else if (addr.subdistrict || item.type === 'administrative') {
          badge = 'Kecamatan'
        } else if (addr.hamlet) {
          badge = 'Dusun'
        } else if (addr.county) {
          badge = 'Kabupaten'
        } else if (addr.city) {
          badge = 'Kota'
        }

        const primaryName =
          addr.village ||
          addr.subdistrict ||
          addr.county ||
          item.name ||
          item.display_name.split(',')[0]

        const province = addr.state || ''
        const cityOrCounty = addr.city || addr.county || ''
        const formattedTitle =
          cityOrCounty && province
            ? `${primaryName}, ${cityOrCounty}`
            : item.display_name.split(',').slice(0, 2).join(',')

        results.push({
          id: `osm-${item.place_id}`,
          name: formattedTitle,
          subtext: item.display_name,
          badge,
          lat,
          lng
        })
      }
    }
  } catch {
    return results
  }

  return results
}
