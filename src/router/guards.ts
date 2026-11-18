import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export function setupGuards(router: Router): void {
  router.beforeEach(async (to) => {
    document.title = to.meta.title ? `${to.meta.title} - 能耗哨兵` : '能耗哨兵'

    if (to.meta.devOnly && !import.meta.env.DEV) {
      return { name: 'not-found' }
    }

    const auth = useAuthStore()

    if (to.meta.public) {
      if (to.name === 'login' && auth.isLoggedIn) {
        return { path: '/dashboard' }
      }
      return true
    }

    if (!auth.isLoggedIn) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }

    if (!auth.user) {
      try {
        await auth.fetchMe()
      } catch {
        await auth.logout()
        return { path: '/login', query: { redirect: to.fullPath } }
      }
    }

    if (to.meta.roles && !auth.hasAnyRole(to.meta.roles)) {
      return { name: 'forbidden' }
    }

    return true
  })
}
