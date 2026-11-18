import type { AuthUser, LoginPayload, LoginResponse } from '@/api/types/auth'
import { http } from '../http'

export function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return http.post<LoginResponse>('/auth/login', payload)
}

export function meApi(): Promise<AuthUser> {
  return http.get<AuthUser>('/auth/me')
}

export function logoutApi(): Promise<void> {
  return http.post<void>('/auth/logout')
}
