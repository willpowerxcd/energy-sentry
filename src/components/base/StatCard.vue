<template>
  <div class="stat-card" :class="[`tone-${tone}`, { 'is-loading': loading }]">
    <div class="stat-card__icon">
      <slot name="icon" />
    </div>
    <div class="stat-card__content">
      <div class="stat-card__label">{{ label }}</div>
      <div class="stat-card__value-row">
        <span class="stat-card__value num">{{ value }}</span>
        <span v-if="unit" class="stat-card__unit">{{ unit }}</span>
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
    loading?: boolean
  }>(),
  {
    unit: '',
    tone: 'primary',
    loading: false,
  },
)
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 104px;
  padding: 20px 22px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

.stat-card:hover {
  border-color: var(--color-primary-border);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.stat-card__icon {
  display: grid;
  place-items: center;
  flex: 0 0 52px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.stat-card__icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.stat-card.tone-danger .stat-card__icon {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.stat-card.tone-warning .stat-card__icon {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.stat-card.tone-success .stat-card__icon {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.stat-card__content {
  min-width: 0;
}

.stat-card__label {
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 22px;
  color: var(--color-text-secondary);
}

.stat-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
}

.stat-card__value {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.stat-card__unit {
  font-size: 13px;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.stat-card.is-loading .stat-card__value,
.stat-card.is-loading .stat-card__unit {
  opacity: 0.35;
}
</style>
