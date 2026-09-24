/**
 * UserRole defines the available authorization roles in AgroConnect.
 */
export type UserRole = 'admin' | 'farmer' | 'buyer'

/**
 * UserProfile represents the authenticated user's profile information.
 */
export interface UserProfile {
  id: number
  name: string
  email: string
  role: UserRole
  avatar_url?: string
}

/**
 * AuthResponse represents the server response after successful authentication.
 */
export interface AuthResponse {
  token: string
  user: UserProfile
}

/**
 * LoginCredentials represents the login request payload.
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * RegisterPayload represents the user registration request payload.
 */
export interface RegisterPayload {
  name: string
  email: string
  password: string
  role: UserRole
}

/**
 * UpdateProfilePayload represents the payload to update user profile information or password.
 */
export interface UpdateProfilePayload {
  name?: string
  avatar_url?: string
  old_password?: string
  new_password?: string
}
