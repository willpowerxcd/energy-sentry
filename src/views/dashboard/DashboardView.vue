<template>
  <div class="dashboard">
    <div class="kpi-grid">
      <StatCard
        v-for="item in kpis"
        :key="item.key"
        :label="item.label"
        :value="item.value"
        :unit="item.unit"
        :tone="item.tone"
        :loading="loading"
      >
        <template #icon>
          <component :is="item.icon" />
        </template>
      </StatCard>
    </div>

    <ErrorState v-if="error" :message="error" @retry="dashboard.load" />

    <div class="dashboard-grid">
      <div class="dashboard-main">
        <AppCard
          class="chart-card"
          title="实际值 vs 预测值曲线"
          subtitle="异常点以圆点标注，单位为 kWh"
        >
          <template #extra>
            <SegmentedControl v-model="granularity" :options="granularityOptions" />
          </template>

          <div class="chart-legend">
            <span><i class="legend-line is-actual" />实际值 (kWh)</span>
            <span><i class="legend-line is-predicted" />预测值 (kWh)</span>
            <span><i class="legend-dot" />异常点</span>
          </div>

          <BaseChart :option="chartOption" height="340px" :loading="loading" />
        </AppCard>

        <AppCard class="mini-card" body-class="mini-body">
          <div class="mini-metrics">
            <MiniMetric
              v-for="item in miniMetrics"
              :key="item.label"
              class="mini-item"
              :label="item.label"
              :value="item.value"
              :unit="item.unit"
              :tone="item.tone"
            >
              <template #icon>
                <component :is="item.icon" />
              </template>
            </MiniMetric>
          </div>
        </AppCard>
      </div>

      <div class="dashboard-side">
        <AppCard
          class="ranking-card"
          title="楼栋能耗排行"
          subtitle="今日用电量 · 单位 kWh"
        >
          <BuildingRanking :items="ranking" @select="goBuilding" />
        </AppCard>

        <AppCard class="alarm-card" title="高风险告警列表">
          <template #extra>
            <el-button link type="primary" @click="goAlarms">查看全部</el-button>
          </template>
          <AlarmList :items="alarms" @select="openAlarm" />
        </AppCard>
      </div>
    </div>

    <AlarmDetailDrawer
      v-model="drawerVisible"
      :alarm-id="selectedAlarmId"
      @updated="onAlarmUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import IconBell from '~icons/lucide/bell'
import IconCloud from '~icons/lucide/cloud'
import IconTarget from '~icons/lucide/target'
import IconTrees from '~icons/lucide/trees'
import IconTrendingDown from '~icons/lucide/trending-down'
import IconTrendingUp from '~icons/lucide/trending-up'
import IconWallet from '~icons/lucide/wallet'
import IconZap from '~icons/lucide/zap'
import type { BuildingRankingItem, DashboardAlarm, Granularity } from '@/api/types/dashboard'
import { DASHBOARD_REFRESH_MS } from '@/config/constants'
import { useDashboardStore } from '@/stores/dashboard'
import { formatCarbon, formatMoney, formatNumber, formatPercent } from '@/utils/format'
import AppCard from '@/components/base/AppCard.vue'
import MiniMetric from '@/components/base/MiniMetric.vue'
import SegmentedControl from '@/components/base/SegmentedControl.vue'
import StatCard from '@/components/base/StatCard.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import AlarmList from '@/components/business/AlarmList.vue'
import AlarmDetailDrawer from '@/components/business/AlarmDetailDrawer.vue'
import BuildingRanking from '@/components/business/BuildingRanking.vue'

interface TooltipItem {
  seriesName?: string
  name?: string
  value?: number | [number, number]
}

const router = useRouter()
const dashboard = useDashboardStore()
const { summary, series, ranking, alarms, loading, error, granularity } = storeToRefs(dashboard)

const drawerVisible = ref(false)
const selectedAlarmId = ref<number>()

const granularityOptions: Array<{ label: string; value: Granularity }> = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]

const kpis = computed(() => [
  {
    key: 'energy',
    label: '今日用电',
    value: formatNumber(summary.value?.today_kwh),
    unit: 'kWh',
    tone: 'primary' as const,
    icon: IconZap,
  },
  {
    key: 'alarms',
    label: '异常告警',
    value: summary.value?.alarm_count ?? '—',
    unit: '条',
    tone: 'danger' as const,
    icon: IconBell,
  },
  {
    key: 'saving',
    label: '本月预计节省',
    value: formatMoney(summary.value?.estimated_saving_yuan),
    unit: '元',
    tone: 'warning' as const,
    icon: IconWallet,
  },
  {
    key: 'carbon',
    label: '本月碳减排',
    value: formatCarbon(summary.value?.carbon_reduced_t),
    unit: 'tCO₂',
    tone: 'success' as const,
    icon: IconCloud,
  },
])

