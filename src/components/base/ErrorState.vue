<template>
  <div class="error-state">
    <div class="error-state__icon">
      <IconAlertTriangle />
    </div>
    <div class="error-state__content">
      <h3 class="error-state__title">数据加载失败</h3>
      <p class="error-state__message">{{ message }}</p>
    </div>
    <el-button size="small" @click="$emit('retry')">重新加载</el-button>
  </div>
</template>

<script setup lang="ts">
import IconAlertTriangle from '~icons/lucide/triangle-alert'

withDefaults(
  defineProps<{
    message?: string
  }>(),
  { message: '请检查网络或后端服务是否可用。' },
)

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--color-danger-bg);
  border: 1px solid #fecaca;
  border-radius: var(--radius-card);
}

.error-state__icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fff;
  color: var(--color-danger);
}

.error-state__icon svg {
  width: 18px;
  height: 18px;
}

.error-state__content {
  flex: 1;
  min-width: 0;
}

.error-state__title {
  font-size: 13px;
  font-weight: 600;
  color: #991b1b;
}

.error-state__message {
  font-size: 12px;
  line-height: 18px;
  color: #b91c1c;
}
</style>
