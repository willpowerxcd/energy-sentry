<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <slot name="icon" />
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="description" class="empty-state__description">{{ description }}</p>
    <div v-if="$slots.action" class="empty-state__action">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  { description: '' },
)
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 180px;
  padding: 24px;
  text-align: center;
}

.empty-state__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  border-radius: 50%;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.empty-state__icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.empty-state__title {
  font-size: 14px;
  font-weight: 600;
}

.empty-state__description {
  max-width: 320px;
  font-size: 12px;
  line-height: 20px;
  color: var(--color-text-muted);
}

.empty-state__action {
  margin-top: 8px;
}
</style>
