<template>
  <header class="app-header" :class="{ 'is-collapsed': app.sidebarCollapsed }">
    <div class="app-header__brand">
      <img :src="logoMark" alt="能耗哨兵" class="app-header__logo" />
      <span v-if="!app.sidebarCollapsed" class="app-header__brand-name">能耗哨兵</span>
    </div>

    <div class="app-header__main">
      <h1 class="app-header__title">{{ headerTitle }}</h1>

      <div class="app-header__actions">
        <el-date-picker
          :model-value="dashboard.date"
          type="date"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          :clearable="false"
          class="header-date"
          @update:model-value="onDateChange"
        />

        <el-popover placement="bottom-end" :width="300" trigger="click">
          <template #reference>
            <button class="icon-button" type="button" aria-label="告警通知">
              <IconBell />
              <span v-if="alarmCount" class="icon-button__badge">
                {{ alarmCount > 99 ? '99+' : alarmCount }}
              </span>
            </button>
          </template>
          <div class="notice-popover">
            <div class="notice-popover__head">
              <b>最近告警</b>
              <span>{{ alarmCount }} 条待关注</span>
            </div>
            <button
              v-for="alarm in dashboard.alarms.slice(0, 3)"
              :key="alarm.id"
              type="button"
              class="notice-item"
              @click="openAlarm(alarm)"
            >
              <span class="notice-item__title">{{ alarm.building_name }} · {{ alarm.alarm_type }}</span>
              <span class="notice-item__meta">
                <span>{{ alarm.suggestion }}</span>
                <span class="num">{{ formatDateTime(alarm.alarm_time) }}</span>
              </span>
            </button>
            <div v-if="!dashboard.alarms.length" class="notice-empty">暂无告警</div>
            <el-button link type="primary" class="notice-more" @click="goAlarms">
              查看全部告警
            </el-button>
          </div>
        </el-popover>

        <button class="icon-button" type="button" aria-label="全屏" @click="toggleFullscreen">
          <IconMinimize v-if="isFullscreen" />
          <IconMaximize v-else />
        </button>

        <el-dropdown trigger="click">
          <button class="user-chip" type="button">
            <el-avatar :size="28">{{ avatarText }}</el-avatar>
            <span class="user-chip__name">{{ auth.user?.display_name || '未登录' }}</span>
            <IconChevronDown class="user-chip__chevron" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item disabled>{{ roleLabel }}</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">
                <IconLogOut class="dropdown-icon" />
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import dayjs from 'dayjs'
import IconBell from '~icons/lucide/bell'
import IconChevronDown from '~icons/lucide/chevron-down'
import IconLogOut from '~icons/lucide/log-out'
import IconMaximize from '~icons/lucide/maximize'
import IconMinimize from '~icons/lucide/minimize'
import logoMark from '@/assets/logo/logo-mark.svg'
import type { DashboardAlarm } from '@/api/types/dashboard'
import { ROLE_LABELS } from '@/config/permissions'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { formatDateTime } from '@/utils/format'

const app = useAppStore()
const auth = useAuthStore()
const dashboard = useDashboardStore()
const route = useRoute()
const router = useRouter()
const { isFullscreen, toggle } = useFullscreen()

const headerTitle = computed(() => route.meta.headerTitle || route.meta.title || '能耗哨兵')
const alarmCount = computed(() => dashboard.summary?.alarm_count ?? 0)
const roleLabel = computed(() => ROLE_LABELS[auth.roles[0]] ?? '访客')
const avatarText = computed(() => (auth.user?.display_name || '用').slice(0, 1))

function onDateChange(value: string | number | Date | null): void {
  if (!value) return
  dashboard.date = typeof value === 'string' ? value : dayjs(value).format('YYYY-MM-DD')
}

function toggleFullscreen(): void {
  void toggle()
}

function goAlarms(): void {
  void router.push('/alarms')
}

function openAlarm(alarm: DashboardAlarm): void {
  void router.push({ path: '/alarms', query: { alarm: String(alarm.id) } })
}

async function handleLogout(): Promise<void> {
  await auth.logout()
  await router.push('/login')
}
</script>

<style scoped>
.app-header {
  display: flex;
  flex: 0 0 var(--header-height);
  height: var(--header-height);
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border);
}

.app-header__brand {
  display: flex;
  flex: 0 0 var(--sidebar-w);
  align-items: center;
  gap: 10px;
  width: var(--sidebar-w);
  padding: 0 20px;
  border-right: 1px solid var(--color-border);
  transition: width 0.18s ease;
}

.app-header.is-collapsed .app-header__brand {
  justify-content: center;
  padding: 0;
}

.app-header__logo {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.app-header__brand-name {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.app-header__main {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;
  padding: 0 24px;
}

.app-header__title {
  overflow: hidden;
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.header-date {
  width: 138px;
}

.header-date :deep(.el-input__wrapper) {
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: none;
}

.header-date :deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-primary);
}

.icon-button {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
}

.icon-button:hover {
  background: #f5f8ff;
  color: var(--color-primary);
}

.icon-button svg {
  width: 18px;
  height: 18px;
}

.icon-button__badge {
  position: absolute;
  top: 1px;
  right: 1px;
  display: grid;
  place-items: center;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  border: 2px solid #fff;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.16s ease;
}

.user-chip:hover {
  background: var(--color-bg-subtle);
}

.user-chip__chevron {
  width: 14px;
  height: 14px;
  color: var(--color-text-tertiary);
}

.dropdown-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.notice-popover__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-light);
}

.notice-popover__head b {
  font-size: 13px;
  font-weight: 600;
}

.notice-popover__head span {
  font-size: 11px;
  color: var(--color-text-muted);
}

.notice-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  padding: 10px 0;
  border: 0;
  border-bottom: 1px solid var(--color-border-light);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.notice-item:hover {
  background: var(--color-bg-subtle);
}

.notice-item__title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.notice-item__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: var(--color-text-muted);
}

.notice-empty {
  padding: 20px 0;
  color: var(--color-text-muted);
  font-size: 12px;
  text-align: center;
}

.notice-more {
  width: 100%;
  margin-top: 8px;
}

@media (max-width: 960px) {
  .app-header__brand-name,
  .header-date,
  .user-chip__name {
    display: none;
  }

  .app-header__main {
    padding: 0 16px;
  }
}
</style>
