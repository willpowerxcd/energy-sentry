<template>
  <span class="risk-text" :style="{ color: meta.color }">
    <i class="risk-text__dot" />
    {{ label || meta.label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AlarmLevel } from '@/api/types/alarm'
import { ALARM_LEVEL_META } from '@/config/status'

const props = withDefaults(
  defineProps<{
    level: AlarmLevel
    label?: string
  }>(),
  { label: '' },
)

const meta = computed(() => ALARM_LEVEL_META[props.level] ?? ALARM_LEVEL_META.normal)
</script>

<style scoped>
.risk-text {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
}

.risk-text__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
</style>
