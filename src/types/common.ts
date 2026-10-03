/**
 * Common shared type definitions for application-wide data exchange and UI interactions.
 */

/**
 * Standard API response envelope structure.
 */
export interface ApiResponse<TData> {
  success: boolean
  message: string
  data: TData
}

/**
 * Pagination metadata specification.
 */
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

/**
 * Geographical latitude and longitude coordinates.
 */
export interface GeoCoordinates {
  latitude: number
  longitude: number
}

/**
 * Generic key-value option for dropdown select components.
 */
export interface SelectOption<TValue = string> {
  value: TValue
  label: string
}
