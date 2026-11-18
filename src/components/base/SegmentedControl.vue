<template>
  <div class="segmented-control" role="tablist">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="segmented-control__item"
      :class="{ 'is-active': option.value === modelValue }"
      role="tab"
      :aria-selected="option.value === modelValue"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
defineProps<{
  modelValue: T
  options: Array<{ label: string; value: T }>
}>()

defineEmits<{
  'update:modelValue': [value: T]
}>()
</script>

<style scoped>
.segmented-control {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.segmented-control__item {
  min-width: 38px;
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
}

.segmented-control__item:hover {
  color: var(--color-primary);
}

.segmented-control__item.is-active {
  background: var(--color-primary);
  color: #fff;
  box-shadow: 0 4px 10px rgba(29, 78, 216, 0.2);
}
</style>
