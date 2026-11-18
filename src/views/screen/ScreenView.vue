<template>
  <div class="screen">
    <div class="screen__grid" />

    <header class="screen-header">
      <div class="screen-brand">
        <img :src="logoMark" alt="" class="screen-brand__logo" />
        <div>
          <h1>园区能耗智慧监管中心</h1>
          <p>能耗哨兵 · ENERGY SENTINEL</p>
        </div>
      </div>

      <div class="screen-clock">
        <b class="num">{{ clock.time }}</b>
        <span>{{ clock.date }} {{ clock.weekday }}</span>
      </div>

      <button type="button" class="screen-exit" @click="router.push('/dashboard')">
        <IconArrowLeft />
        返回后台
      </button>
    </header>

    <main class="screen-body">
      <section class="screen-column">
        <div class="screen-panel">
          <div class="screen-panel__head">
            <h2>楼栋能耗排行</h2>
            <span>kWh</span>
          </div>
          <div class="screen-rank-list">
            <div
              v-for="(item, index) in ranking"
              :key="item.building_id"
              class="screen-rank"
            >
              <span class="screen-rank__index">0{{ index + 1 }}</span>
              <span class="screen-rank__name">{{ item.building_name }}</span>
              <span class="screen-rank__bar">
                <i :style="{ width: `${rankWidth(item.kwh)}%` }" />
              </span>
              <span class="screen-rank__value num">{{ formatNumber(item.kwh) }}</span>
            </div>
          </div>
        </div>

        <div class="screen-panel screen-panel--grow">
          <div class="screen-panel__head">
            <h2>能耗目标完成率</h2>
            <span>本月</span>
          </div>
          <div class="screen-ring-wrap">
            <div class="screen-ring" :style="{ '--progress': targetPercent }">
              <div class="screen-ring__inner">
                <b class="num">{{ targetPercent }}%</b>
                <span>目标完成</span>
              </div>
            </div>
            <div class="screen-ring-meta">
              <div><span>本月预计节省</span><b class="num">{{ formatMoney(summary?.estimated_saving_yuan) }} 元</b></div>
              <div><span>本月碳减排</span><b class="num">{{ formatCarbon(summary?.carbon_reduced_t) }} tCO₂</b></div>
            </div>
          </div>
          <div class="screen-measures">
            <div class="screen-measures__title">治理措施</div>
            <div v-for="item in measures" :key="item.label" class="screen-measure">
              <i class="screen-measure__dot" :class="`is-${item.tone}`" />
              <span>{{ item.label }}</span>
              <em :class="`is-${item.tone}`">{{ item.status }}</em>
            </div>
          </div>
        </div>
      </section>

      <section class="screen-column screen-column--center">
        <div class="screen-kpis">
          <div v-for="item in kpis" :key="item.label" class="screen-kpi">
            <span>{{ item.label }}</span>
            <div>
              <b class="num">{{ item.value }}</b>
              <em>{{ item.unit }}</em>
            </div>
          </div>
        </div>

        <div class="screen-panel screen-panel--chart">
          <div class="screen-panel__head">
            <h2>今日实际值 vs 预测值</h2>
            <div class="screen-legend">
              <span><i class="is-actual" />实际值</span>
              <span><i class="is-predicted" />预测值</span>
              <span><i class="is-anomaly" />异常点</span>
            </div>
          </div>
          <div class="screen-chart">
            <BaseChart :option="chartOption" height="100%" :loading="loading" />
          </div>
        </div>

        <div class="screen-panel screen-panel--strip">
          <div class="screen-strip-item">
            <span>异常告警</span>
            <b class="num tone-danger">{{ summary?.alarm_count ?? '—' }} 条</b>
          </div>
          <div class="screen-strip-item">
            <span>较昨日</span>
            <b class="num tone-danger">{{ formatPercent(summary?.day_over_day ?? 0, 1, true) }}</b>
          </div>
          <div class="screen-strip-item">
            <span>较去年</span>
            <b class="num tone-success">{{ formatPercent(summary?.year_over_year ?? 0, 1, true) }}</b>
          </div>
          <div class="screen-strip-item">
            <span>等效植树</span>
            <b class="num tone-success">{{ formatNumber(summary?.equivalent_trees ?? 0) }} 棵</b>
          </div>
        </div>
      </section>

      <section class="screen-column">
        <div class="screen-panel screen-panel--grow">
          <div class="screen-panel__head">
            <h2>高风险告警</h2>
            <span>实时</span>
          </div>
          <div class="screen-alarm-list">
            <div v-for="alarm in alarms.slice(0, 4)" :key="alarm.id" class="screen-alarm">
              <i class="screen-alarm__dot" :style="{ background: levelColor(alarm.alarm_level) }" />
              <div class="screen-alarm__main">
                <b>{{ alarm.building_name }} · {{ alarm.alarm_type }}</b>
                <p>{{ alarm.suggestion }}</p>
              </div>
              <span class="num">{{ formatDateTime(alarm.alarm_time) }}</span>
            </div>
          </div>
          <div class="screen-alarm-types">
            <div class="screen-alarm-types__title">类型分布</div>
            <div v-for="type in alarmTypes" :key="type.label" class="screen-type-row">
              <span>{{ type.label }}</span>
              <span class="screen-type-bar"><i :style="{ width: `${type.percent}%` }" /></span>
              <b class="num">{{ type.count }}</b>
            </div>
          </div>
        </div>

        <div class="screen-panel">
          <div class="screen-panel__head">
            <h2>设备在线率</h2>
            <span>今日</span>
          </div>
          <div class="screen-device">
            <div class="screen-device__value num">98.6<em>%</em></div>
            <div class="screen-device__bar"><i /></div>
            <div class="screen-device__meta">
              <span>在线 68</span>
              <span>离线 1</span>
              <span>异常 0</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="screen-footer">
      <span>数据每 30 秒刷新</span>
      <span>能耗哨兵 · 园区能耗异常诊断与节能优化平台</span>
      <span>M8 将接入完整大屏指标</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNow } from '@vueuse/core'
