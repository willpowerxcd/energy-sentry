<template>
  <section class="app-card" :class="{ 'app-card--flat': flat }">
    <header v-if="title || subtitle || $slots.extra" class="app-card__header">
      <div class="app-card__heading">
        <h2 v-if="title" class="app-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="app-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.extra" class="app-card__extra">
        <slot name="extra" />
      </div>
    </header>
    <div class="app-card__body" :class="bodyClass">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    flat?: boolean
    bodyClass?: string
  }>(),
  {
    title: '',
    subtitle: '',
    flat: false,
    bodyClass: '',
  },
)
</script>

<style scoped>
.app-card {
  min-width: 0;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.app-card--flat {
  box-shadow: none;
}

.app-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px 12px;
}

.app-card__title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.01em;
  color: var(--color-text-primary);
}

.app-card__subtitle {
  margin-top: 2px;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-text-muted);
}

.app-card__extra {
  flex-shrink: 0;
}

.app-card__body {
  padding: 0 20px 20px;
}
</style>
