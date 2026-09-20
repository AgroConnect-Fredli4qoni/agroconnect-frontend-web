import React, { createContext, useContext, useState, useEffect } from 'react'
import { LoginCredentials, RegisterPayload, UserProfile } from '../types/auth'
import { loginUser, registerUser } from '../services/api'

/**
 * AuthContextType defines state and actions provided by AuthContext.
 */
export interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  updateUserSession: (user: UserProfile, token?: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider manages user authentication lifecycle and persistent session token.
 *
 * @param props - Child React elements.
 * @returns JSX Element wrapping children with AuthContext.
 */
export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('agro_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('agro_token')
  })

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('agro_user', JSON.stringify(user))
      localStorage.setItem('agro_token', token)
    } else {
      localStorage.removeItem('agro_user')
      localStorage.removeItem('agro_token')
    }
  }, [user, token])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const data = await loginUser(credentials)
    setUser(data.user)
    setToken(data.token)
  }

  const register = async (payload: RegisterPayload): Promise<void> => {
    await registerUser(payload)
    await login({ email: payload.email, password: payload.password })
  }

  const logout = (): void => {
    setUser(null)
    setToken(null)
  }

  const updateUserSession = (updatedUser: UserProfile, updatedToken?: string): void => {
    setUser(updatedUser)
    if (updatedToken) {
      setToken(updatedToken)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUserSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth hook provides convenient access to the AuthContext state.
 *
 * @returns AuthContextType containing user session and actions.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be utilized within an AuthProvider hierarchy')
  }
  return context
}
