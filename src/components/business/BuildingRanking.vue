<template>
  <div v-if="items.length" class="ranking-list">
    <button
      v-for="item in items"
      :key="item.building_id"
      type="button"
      class="ranking-row"
      @click="$emit('select', item)"
    >
      <span class="ranking-row__icon">
        <IconBuilding />
      </span>
      <span class="ranking-row__name">{{ item.building_name }}</span>
      <span class="ranking-row__bar">
        <span class="ranking-row__fill" :style="{ width: `${widthFor(item)}%` }" />
      </span>
      <span class="ranking-row__value num">{{ formatNumber(item.kwh) }}</span>
    </button>
  </div>
  <div v-else class="ranking-empty">暂无楼栋数据</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconBuilding from '~icons/lucide/building-2'
import type { BuildingRankingItem } from '@/api/types/dashboard'
import { formatNumber } from '@/utils/format'

const props = defineProps<{
  items: BuildingRankingItem[]
}>()

defineEmits<{
  select: [item: BuildingRankingItem]
}>()

const maxValue = computed(() => Math.max(...props.items.map((item) => item.kwh), 1))

function widthFor(item: BuildingRankingItem): number {
  return Math.max(8, Math.round((item.kwh / maxValue.value) * 100))
}
</script>

<style scoped>
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ranking-row {
  display: grid;
  grid-template-columns: 26px 84px minmax(0, 1fr) 58px;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.16s ease;
}

.ranking-row:hover {
  background: var(--color-bg-subtle);
}

.ranking-row__icon {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.ranking-row__icon svg {
  width: 15px;
  height: 15px;
}

.ranking-row__name {
  overflow: hidden;
  font-size: 13px;
  color: var(--color-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ranking-row__bar {
  height: 8px;
  overflow: hidden;
  background: var(--color-border-light);
  border-radius: 999px;
}

.ranking-row__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #93c5fd, #3b82f6);
  transition: width 0.35s ease;
}

.ranking-row__value {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: right;
}

.ranking-empty {
  padding: 36px 0;
  color: var(--color-text-muted);
  font-size: 13px;
  text-align: center;
}
</style>
