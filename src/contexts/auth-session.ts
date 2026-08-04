import { createContext, useContext } from "react"

import type { Role } from "@/models/user.interface"

export type AuthStatus = "checking" | "authenticated" | "unauthenticated" | "error"

export interface AuthState {
  status: AuthStatus
  accessToken: string | null
  role: Role | null
  error: unknown
}

export interface AuthContextValue extends AuthState {
  isInitializing: boolean
  isAuthenticated: boolean
  retryInitialize: () => void
}

export const SESSION_EXPIRED_EVENT = "auth:session-expired"
export const AuthContext = createContext<AuthContextValue | null>(null)

export function useSession() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useSession must be used within AuthProvider")
  }
  return context
}
