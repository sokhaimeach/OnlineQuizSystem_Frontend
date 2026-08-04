import type { Role } from "@/models/user.interface"

const VALID_ROLES = ["ADMIN", "TEACHER", "STUDENT"] as const

type UnknownRecord = Record<string, unknown>

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && VALID_ROLES.includes(value as Role)
}

export function normalizeRole(value: unknown): Role | null {
  if (isRole(value)) return value
  return null
}

export function getStoredRole(): Role | null {
  const role = normalizeRole(localStorage.getItem("user_role"))
  if (!role) localStorage.removeItem("user_role")
  return role
}

export function setStoredRole(role: unknown): Role | null {
  const normalizedRole = normalizeRole(role)
  if (normalizedRole) localStorage.setItem("user_role", normalizedRole)
  else localStorage.removeItem("user_role")
  return normalizedRole
}

export function getRoleFromToken(token: string | null): Role | null {
  const payload = parseJwtPayload(token)
  return getRoleFromAuthPayload(payload)
}

export function isTokenExpired(token: string | null, skewMs = 30_000): boolean {
  const payload = parseJwtPayload(token)
  if (!isRecord(payload)) return true

  const exp = payload.exp
  if (typeof exp !== "number") return true

  return exp * 1000 <= Date.now() + skewMs
}

export function getRoleFromAuthPayload(payload: unknown): Role | null {
  if (!isRecord(payload)) return null

  return normalizeRole(payload.role)
    ?? getRoleFromAuthPayload(payload.user)
    ?? getRoleFromAuthPayload(payload.data)
}

export function getAccessTokenFromAuthPayload(payload: unknown): string | null {
  if (!isRecord(payload)) return null

  const token = payload.access_token ?? payload.accessToken ?? payload.token
  if (typeof token === "string" && token.length > 0) return token

  const nested: string | null = getAccessTokenFromAuthPayload(payload.data)
    ?? getAccessTokenFromAuthPayload(payload.user)
  return nested
}

export function requiresTwoFactor(payload: unknown): boolean {
  if (!isRecord(payload)) return false

  return payload.requires2FA === true
    || (isRecord(payload.data) && payload.data.requires2FA === true)
}

export function getTemporaryTokenFromAuthPayload(payload: unknown): string | null {
  if (!isRecord(payload)) return null

  const token = payload.temporaryToken
    ?? (isRecord(payload.data) ? payload.data.temporaryToken : null)
  if (typeof token === "string" && token.length > 0) return token

  const nested: string | null = getTemporaryTokenFromAuthPayload(payload.data)
  return nested
}

function parseJwtPayload(token: string | null): unknown {
  if (!token) return null
  try {
    const encoded = token.split(".")[1]
    if (!encoded) return null
    return JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")))
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null
}
