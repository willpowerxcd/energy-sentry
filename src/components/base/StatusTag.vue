<template>
  <span class="status-tag" :class="meta.className">{{ label || meta.label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AlarmStatus } from '@/api/types/alarm'
import type { ReportStatus } from '@/api/types/report'
import { ALARM_STATUS_META, REPORT_STATUS_META } from '@/config/status'

const props = withDefaults(
  defineProps<{
    status: AlarmStatus | ReportStatus | string
    label?: string
  }>(),
  { label: '' },
)

const meta = computed(() => {
  const alarm = ALARM_STATUS_META[props.status as AlarmStatus]
  if (alarm) return alarm
  const report = REPORT_STATUS_META[props.status as ReportStatus]
  if (report) return report
  return { label: props.status, className: 'is-neutral', color: '#64748b' }
})
</script>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border: 1px solid currentColor;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}

.is-danger {
  color: #dc2626;
  background: #fef2f2;
  border-color: #fecaca;
}

.is-warning {
  color: #d97706;
  background: #fffbeb;
  border-color: #fde68a;
}

.is-info {
  color: #2563eb;
  background: #eff6ff;
  border-color: #bfdbfe;
}

.is-success {
  color: #16a34a;
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.is-neutral {
  color: #64748b;
  background: #f8fafc;
  border-color: #e2e8f0;
}
</style>
