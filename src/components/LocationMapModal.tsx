import React, { useState, useEffect, useRef, useCallback } from 'react'
import { MapPin, Navigation, Search, X, Check, RotateCcw, Loader2 } from 'lucide-react'
import L from 'leaflet'
import {
  AGRICULTURAL_REGIONS,
  calculateDistanceKm,
  findNearestRegion,
  createCustomPinIcon,
  LocationSearchResult,
  searchIndonesianLocations
} from '../utils/geo'

/**
 * LocationMapModalProps specifies modal state, current location, and confirmation callback.
 */
export interface LocationMapModalProps {
  isOpen: boolean
  onClose: () => void
  currentLocation?: string
  onSelectLocation: (locationName: string, coordinates?: [number, number], fullAddress?: string) => void
  title?: string
}

/**
 * LocationMapModal provides an interactive map for auto-detecting and manually searching locations.
 *
 * @param props - Modal controller properties and callbacks.
 * @returns JSX Element rendering map dialog.
 */
export function LocationMapModal(props: LocationMapModalProps): React.JSX.Element | null {
  const {
    isOpen,
    onClose,
    currentLocation = 'Semua',
    onSelectLocation,
    title = 'Pilih Lokasi Sentra Tani'
  } = props

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCoords, setSelectedCoords] = useState<[number, number]>([-6.8172, 107.1394])
  const [selectedLocationName, setSelectedLocationName] = useState(
    currentLocation === 'Semua' ? 'Cianjur, Jawa Barat' : currentLocation
  )
  const [detailedAddress, setDetailedAddress] = useState('')
  const [isDetectingGps, setIsDetectingGps] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const results = await searchIndonesianLocations(searchQuery, controller.signal)
        setSearchResults(results)
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [searchQuery])

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsReverseGeocoding(true)
    const nearest = findNearestRegion(lat, lng)
    const dist = calculateDistanceKm(lat, lng, nearest.lat, nearest.lng)

    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'id'
          }
        }
      )
      if (resp.ok) {
        const data = await resp.json()
        const city =
          data.address?.city ||
          data.address?.town ||
          data.address?.county ||
          data.address?.state_district ||
          ''
        const state = data.address?.state || ''
        const displayName =
          city && state
            ? `${city}, ${state}`
            : data.display_name?.split(',').slice(0, 2).join(',') || nearest.name
        setSelectedLocationName(displayName)
        setDetailedAddress(
          data.display_name || `${nearest.name} (${dist.toFixed(1)} km dari sentra)`
        )
        setStatusMessage(`Terdeteksi: ${displayName}`)
      } else {
        setSelectedLocationName(nearest.name)
        setDetailedAddress(`${nearest.name} (Dekat ${nearest.description})`)
      }
    } catch {
      setSelectedLocationName(nearest.name)
      setDetailedAddress(`${nearest.name} (Dekat ${nearest.description})`)
    } finally {
      setIsReverseGeocoding(false)
    }
  }, [])

  const updateMarkerPosition = useCallback(
    (lat: number, lng: number, isGps: boolean = false) => {
      setSelectedCoords([lat, lng])
      if (markerRef.current && mapInstanceRef.current) {
        markerRef.current.setLatLng([lat, lng])
        markerRef.current.setIcon(createCustomPinIcon(isGps))
        mapInstanceRef.current.flyTo([lat, lng], 13, { duration: 0.8 })
      }
      reverseGeocode(lat, lng)
    },
    [reverseGeocode]
  )

  const handleAutoDetectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusMessage('Browser tidak mendukung deteksi geolokasi otomatis.')
      return
    }

    setIsDetectingGps(true)
    setStatusMessage('Mendeteksi koordinat GPS perangkat Anda...')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false)
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        updateMarkerPosition(lat, lng, true)
        setStatusMessage('Lokasi perangkat Anda berhasil dideteksi.')
      },
      (err) => {
        setIsDetectingGps(false)
        const matched = AGRICULTURAL_REGIONS[0]
        updateMarkerPosition(matched.lat, matched.lng, false)
        if (err.code === 1) {
          setStatusMessage('Izin GPS ditolak. Silakan pilih lokasi pada peta atau cari manual.')
        } else {
          setStatusMessage('Gagal mengambil sinyal GPS. Menggunakan lokasi sentra Jawa Barat.')
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }, [updateMarkerPosition])

  const handleSelectSearchResult = useCallback(
    (item: LocationSearchResult) => {
      setSearchQuery('')
      setSearchResults([])
      setSelectedLocationName(item.name)
      setDetailedAddress(item.subtext)
      updateMarkerPosition(item.lat, item.lng, false)
    },
    [updateMarkerPosition]
  )

  const handleApply = useCallback(() => {
    onSelectLocation(selectedLocationName, selectedCoords, detailedAddress)
    onClose()
  }, [detailedAddress, onClose, onSelectLocation, selectedCoords, selectedLocationName])

  const handleResetToAll = useCallback(() => {
    onSelectLocation('Semua')
    onClose()
  }, [onClose, onSelectLocation])

  useEffect(() => {
    if (!isOpen) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
      return
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return

      let initLat = -6.8172
      let initLng = 107.1394

      if (currentLocation && currentLocation !== 'Semua') {
        const found = AGRICULTURAL_REGIONS.find((r) =>
          r.name.toLowerCase().includes(currentLocation.toLowerCase())
        )
        if (found) {
          initLat = found.lat
          initLng = found.lng
        }
      }

      const map = L.map(mapContainerRef.current, {
        center: [initLat, initLng],
        zoom: 11,
        zoomControl: true
      })

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap kontributor'
      }).addTo(map)

      const marker = L.marker([initLat, initLng], {
        icon: createCustomPinIcon(false),
        draggable: true
      }).addTo(map)

      marker.on('dragend', (e) => {
        const latLng = (e.target as L.Marker).getLatLng()
        updateMarkerPosition(latLng.lat, latLng.lng, false)
      })

      map.on('click', (e: L.LeafletMouseEvent) => {
        updateMarkerPosition(e.latlng.lat, e.latlng.lng, false)
      })

      mapInstanceRef.current = map
      markerRef.current = marker
      setSelectedCoords([initLat, initLng])
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [currentLocation, isOpen, updateMarkerPosition])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[92vh]">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih sentra tani atau deteksi lokasi Anda secara presisi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-3 sm:p-4 border-b border-slate-100 bg-white space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desa, kecamatan, kabupaten, atau pelosok..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
              />
              {isSearching ? (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-600">
                  <Loader2 size={14} className="animate-spin" />
                </div>
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchResults([])
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              disabled={isDetectingGps}
              onClick={handleAutoDetectLocation}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer disabled:opacity-60 shadow-xs shrink-0"
            >
              {isDetectingGps ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Navigation size={14} />
              )}
              <span className="hidden sm:inline">Deteksi GPS</span>
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-lg divide-y divide-slate-100">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSearchResult(item)}
                  className="w-full px-3 py-2 text-left hover:bg-emerald-50/80 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {item.subtext}
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 shrink-0">
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          )}

          {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <div className="px-3 py-2 text-center text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg">
              Tidak ada hasil spesifik untuk &ldquo;{searchQuery}&rdquo;. Coba sebutkan nama desa, kecamatan, atau kabupaten.
            </div>
          )}

          {statusMessage && (
            <p className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md">
              {statusMessage}
            </p>
          )}
        </div>

        <div className="relative flex-1 min-h-[280px] sm:min-h-[340px] bg-slate-100">
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
          {isReverseGeocoding && (
            <div className="absolute top-2 right-2 z-400 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 text-[11px] text-slate-700 font-medium border border-slate-200">
              <Loader2 size={13} className="animate-spin text-emerald-600" />
              <span>Memperbarui alamat...</span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lokasi Terpilih
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {selectedLocationName}
              </p>
              {detailedAddress && (
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {detailedAddress}
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block">Koordinat</span>
              <span className="text-[10px] font-mono text-slate-600 block">
                {selectedCoords[0].toFixed(4)}, {selectedCoords[1].toFixed(4)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleResetToAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset Semua Wilayah</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                <Check size={14} />
                <span>Terapkan Lokasi Ini</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
