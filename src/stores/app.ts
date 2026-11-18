import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { storage } from '@/utils/storage'

const SIDEBAR_KEY = 'sentinel:sidebar-collapsed'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref<boolean>(storage.get<boolean>(SIDEBAR_KEY) ?? false)

  function toggleSidebar(): void {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  watch(sidebarCollapsed, (value) => {
    storage.set(SIDEBAR_KEY, value)
  })

  return { sidebarCollapsed, toggleSidebar }
})
