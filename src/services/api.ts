import { AuthResponse, LoginCredentials, RegisterPayload, UpdateProfilePayload, UserProfile } from '../types/auth'
import { CreateProductInput, Product, UpdateProductInput } from '../types/product'
import { CheckoutPayload, Order, OrderStats } from '../types/order'
import { WeatherResponse } from '../types/weather'
import { FarmerApiRecord } from '../types/farmer'

const API_BASE_URL = 'http://localhost:8080'

/**
 * ApiError wraps HTTP error responses with status code and message.
 */
export class ApiError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
  }
}

/**
 * Fetch agricultural weather analytics from BMKG service via Gateway.
 *
 * @param region - Sentra pertanian name (e.g. Indonesia, Jawa Barat).
 * @returns WeatherResponse containing climate data and farming recommendations.
 */
export async function fetchWeather(region: string = 'Indonesia'): Promise<WeatherResponse> {
  const url = `${API_BASE_URL}/api/weather?region=${encodeURIComponent(region)}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new ApiError('Failed to fetch weather parameters', response.status)
  }
  return response.json()
}

/**
 * Fetch list of agricultural commodities from MongoDB Catalog via Gateway.
 *
 * @param search - Optional query string for commodity name search.
 * @param category - Optional category filter.
 * @returns Array of Product items.
 */
export async function fetchProducts(search?: string, category?: string): Promise<Product[]> {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (category && category !== 'Semua') params.append('category', category)

  const response = await fetch(`${API_BASE_URL}/api/products?${params.toString()}`)
  if (!response.ok) {
    throw new ApiError('Failed to fetch catalog commodities', response.status)
  }
  return response.json()
}

/**
 * Create new agricultural product in MongoDB catalog (Requires JWT Bearer Token).
 *
 * @param payload - Commodity specification input.
 * @param token - Bearer JWT string.
 * @returns Created Product item.
 */
export async function createProduct(payload: CreateProductInput, token: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to publish product', response.status)
  }
  return response.json()
}

/**
 * Delete agricultural product from catalog (Requires JWT Bearer Token).
 *
 * @param id - Product ObjectId hex string.
 * @param token - Bearer JWT string.
 */
export async function deleteProduct(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to delete commodity', response.status)
  }
}

/**
 * Update an existing agricultural product in MongoDB catalog (Requires JWT Bearer Token).
 *
 * @param id - Product ObjectId hex string.
 * @param payload - Updated commodity specification input.
 * @param token - Bearer JWT string.
 * @returns Updated Product item.
 */
export async function updateProduct(id: string, payload: UpdateProductInput, token: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to update commodity', response.status)
  }
  return response.json()
}

/**
 * Authenticate user and obtain JWT Bearer Token.
 *
 * @param credentials - User email and password.
 * @returns AuthResponse with JWT and User profile.
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Invalid email or password', response.status)
  }
  return response.json()
}

/**
 * Register a new user profile in MySQL database.
 *
 * @param payload - User registration information.
 * @returns Newly registered UserProfile.
 */
export async function registerUser(payload: RegisterPayload): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Registration failed', response.status)
  }
  const result = await response.json()
  return result.user
}

/**
 * Submit checkout transaction with ACID atomicity and stock deduction.
 *
 * @param payload - Order items and delivery address.
 * @param token - Bearer JWT string.
 * @returns Confirmed Order object with order code.
 */
export async function createOrder(payload: CheckoutPayload, token: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Transaction execution failed', response.status)
  }
  return response.json()
}

/**
 * Fetch transaction history for authenticated user (orders as buyer or incoming orders as farmer).
 *
 * @param userId - User identifier.
 * @param token - Bearer JWT string.
 * @param status - Optional transactional status filter.
 * @param role - Optional role scope filter.
 * @returns Array of orders matching criteria.
 */
export async function fetchUserOrders(
  userId: number,
  token: string,
  status?: string,
  role?: string
): Promise<Order[]> {
  const params = new URLSearchParams()
  if (userId > 0) {
    params.append('user_id', userId.toString())
  }
  if (status && status !== 'ALL') {
    params.append('status', status)
  }
  if (role) {
    params.append('role', role)
  }
  const queryString = params.toString() ? `?${params.toString()}` : ''

  const response = await fetch(`${API_BASE_URL}/api/orders/user${queryString}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new ApiError('Failed to load transaction history', response.status)
  }
  return response.json()
}

/**
 * Fetch all registered farmer producer profiles from MongoDB Catalog via Gateway.
 *
 * @returns Array of FarmerApiRecord items.
 */
export async function fetchFarmers(): Promise<FarmerApiRecord[]> {
  const response = await fetch(`${API_BASE_URL}/api/farmers`)
  if (!response.ok) {
    throw new ApiError('Failed to fetch farmers list', response.status)
  }
  return response.json()
}

/**
 * Fetch specific farmer producer profile by URL slug from MongoDB Catalog via Gateway.
 *
 * @param slug - Hyphenated identifier of the farmer.
 * @returns Detailed FarmerApiRecord object.
 */
export async function fetchFarmerBySlug(slug: string): Promise<FarmerApiRecord> {
  const response = await fetch(`${API_BASE_URL}/api/farmers/${encodeURIComponent(slug)}`)
  if (!response.ok) {
    throw new ApiError(`Farmer profile not found for slug: ${slug}`, response.status)
  }
  return response.json()
}

/**
 * Fetch profile data for the authenticated user (Requires JWT Bearer Token).
 *
 * @param token - Bearer JWT string.
 * @returns Authenticated UserProfile.
 */
export async function fetchUserProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to fetch user profile', response.status)
  }
  return response.json()
}

/**
 * Update profile data or password for authenticated user (Requires JWT Bearer Token).
 *
 * @param payload - Profile name or password update data.
 * @param token - Bearer JWT string.
 * @returns AuthResponse with refreshed token and updated UserProfile.
 */
export async function updateUserProfile(payload: UpdateProfilePayload, token: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to update user profile', response.status)
  }
  return response.json()
}

/**
 * Fetch sales statistics and transaction aggregates for authenticated dashboard.
 *
 * @param token - Bearer JWT string.
 * @returns OrderStats metrics, distribution, and recent orders.
 */
export async function fetchOrderStats(token: string): Promise<OrderStats> {
  const response = await fetch(`${API_BASE_URL}/api/orders/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to fetch sales statistics', response.status)
  }
  return response.json()
}

/**
 * Update transaction status of an order (e.g. PENDING -> PAID / SHIPPED / COMPLETED).
 *
 * @param orderCode - Unique order identifier code.
 * @param status - Target OrderStatus.
 * @param token - Bearer JWT string.
 * @returns Updated order confirmation object.
 */
export async function updateOrderStatus(
  orderCode: string,
  status: string,
  token: string
): Promise<{ message: string; order_code: string; status: string }> {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderCode}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new ApiError(errData.error || 'Failed to update order status', response.status)
  }
  return response.json()
}
