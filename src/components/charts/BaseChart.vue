<template>
  <div ref="chartEl" class="base-chart" :style="{ height }" />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EChartsOption } from 'echarts'
import echarts from './echarts'

const props = withDefaults(
  defineProps<{
    option: EChartsOption
    height?: string
    loading?: boolean
    renderer?: 'canvas' | 'svg'
  }>(),
  {
    height: '320px',
    loading: false,
    renderer: 'canvas',
  },
)

const chartEl = ref<HTMLDivElement | null>(null)
let chart: ReturnType<typeof echarts.init> | null = null
let observer: ResizeObserver | null = null
let resizeTimer: number | null = null

function loadingConfig() {
  return {
    text: '',
    color: '#1d4ed8',
    maskColor: 'rgba(255, 255, 255, 0.35)',
  }
}

function scheduleResize(): void {
  if (resizeTimer) window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(() => chart?.resize(), 80)
}

onMounted(async () => {
  await nextTick()
  if (!chartEl.value) return

  chart = echarts.init(chartEl.value, undefined, { renderer: props.renderer })
  chart.setOption(props.option)
  if (props.loading) chart.showLoading('default', loadingConfig())

  observer = new ResizeObserver(scheduleResize)
  observer.observe(chartEl.value)
})

watch(
  () => props.option,
  (option) => {
    chart?.setOption(option, true)
  },
  { deep: true },
)

watch(
  () => props.loading,
  (loading) => {
    if (!chart) return
    if (loading) chart.showLoading('default', loadingConfig())
    else chart.hideLoading()
  },
)

onBeforeUnmount(() => {
  if (resizeTimer) window.clearTimeout(resizeTimer)
  observer?.disconnect()
  chart?.dispose()
  chart = null
})

defineExpose({ chart })
</script>

<style scoped>
.base-chart {
  width: 100%;
  min-width: 0;
}
</style>
