import axios from 'axios'
import type { AuthUser, RefreshResponse } from '@/api/types/auth'
import { API_BASE_URL } from '@/config/env'
import { storage } from '@/utils/storage'

const AUTH_KEY = 'sentinel:auth'

export interface StoredAuth {
  access_token: string
  refresh_token: string
  user?: AuthUser
}

export function getStoredAuth(): StoredAuth | null {
  return storage.get<StoredAuth>(AUTH_KEY)
}

export function setStoredAuth(auth: StoredAuth): void {
  storage.set(AUTH_KEY, auth)
}

export function clearStoredAuth(): void {
  storage.remove(AUTH_KEY)
}

export function getAccessToken(): string {
  return getStoredAuth()?.access_token ?? ''
}

let refreshPromise: Promise<string> | null = null

export function refreshSession(): Promise<string> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const stored = getStoredAuth()
    if (!stored?.refresh_token) throw new Error('No refresh token')

    const { data } = await axios.post<RefreshResponse>(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: stored.refresh_token,
    })

    setStoredAuth({
      ...stored,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    })

    return data.access_token
  })().finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}
