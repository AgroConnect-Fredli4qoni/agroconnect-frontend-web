import { AuthResponse, LoginCredentials, RegisterPayload, UpdateProfilePayload, UserProfile } from '../types/auth'
import { CreateProductInput, Product, UpdateProductInput } from '../types/product'
import { CheckoutPayload, Order, OrderStats } from '../types/order'
import { WeatherResponse } from '../types/weather'
import { FarmerApiRecord } from '../types/farmer'
import { httpClient, ApiError } from './httpClient'

export { ApiError, httpClient }

/**
 * Fetch agricultural weather analytics from BMKG service via Gateway.
 *
 * @param region - Sentra pertanian name (e.g. Indonesia, Jawa Barat).
 * @returns WeatherResponse containing climate data and farming recommendations.
 */
export async function fetchWeather(region: string = 'Indonesia'): Promise<WeatherResponse> {
  return httpClient.request<WeatherResponse>({
    path: '/api/weather',
    params: { region },
  })
}

/**
 * Fetch list of agricultural commodities from MongoDB Catalog via Gateway.
 *
 * @param search - Optional query string for commodity name search.
 * @param category - Optional category filter.
 * @returns Array of Product items.
 */
export async function fetchProducts(search?: string, category?: string): Promise<Product[]> {
  return httpClient.request<Product[]>({
    path: '/api/products',
    params: {
      search,
      category: category && category !== 'Semua' ? category : undefined,
    },
  })
}

/**
 * Create new agricultural product in MongoDB catalog (Requires JWT Bearer Token).
 *
 * @param payload - Commodity specification input.
 * @param token - Bearer JWT string.
 * @returns Created Product item.
 */
export async function createProduct(payload: CreateProductInput, token: string): Promise<Product> {
  return httpClient.request<Product>({
    path: '/api/products',
    method: 'POST',
    token,
    body: payload,
  })
}

/**
 * Delete agricultural product from catalog (Requires JWT Bearer Token).
 *
 * @param id - Product ObjectId hex string.
 * @param token - Bearer JWT string.
 */
export async function deleteProduct(id: string, token: string): Promise<void> {
  return httpClient.request<void>({
    path: `/api/products/${id}`,
    method: 'DELETE',
    token,
  })
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
  return httpClient.request<Product>({
    path: `/api/products/${id}`,
    method: 'PUT',
    token,
    body: payload,
  })
}

/**
 * Authenticate user and obtain JWT Bearer Token.
 *
 * @param credentials - User email and password.
 * @returns AuthResponse with JWT and User profile.
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  return httpClient.request<AuthResponse>({
    path: '/api/auth/login',
    method: 'POST',
    body: credentials,
  })
}

/**
 * Register a new user profile in MySQL database.
 *
 * @param payload - User registration information.
 * @returns Newly registered UserProfile.
 */
export async function registerUser(payload: RegisterPayload): Promise<UserProfile> {
  const result = await httpClient.request<{ user: UserProfile }>({
    path: '/api/auth/register',
    method: 'POST',
    body: payload,
  })
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
  return httpClient.request<Order>({
    path: '/api/orders',
    method: 'POST',
    token,
    body: payload,
  })
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
  return httpClient.request<Order[]>({
    path: '/api/orders/user',
    token,
    params: {
      user_id: userId > 0 ? userId : undefined,
      status: status && status !== 'ALL' ? status : undefined,
      role: role || undefined,
    },
  })
}

/**
 * Fetch all registered farmer producer profiles from MongoDB Catalog via Gateway.
 *
 * @returns Array of FarmerApiRecord items.
 */
export async function fetchFarmers(): Promise<FarmerApiRecord[]> {
  return httpClient.request<FarmerApiRecord[]>({
    path: '/api/farmers',
  })
}

/**
 * Fetch specific farmer producer profile by URL slug from MongoDB Catalog via Gateway.
 *
 * @param slug - Hyphenated identifier of the farmer.
 * @returns Detailed FarmerApiRecord object.
 */
export async function fetchFarmerBySlug(slug: string): Promise<FarmerApiRecord> {
  return httpClient.request<FarmerApiRecord>({
    path: `/api/farmers/${encodeURIComponent(slug)}`,
  })
}

/**
 * Fetch profile data for the authenticated user (Requires JWT Bearer Token).
 *
 * @param token - Bearer JWT string.
 * @returns Authenticated UserProfile.
 */
export async function fetchUserProfile(token: string): Promise<UserProfile> {
  return httpClient.request<UserProfile>({
    path: '/api/auth/profile',
    token,
  })
}

/**
 * Update profile data or password for authenticated user (Requires JWT Bearer Token).
 *
 * @param payload - Profile name or password update data.
 * @param token - Bearer JWT string.
 * @returns AuthResponse with refreshed token and updated UserProfile.
 */
export async function updateUserProfile(payload: UpdateProfilePayload, token: string): Promise<AuthResponse> {
  return httpClient.request<AuthResponse>({
    path: '/api/auth/profile',
    method: 'PUT',
    token,
    body: payload,
  })
}

/**
 * Fetch sales statistics and transaction aggregates for authenticated dashboard.
 *
 * @param token - Bearer JWT string.
 * @param role - Optional role scope filter ('farmer' or 'buyer').
 * @returns OrderStats metrics, distribution, and recent orders.
 */
export async function fetchOrderStats(token: string, role?: string): Promise<OrderStats> {
  return httpClient.request<OrderStats>({
    path: '/api/orders/stats',
    token,
    params: {
      role: role || undefined,
    },
  })
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
  return httpClient.request<{ message: string; order_code: string; status: string }>({
    path: `/api/orders/${orderCode}/status`,
    method: 'PATCH',
    token,
    body: { status },
  })
}
