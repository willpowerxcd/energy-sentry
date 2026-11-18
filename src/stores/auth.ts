import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser, LoginPayload, Role } from '@/api/types/auth'
import { loginApi, logoutApi, meApi } from '@/api/modules/auth'
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '@/api/session'

export const useAuthStore = defineStore('auth', () => {
  const stored = getStoredAuth()

  const user = ref<AuthUser | null>(stored?.user ?? null)
  const accessToken = ref(stored?.access_token ?? '')
  const refreshToken = ref(stored?.refresh_token ?? '')
  const loading = ref(false)

  const isLoggedIn = computed(() => Boolean(accessToken.value))
  const roles = computed<Role[]>(() => user.value?.roles ?? [])
  const permissions = computed(() => user.value?.permissions ?? [])

  function persist(): void {
    if (accessToken.value && refreshToken.value) {
      setStoredAuth({
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
        user: user.value ?? undefined,
      })
    } else {
      clearStoredAuth()
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    loading.value = true
    try {
      const res = await loginApi(payload)
      accessToken.value = res.access_token
      refreshToken.value = res.refresh_token
      user.value = res.user
      persist()
    } finally {
      loading.value = false
    }
  }

  async function fetchMe(): Promise<AuthUser> {
    const me = await meApi()
    user.value = me
    persist()
    return me
  }

  async function logout(): Promise<void> {
    try {
      await logoutApi()
    } catch {
      // Logging out locally is more important than the server call.
    } finally {
      accessToken.value = ''
      refreshToken.value = ''
      user.value = null
      clearStoredAuth()
    }
  }

  function hasRole(role: string): boolean {
    return roles.value.includes(role as Role)
  }

  function hasAnyRole(list?: string[]): boolean {
    if (!list?.length) return true
    return list.some((role) => hasRole(role))
  }

  function hasPermission(code: string): boolean {
    return permissions.value.includes(code)
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    isLoggedIn,
    roles,
    permissions,
    login,
    fetchMe,
    logout,
    hasRole,
    hasAnyRole,
    hasPermission,
  }
})
