<template>
  <aside class="app-sidebar" :class="{ 'is-collapsed': app.sidebarCollapsed }">
    <nav class="app-sidebar__nav" aria-label="主导航">
      <router-link
        v-for="item in menuItems"
        :key="String(item.name)"
        :to="routePath(item)"
        class="nav-item"
        :class="{ 'is-active': isActive(item) }"
        :title="String(item.meta?.title ?? '')"
      >
        <component :is="iconMap[String(item.meta?.icon)]" class="nav-item__icon" />
        <span v-if="!app.sidebarCollapsed" class="nav-item__label">
          {{ item.meta?.title }}
        </span>
      </router-link>
    </nav>

    <button
      class="sidebar-collapse"
      type="button"
      :aria-label="app.sidebarCollapsed ? '展开菜单' : '收起菜单'"
      @click="app.toggleSidebar()"
    >
      <IconChevronsRight v-if="app.sidebarCollapsed" class="sidebar-collapse__icon" />
      <IconChevronsLeft v-else class="sidebar-collapse__icon" />
      <span v-if="!app.sidebarCollapsed">收起菜单</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'
import IconActivity from '~icons/lucide/activity'
import IconBell from '~icons/lucide/bell'
import IconChevronsLeft from '~icons/lucide/chevrons-left'
import IconChevronsRight from '~icons/lucide/chevrons-right'
import IconFileText from '~icons/lucide/file-text'
import IconHome from '~icons/lucide/home'
import IconLeaf from '~icons/lucide/leaf'
import IconPieChart from '~icons/lucide/pie-chart'
import IconServer from '~icons/lucide/server'
import IconSettings from '~icons/lucide/settings'
import { routes } from '@/router/routes'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import type { RouteRecordRaw } from 'vue-router'

const app = useAppStore()
const auth = useAuthStore()
const route = useRoute()

const iconMap: Record<string, Component> = {
  home: IconHome,
  monitoring: IconActivity,
  alarm: IconBell,
  efficiency: IconPieChart,
  suggestion: IconLeaf,
  report: IconFileText,
  device: IconServer,
  settings: IconSettings,
}

const layoutRoute = routes.find((item) => item.name === 'root')

const menuItems = computed(() =>
  (layoutRoute?.children ?? []).filter(
    (item) =>
      !item.meta?.hidden && auth.hasAnyRole(item.meta?.roles as string[] | undefined),
  ),
)

function routePath(item: RouteRecordRaw): string {
  return item.path.startsWith('/') ? item.path : `/${item.path}`
}

function isActive(item: RouteRecordRaw): boolean {
  const path = routePath(item)
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<style scoped>
.app-sidebar {
  display: flex;
  flex: 0 0 var(--sidebar-w);
  flex-direction: column;
  width: var(--sidebar-w);
  padding: 12px;
  overflow: hidden;
  background: var(--color-bg-surface);
  border-right: 1px solid var(--color-border);
  transition: width 0.18s ease;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 14px;
  white-space: nowrap;
  transition:
    background 0.16s ease,
    color 0.16s ease,
    box-shadow 0.16s ease;
}

.nav-item:hover {
  background: #f5f8ff;
  color: var(--color-primary);
}

.nav-item.is-active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 8px 18px rgba(29, 78, 216, 0.2);
}

.nav-item__icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.nav-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-collapse {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  margin-top: auto;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-tertiary);
  font-size: 12px;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
}

.sidebar-collapse:hover {
  background: var(--color-bg-subtle);
  color: var(--color-primary);
}

.sidebar-collapse__icon {
  width: 18px;
  height: 18px;
}

.app-sidebar.is-collapsed .nav-item {
  justify-content: center;
  padding: 0;
}

.app-sidebar.is-collapsed .sidebar-collapse {
  justify-content: center;
  padding: 0;
}
</style>