const miniMetrics = computed(() => [
  {
    label: '环比昨日',
    value: formatPercent(summary.value?.day_over_day ?? 0, 1, true),
    unit: '',
    tone: 'danger' as const,
    icon: IconTrendingUp,
  },
  {
    label: '同比去年',
    value: formatPercent(summary.value?.year_over_year ?? 0, 1, true),
    unit: '',
    tone: 'success' as const,
    icon: IconTrendingDown,
  },
  {
    label: '能耗目标完成率',
    value: formatPercent(summary.value?.target_completion ?? 0, 0),
    unit: '',
    tone: 'primary' as const,
    icon: IconTarget,
  },
  {
    label: '本月等效植树',
    value: formatNumber(summary.value?.equivalent_trees ?? 0),
    unit: '棵',
    tone: 'success' as const,
    icon: IconTrees,
  },
])

const chartOption = computed<EChartsOption>(() => {
  const data = series.value
  const labels = data?.labels ?? []
  const actual = data?.actual ?? []
  const predicted = data?.predicted ?? []
  const anomalies = (data?.anomalies ?? []).map((item) => [item.index, item.value])

  return {
    animationDuration: 500,
    grid: { left: 44, right: 22, top: 18, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderWidth: 0,
      padding: [8, 10],
      textStyle: { color: '#fff', fontSize: 12 },
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#cbd5e1', type: 'dashed' },
      },
      formatter: (params: unknown) => {
        const list = (Array.isArray(params) ? params : [params]) as TooltipItem[]
        const name = list[0]?.name ?? ''
        const rows = list
          .filter((item) => item.seriesName !== '预测值' || item.value != null)
          .map((item) => {
            const raw = Array.isArray(item.value) ? item.value[1] : item.value
            const value = typeof raw === 'number' ? formatNumber(raw) : '—'
            return `<div style="display:flex;justify-content:space-between;gap:24px;line-height:20px;"><span>${item.seriesName ?? ''}</span><b>${value} kWh</b></div>`
          })
          .join('')
        return `<div style="margin-bottom:4px;color:#cbd5e1;">${name}</div>${rows}`
      },
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5eaf3' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 11, interval: 'auto' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eef2f8', type: 'dashed' } },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 11,
        formatter: (value: number) => formatNumber(value),
      },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: actual,
        smooth: 0.22,
        showSymbol: false,
        lineStyle: { width: 2, color: '#1d4ed8' },
        itemStyle: { color: '#1d4ed8' },
        areaStyle: { color: 'rgba(29, 78, 216, 0.04)' },
      },
      {
        name: '预测值',
        type: 'line',
        data: predicted,
        smooth: 0.22,
        showSymbol: false,
        lineStyle: { width: 2, type: 'dashed', color: '#60a5fa' },
        itemStyle: { color: '#60a5fa' },
      },
      {
        name: '异常点',
        type: 'scatter',
        data: anomalies,
        symbolSize: 9,
        itemStyle: { color: '#ef4444', borderColor: '#fff', borderWidth: 2 },
        z: 10,
      },
    ],
  }
})

const visibility = useDocumentVisibility()
const { pause, resume } = useIntervalFn(
  () => {
    if (visibility.value === 'visible') void dashboard.load()
  },
  DASHBOARD_REFRESH_MS,
  { immediate: false },
)

watch(
  [() => dashboard.date, () => dashboard.granularity],
  () => {
    void dashboard.load()
  },
)

onMounted(() => {
  void dashboard.load()
  resume()
})

onBeforeUnmount(() => {
  pause()
})

function goBuilding(item: BuildingRankingItem): void {
  void router.push(`/buildings/${item.building_id}`)
}

function goAlarms(): void {
  void router.push('/alarms')
}

function openAlarm(alarm: DashboardAlarm): void {
  selectedAlarmId.value = alarm.id
  drawerVisible.value = true
}

function onAlarmUpdated(): void {
  void dashboard.load()
}
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.85fr) minmax(320px, 1fr);
  align-items: start;
  gap: 20px;
}

.dashboard-main,
.dashboard-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.chart-card :deep(.app-card__body) {
  padding-top: 0;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-bottom: 8px;
  color: var(--color-text-muted);
  font-size: 12px;
}

.chart-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-line {
  display: inline-block;
  width: 18px;
  height: 2px;
  border-radius: 999px;
}

.legend-line.is-actual {
  background: #1d4ed8;
}

.legend-line.is-predicted {
  height: 0;
  border-top: 2px dashed #60a5fa;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}

.mini-card :deep(.mini-body) {
  padding: 14px 8px;
}

.mini-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.mini-item + .mini-item {
  border-left: 1px solid var(--color-border-light);
}

.ranking-card :deep(.app-card__body),
.alarm-card :deep(.app-card__body) {
  padding-top: 4px;
}

@media (max-width: 1280px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 760px) {
  .kpi-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .mini-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 12px;
  }

  .mini-item:nth-child(3) {
    border-left: 0;
  }
}
</style>
