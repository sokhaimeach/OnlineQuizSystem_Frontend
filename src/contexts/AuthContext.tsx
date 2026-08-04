import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { AxiosError } from "axios"

import { refreshAccessToken } from "@/lib/axios"
import {
  AuthContext,
  SESSION_EXPIRED_EVENT,
  type AuthContextValue,
  type AuthState,
} from "@/contexts/auth-session"
import {
  getRoleFromToken,
  getStoredRole,
  isTokenExpired,
  setStoredRole,
} from "@/utils/authRole"
import {
  getAccessToken,
  removeAccessToken,
} from "@/utils/tokenStorage"

const initialState: AuthState = {
  status: "checking",
  accessToken: null,
  role: null,
  error: null,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)
  const [retryNonce, setRetryNonce] = useState(0)

  const retryInitialize = useCallback(() => {
    setState(initialState)
    setRetryNonce((value) => value + 1)
  }, [])

  useEffect(() => {
    let isActive = true

    async function initializeAuth() {
      const currentToken = getAccessToken()
      const currentRole = getStoredRole() ?? getRoleFromToken(currentToken)

      if (currentToken && !isTokenExpired(currentToken) && currentRole) {
        const role = setStoredRole(currentRole)
        if (isActive) {
          setState({
            status: "authenticated",
            accessToken: currentToken,
            role,
            error: null,
          })
        }
        return
      }

      try {
        const newAccessToken = await refreshAccessToken()
        const restoredRole =
          setStoredRole(
            getRoleFromToken(newAccessToken) ??
            getStoredRole() ??
            currentRole
          )

        if (!restoredRole) {
          removeAccessToken()
        }

        if (isActive) {
          setState({
            status: restoredRole ? "authenticated" : "unauthenticated",
            accessToken: restoredRole ? newAccessToken : null,
            role: restoredRole,
            error: null,
          })
        }
      } catch (error) {
        const status = (error as AxiosError).response?.status

        if (status === 401 || status === 403) {
          removeAccessToken()
          localStorage.removeItem("user_role")
          if (isActive) {
            setState({
              status: "unauthenticated",
              accessToken: null,
              role: null,
              error: null,
            })
          }
          return
        }

        if (isActive) {
          setState({
            status: "error",
            accessToken: null,
            role: null,
            error,
          })
        }
      }
    }

    void initializeAuth()

    return () => {
      isActive = false
    }
  }, [retryNonce])

  useEffect(() => {
    function handleSessionExpired() {
      setState({
        status: "unauthenticated",
        accessToken: null,
        role: null,
        error: null,
      })
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    isInitializing: state.status === "checking",
    isAuthenticated: state.status === "authenticated",
    retryInitialize,
  }), [retryInitialize, state])

  if (state.status === "checking") {
    return <AuthBootstrapScreen />
  }

  if (state.status === "error") {
    return <AuthBootstrapError onRetry={retryInitialize} />
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

function AuthBootstrapScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="space-y-3 text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-2 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Restoring your session...</p>
      </div>
    </div>
  )
}

function AuthBootstrapError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-sm space-y-4 text-center">
        <div>
          <h1 className="text-lg font-semibold">Unable to restore session</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Check your connection and try again.
          </p>
        </div>
        <button
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )
}
