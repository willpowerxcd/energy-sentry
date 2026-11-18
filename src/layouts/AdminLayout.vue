<template>
  <div class="admin-layout" :class="{ 'is-collapsed': app.sidebarCollapsed }">
    <AppHeader />
    <div class="admin-body">
      <AppSidebar />
      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'

const app = useAppStore()
</script>

<style scoped>
.admin-layout {
  --sidebar-w: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-page);
}

.admin-layout.is-collapsed {
  --sidebar-w: var(--sidebar-collapsed-width);
}

.admin-body {
  display: flex;
  flex: 1;
  min-height: 0;
}

.admin-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  padding: var(--page-padding);
}

@media (max-width: 1100px) {
  .admin-main {
    padding: 16px;
  }
}
</style>
