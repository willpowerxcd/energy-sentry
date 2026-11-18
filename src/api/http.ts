import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiError } from '@/api/types/common'
import { API_BASE_URL } from '@/config/env'
import { clearStoredAuth, getAccessToken, getStoredAuth, refreshSession } from './session'

export interface HttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`

  config.headers['X-Request-Id'] =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

  return config
})

instance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error.response?.status as number | undefined
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
    const url = original?.url ?? ''

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !url.includes('/auth/login') &&
      !url.includes('/auth/refresh') &&
      getStoredAuth()?.refresh_token
    ) {
      original._retry = true
      try {
        const token = await refreshSession()
        original.headers = {
          ...(original.headers ?? {}),
          Authorization: `Bearer ${token}`,
        }
        return instance(original)
      } catch {
        clearStoredAuth()
        redirectToLogin()
      }
    }

    if (status === 401) {
      clearStoredAuth()
      redirectToLogin()
    }

    const message = (error.response?.data as ApiError | undefined)?.message
    if (status !== 401) {
      ElMessage.error(message || (status === 403 ? '没有权限执行此操作' : '请求失败，请稍后重试'))
    }

    return Promise.reject(error)
  },
)

function redirectToLogin(): void {
  if (location.pathname === '/login') return
  const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
  location.assign(`/login?redirect=${redirect}`)
}

export const http = instance as unknown as HttpClient
