/**
 * ApiError wraps HTTP error responses with status code and server message.
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
 * RequestOptions defines configuration parameters for sending an HTTP request across the transport seam.
 */
export interface RequestOptions<TBody = unknown> {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  token?: string | null
  params?: Record<string, string | number | boolean | undefined>
  body?: TBody
  headers?: Record<string, string>
}

/**
 * HttpClient defines the contract for dispatching network requests and receiving parsed payloads.
 */
export interface HttpClient {
  request<TResponse, TBody = unknown>(options: RequestOptions<TBody>): Promise<TResponse>
}

/**
 * FetchHttpAdapter satisfies the HttpClient interface using the browser native fetch API.
 */
export class FetchHttpAdapter implements HttpClient {
  private baseUrl: string

  constructor(baseUrl: string = 'http://localhost:8080') {
    this.baseUrl = baseUrl
  }

  public async request<TResponse, TBody = unknown>(options: RequestOptions<TBody>): Promise<TResponse> {
    const { path, method = 'GET', token, params, body, headers = {} } = options

    const url = new URL(path.startsWith('http') ? path : `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`)

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          url.searchParams.append(key, String(val))
        }
      })
    }

    const requestHeaders: Record<string, string> = {
      ...headers,
    }

    if (body !== undefined) {
      requestHeaders['Content-Type'] = 'application/json'
    }

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      const message = errData.error || errData.message || `Request failed with status ${response.status}`
      throw new ApiError(message, response.status)
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as TResponse
    }

    const data = await response.json().catch(() => ({}))
    return data as TResponse
  }
}

/**
 * InMemoryHttpAdapter satisfies the HttpClient interface using an in-memory mock registry for deterministic testing.
 */
export class InMemoryHttpAdapter implements HttpClient {
  private registry: Map<string, { status: number; data: unknown }>

  constructor() {
    this.registry = new Map()
  }

  public registerMock(method: string, path: string, data: unknown, status: number = 200): void {
    const key = `${method.toUpperCase()}:${path}`
    this.registry.set(key, { status, data })
  }

  public async request<TResponse, TBody = unknown>(options: RequestOptions<TBody>): Promise<TResponse> {
    const method = (options.method || 'GET').toUpperCase()
    const key = `${method}:${options.path}`
    const match = this.registry.get(key)

    if (!match) {
      throw new ApiError(`No mock registered for ${key}`, 404)
    }

    if (match.status >= 400) {
      throw new ApiError(`Mock error for ${key}`, match.status)
    }

    return match.data as TResponse
  }
}

/**
 * Default singleton HttpClient instance using the native FetchHttpAdapter.
 */
export const httpClient: HttpClient = new FetchHttpAdapter()
