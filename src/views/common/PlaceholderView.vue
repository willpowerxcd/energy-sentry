<template>
  <div class="page">
    <PageHeader :title="title" subtitle="能耗哨兵 · 功能建设中" />
    <AppCard>
      <div class="placeholder">
        <div class="placeholder__icon">
          <IconConstruction />
        </div>
        <h2>{{ title }}页面规划已就绪</h2>
        <p>{{ description }}</p>
        <span class="placeholder__hint">当前为 M0 / M1 工程骨架，功能按里程碑逐步接入。</span>
      </div>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import IconConstruction from '~icons/lucide/construction'
import AppCard from '@/components/base/AppCard.vue'
import PageHeader from '@/components/base/PageHeader.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title ?? '页面'))
const description = computed(() => String(route.meta.description ?? '该页面正在建设中。'))
</script>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 420px;
  padding: 40px;
  text-align: center;
}

.placeholder__icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin-bottom: 8px;
  border-radius: 18px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: var(--color-primary);
}

.placeholder__icon svg {
  width: 30px;
  height: 30px;
}

.placeholder h2 {
  font-size: 18px;
  font-weight: 600;
}

.placeholder p {
  max-width: 520px;
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.9;
}

.placeholder__hint {
  margin-top: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 11px;
}
</style>