import dayjs from 'dayjs'
import type { EChartsOption } from 'echarts'
import IconArrowLeft from '~icons/lucide/arrow-left'
import logoMark from '@/assets/logo/logo-mark.svg'
import { ALARM_LEVEL_META } from '@/config/status'
import { useDashboardStore } from '@/stores/dashboard'
import { formatCarbon, formatDateTime, formatMoney, formatNumber, formatPercent } from '@/utils/format'
import BaseChart from '@/components/charts/BaseChart.vue'

const router = useRouter()
const dashboard = useDashboardStore()
const now = useNow({ interval: 1000 })

const summary = computed(() => dashboard.summary)
const ranking = computed(() => dashboard.ranking)
const alarms = computed(() => dashboard.alarms)
const loading = computed(() => dashboard.loading)

const clock = computed(() => {
  const value = dayjs(now.value)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return {
    time: value.format('HH:mm:ss'),
    date: value.format('YYYY-MM-DD'),
    weekday: weekdays[value.day()],
  }
})

const targetPercent = computed(() => Math.round((summary.value?.target_completion ?? 0) * 100))

const kpis = computed(() => [
  { label: '今日用电', value: formatNumber(summary.value?.today_kwh), unit: 'kWh' },
  { label: '异常告警', value: summary.value?.alarm_count ?? '—', unit: '条' },
  { label: '本月节省', value: formatMoney(summary.value?.estimated_saving_yuan), unit: '元' },
  { label: '碳减排', value: formatCarbon(summary.value?.carbon_reduced_t), unit: 'tCO₂' },
])

const alarmTypes = [
  { label: '夜间空耗', count: 6, percent: 72 },
  { label: '设备离线', count: 4, percent: 48 },
  { label: '能耗突增', count: 5, percent: 60 },
  { label: '数据缺失', count: 3, percent: 36 },
]

const measures = [
  { label: '空调定时优化', status: '进行中', tone: 'warning' },
  { label: '照明分区控制', status: '待开始', tone: 'muted' },
  { label: '冷源策略调整', status: '已完成', tone: 'success' },
]

const maxKwh = computed(() => Math.max(...ranking.value.map((item) => item.kwh), 1))

function rankWidth(value: number): number {
  return Math.max(10, Math.round((value / maxKwh.value) * 100))
}

function levelColor(level: string): string {
  return ALARM_LEVEL_META[level as keyof typeof ALARM_LEVEL_META]?.color ?? '#38bdf8'
}

