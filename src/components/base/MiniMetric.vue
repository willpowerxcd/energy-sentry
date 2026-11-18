<template>
  <div class="mini-metric">
    <div class="mini-metric__icon">
      <slot name="icon" />
    </div>
    <div class="mini-metric__content">
      <div class="mini-metric__label">{{ label }}</div>
      <div class="mini-metric__value-row">
        <span class="mini-metric__value num" :class="`tone-${tone}`">{{ value }}</span>
        <span v-if="unit" class="mini-metric__unit">{{ unit }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    unit?: string
    tone?: 'primary' | 'danger' | 'warning' | 'success'
  }>(),
  {
    unit: '',
    tone: 'primary',
  },
)
</script>

<style scoped>
.mini-metric {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 2px 18px;
}

.mini-metric__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.mini-metric__icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.mini-metric__label {
  font-size: 12px;
  line-height: 18px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.mini-metric__value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.mini-metric__value {
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  color: var(--color-text-primary);
}

.mini-metric__unit {
  font-size: 12px;
  color: var(--color-text-muted);
}

.tone-primary {
  color: var(--color-primary);
}

.tone-danger {
  color: var(--color-danger);
}

.tone-warning {
  color: var(--color-warning);
}

.tone-success {
  color: var(--color-success);
}
</style>
