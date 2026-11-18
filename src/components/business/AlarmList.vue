<template>
  <div class="alarm-list">
    <div class="alarm-list__head">
      <span />
      <span>时间</span>
      <span>楼栋</span>
      <span>类型</span>
      <span>状态</span>
    </div>
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      class="alarm-row"
      @click="$emit('select', item)"
    >
      <span class="alarm-row__icon" :style="{ color: levelColor(item.alarm_level) }">
        <IconAlert />
      </span>
      <span class="alarm-row__time num">{{ formatDateTime(item.alarm_time) }}</span>
      <span class="alarm-row__building">{{ item.building_name }}</span>
      <span class="alarm-row__type">{{ item.alarm_type }}</span>
      <StatusTag :status="item.status" />
    </button>
    <div v-if="!items.length" class="alarm-list__empty">暂无高风险告警</div>
  </div>
</template>

<script setup lang="ts">
import IconAlert from '~icons/lucide/triangle-alert'
import type { DashboardAlarm } from '@/api/types/dashboard'
import { ALARM_LEVEL_META } from '@/config/status'
import { formatDateTime } from '@/utils/format'
import StatusTag from '@/components/base/StatusTag.vue'

defineProps<{
  items: DashboardAlarm[]
}>()

defineEmits<{
  select: [item: DashboardAlarm]
}>()

function levelColor(level: DashboardAlarm['alarm_level']): string {
  return ALARM_LEVEL_META[level].color
}
</script>

<style scoped>
.alarm-list__head,
.alarm-row {
  display: grid;
  grid-template-columns: 18px 76px minmax(0, 1fr) minmax(0, 1fr) 58px;
  align-items: center;
  gap: 8px;
}

.alarm-list__head {
  padding: 0 4px 8px;
  color: var(--color-text-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.alarm-list__head span:last-child {
  text-align: center;
}

.alarm-row {
  width: 100%;
  padding: 9px 4px;
  border: 0;
  border-bottom: 1px solid var(--color-border-light);
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.16s ease;
}

.alarm-row:last-of-type {
  border-bottom: 0;
}

.alarm-row:hover {
  background: var(--color-bg-subtle);
}

.alarm-row__icon {
  display: grid;
  place-items: center;
}

.alarm-row__icon svg {
  width: 15px;
  height: 15px;
}

.alarm-row__time,
.alarm-row__building,
.alarm-row__type {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alarm-row__time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.alarm-row__building,
.alarm-row__type {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.alarm-row :deep(.status-tag) {
  justify-self: end;
  height: 22px;
  padding: 0 6px;
  font-size: 11px;
}

.alarm-list__empty {
  padding: 36px 0;
  color: var(--color-text-muted);
  font-size: 13px;
  text-align: center;
}
</style>