const chartOption = computed<EChartsOption>(() => {
  const data = dashboard.series
  const anomalies = (data?.anomalies ?? []).map((item) => [item.index, item.value])

  return {
    backgroundColor: 'transparent',
    grid: { left: 42, right: 18, top: 24, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 15, 32, 0.94)',
      borderColor: 'rgba(56, 189, 248, 0.35)',
      textStyle: { color: '#e2e8f0', fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      data: data?.labels ?? [],
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.25)' } },
      axisTick: { show: false },
      axisLabel: { color: '#7c93b4', fontSize: 11, interval: 'auto' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.12)', type: 'dashed' } },
      axisLabel: { color: '#7c93b4', fontSize: 11 },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: data?.actual ?? [],
        smooth: 0.25,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: '#38bdf8',
          shadowColor: 'rgba(56, 189, 248, 0.45)',
          shadowBlur: 10,
        },
        itemStyle: { color: '#38bdf8' },
        areaStyle: { color: 'rgba(56, 189, 248, 0.12)' },
      },
      {
        name: '预测值',
        type: 'line',
        data: data?.predicted ?? [],
        smooth: 0.25,
        showSymbol: false,
        lineStyle: { width: 1.5, type: 'dashed', color: '#818cf8' },
        itemStyle: { color: '#818cf8' },
      },
      {
        name: '异常点',
        type: 'scatter',
        data: anomalies,
        symbolSize: 8,
        itemStyle: { color: '#f87171', borderColor: '#061225', borderWidth: 2 },
        z: 10,
      },
    ],
  }
})

onMounted(() => {
  void dashboard.load()
})
</script>

<style scoped>
.screen {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 100vh;
  padding: 20px 26px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 0%, rgba(29, 78, 216, 0.28), transparent 46%),
    #061225;
  color: var(--screen-text);
}

.screen__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(56, 189, 248, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.045) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: linear-gradient(to bottom, black, transparent 90%);
  pointer-events: none;
}

.screen-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 56px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(56, 189, 248, 0.18);
}

.screen-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.screen-brand__logo {
  width: 34px;
  height: 34px;
}

.screen-brand h1 {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.screen-brand p {
  margin-top: 2px;
  color: var(--screen-muted);
  font-size: 10px;
  letter-spacing: 0.18em;
}

.screen-clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.screen-clock b {
  color: #e0f2fe;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.screen-clock span {
  color: var(--screen-muted);
  font-size: 11px;
}

.screen-exit {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: 8px;
  background: rgba(8, 30, 60, 0.6);
  color: #bae6fd;
  font-size: 12px;
  cursor: pointer;
}

.screen-exit svg {
  width: 14px;
  height: 14px;
}

.screen-exit:hover {
  background: rgba(56, 189, 248, 0.12);
}

.screen-body {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(240px, 0.85fr) minmax(0, 2fr) minmax(280px, 1fr);
  gap: 18px;
  flex: 1;
  min-height: 0;
}

.screen-column {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

.screen-panel {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--screen-border);
  border-radius: 10px;
  background: var(--screen-panel);
  box-shadow:
    inset 0 0 30px rgba(56, 189, 248, 0.04),
    0 12px 40px rgba(0, 0, 0, 0.18);
}

.screen-panel--grow {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.screen-panel--chart {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.screen-chart {
  flex: 1;
  min-height: 320px;
}

.screen-panel--strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.screen-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.screen-panel__head h2 {
  position: relative;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.screen-panel__head h2::before {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(#38bdf8, #1d4ed8);
  content: '';
}

.screen-panel__head > span {
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-rank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.screen-rank {
  display: grid;
  grid-template-columns: 20px 62px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 8px;
}

.screen-rank__index {
  color: #38bdf8;
  font-family: var(--font-num);
  font-size: 11px;
}

.screen-rank__name {
  overflow: hidden;
  color: #cbd5e1;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.screen-rank__bar {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
}

.screen-rank__bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1d4ed8, #38bdf8);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.55);
  transition: width 0.6s ease;
}

.screen-rank__value {
  color: #e0f2fe;
  font-size: 12px;
  text-align: right;
}

.screen-ring-wrap {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 8px 0 4px;
}

.screen-ring {
  --progress: 0;
  display: grid;
  place-items: center;
  flex: 0 0 112px;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: conic-gradient(#38bdf8 calc(var(--progress) * 1%), rgba(148, 163, 184, 0.12) 0);
  box-shadow: 0 0 24px rgba(56, 189, 248, 0.18);
}

.screen-ring__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #071a33;
}

.screen-ring__inner b {
  color: #e0f2fe;
  font-size: 24px;
  font-weight: 600;
}

.screen-ring__inner span {
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-ring-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.screen-ring-meta div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.screen-ring-meta span {
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-ring-meta b {
  color: #bae6fd;
  font-size: 14px;
}

.screen-measures {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.screen-measures__title {
  margin-bottom: 8px;
  color: var(--screen-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.screen-measure {
  display: grid;
  grid-template-columns: 6px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  color: #cbd5e1;
  font-size: 11px;
}

.screen-measure__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #475569;
}

.screen-measure__dot.is-warning {
  background: #f59e0b;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
}

.screen-measure__dot.is-success {
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74, 222, 128, 0.6);
}

.screen-measure__dot.is-muted {
  background: #475569;
}

.screen-measure em {
  font-size: 10px;
  font-style: normal;
  color: #64748b;
}

.screen-measure em.is-warning {
  color: #fbbf24;
}

.screen-measure em.is-success {
  color: #4ade80;
}

.screen-measure em.is-muted {
  color: #64748b;
}

.screen-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.screen-kpi {
  padding: 12px 14px;
  border: 1px solid rgba(56, 189, 248, 0.18);
  border-radius: 9px;
  background: linear-gradient(180deg, rgba(12, 42, 82, 0.7), rgba(7, 26, 51, 0.4));
}

.screen-kpi > span {
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-kpi div {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
}

.screen-kpi b {
  color: #f0f9ff;
  font-size: 24px;
  font-weight: 600;
}

.screen-kpi em {
  color: var(--screen-muted);
  font-size: 10px;
  font-style: normal;
}

.screen-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.screen-legend i {
  display: inline-block;
  width: 14px;
  height: 2px;
  border-radius: 999px;
}

.screen-legend .is-actual {
  background: #38bdf8;
}

.screen-legend .is-predicted {
  border-top: 2px dashed #818cf8;
}

.screen-legend .is-anomaly {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f87171;
}

.screen-strip-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-left: 12px;
  border-left: 1px solid rgba(56, 189, 248, 0.16);
}

.screen-strip-item:first-child {
  padding-left: 0;
  border-left: 0;
}

.screen-strip-item span {
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-strip-item b {
  font-size: 16px;
  font-weight: 600;
}

.tone-danger {
  color: #f87171;
}

.tone-success {
  color: #4ade80;
}

.screen-alarm-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.screen-alarm {
  display: grid;
  grid-template-columns: 7px minmax(0, 1fr) auto;
  gap: 9px;
  align-items: start;
  padding-bottom: 11px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.screen-alarm:last-child {
  border-bottom: 0;
}

.screen-alarm__dot {
  width: 7px;
  height: 7px;
  margin-top: 5px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
}

.screen-alarm__main b {
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 500;
}

.screen-alarm__main p {
  margin-top: 2px;
  color: var(--screen-muted);
  font-size: 10px;
  line-height: 1.6;
}

.screen-alarm > span {
  color: #64748b;
  font-size: 10px;
  white-space: nowrap;
}

.screen-alarm-types {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.screen-alarm-types__title {
  margin-bottom: 8px;
  color: var(--screen-muted);
  font-size: 10px;
  letter-spacing: 0.08em;
}

.screen-type-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  color: #94a3b8;
  font-size: 10px;
}

.screen-type-bar {
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
}

.screen-type-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1d4ed8, #38bdf8);
}

.screen-type-row b {
  color: #bae6fd;
  font-size: 10px;
  text-align: right;
}

.screen-device {
  padding: 6px 0 2px;
}

.screen-device__value {
  color: #e0f2fe;
  font-size: 34px;
  font-weight: 600;
}

.screen-device__value em {
  margin-left: 2px;
  color: var(--screen-muted);
  font-size: 12px;
  font-style: normal;
}

.screen-device__bar {
  height: 6px;
  margin: 10px 0;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
}

.screen-device__bar i {
  display: block;
  width: 98.6%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1d4ed8, #38bdf8);
}

.screen-device__meta {
  display: flex;
  justify-content: space-between;
  color: var(--screen-muted);
  font-size: 10px;
}

.screen-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(56, 189, 248, 0.16);
  color: #526b8c;
  font-size: 10px;
}

@media (max-width: 1280px) {
  .screen-body {
    grid-template-columns: 1fr 1.8fr 1fr;
  }

  .screen-kpi b {
    font-size: 20px;
  }
}
</style>
