<template>
  <el-drawer
    :model-value="modelValue"
    title="告警详情"
    size="560px"
    direction="rtl"
    @update:model-value="handleVisibleChange"
  >
    <div v-if="loading" class="drawer-loading">
      <el-skeleton :rows="8" animated />
    </div>

    <div v-else-if="detail" class="alarm-detail">
      <div class="alarm-detail__hero">
        <div>
          <div class="alarm-detail__eyebrow">
            {{ detail.building_name }} · {{ detail.alarm_type }}
          </div>
          <div class="alarm-detail__title">{{ detail.suggestion }}</div>
          <div class="alarm-detail__tags">
            <RiskText :level="detail.alarm_level" />
            <StatusTag :status="detail.status" />
          </div>
        </div>
        <div class="alarm-detail__time">
          <span>发生时间</span>
          <b class="num">{{ formatDateTime(detail.alarm_time) }}</b>
        </div>
      </div>

      <section class="detail-section">
        <h3>异常事实</h3>
        <div class="fact-grid">
          <div>
            <span>实际值</span>
            <b class="num">{{ formatNumber(detail.actual_value) }} kWh</b>
          </div>
          <div>
            <span>预测值</span>
            <b class="num">{{ formatNumber(detail.predicted_value) }} kWh</b>
          </div>
          <div>
            <span>偏差率</span>
            <b class="num tone-danger">{{ formatPercent(detail.residual_rate) }}</b>
          </div>
          <div>
            <span>浪费电量</span>
            <b class="num">{{ formatNumber(detail.loss.energy_kwh) }} kWh</b>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3>异常时段曲线</h3>
        <BaseChart :option="miniOption" height="170px" />
      </section>

      <section class="detail-section">
        <h3>三视图异常分数</h3>
        <div class="score-list">
          <div v-for="score in scores" :key="score.key" class="score-row">
            <span class="score-row__label">{{ score.label }}</span>
            <el-progress
              :percentage="Math.round(score.value * 100)"
              :show-text="false"
              :stroke-width="8"
              :color="score.color"
            />
            <span class="score-row__value num">{{ Math.round(score.value * 100) }}%</span>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3>可能原因</h3>
        <div class="cause-list">
          <div
            v-for="(cause, index) in detail.possible_causes"
            :key="cause.cause"
            class="cause-item"
          >
            <div class="cause-item__top">
              <span class="cause-item__index">0{{ index + 1 }}</span>
              <span class="cause-item__name">{{ cause.cause }}</span>
              <span class="cause-item__confidence num">
                {{ Math.round(cause.confidence * 100) }}%
              </span>
            </div>
            <p>{{ cause.check }}</p>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3>损失核算</h3>
        <div class="loss-grid">
          <div class="loss-card">
            <span>浪费电量</span>
            <b class="num">{{ formatNumber(detail.loss.energy_kwh) }}</b>
            <em>kWh</em>
          </div>
          <div class="loss-card">
            <span>浪费电费</span>
            <b class="num">{{ formatNumber(detail.loss.money_yuan) }}</b>
            <em>元</em>
          </div>
          <div class="loss-card">
            <span>碳排放</span>
            <b class="num">{{ formatNumber(detail.loss.carbon_kg, 1) }}</b>
            <em>kg</em>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <h3>处置记录</h3>
        <el-timeline>
          <el-timeline-item :timestamp="formatDateTime(detail.alarm_time)" placement="top">
            系统根据预测残差生成告警
          </el-timeline-item>
          <el-timeline-item
            v-if="detail.handle_time"
            :timestamp="formatDateTime(detail.handle_time)"
            placement="top"
          >
            {{ detail.handler || '运维人员' }} 已处理
          </el-timeline-item>
          <el-timeline-item
            :timestamp="detail.status === 'resolved' ? '已闭环' : '待处理'"
            placement="top"
            :color="detail.status === 'pending' ? '#dc2626' : '#cbd5e1'"
          >
            {{ detail.status === 'resolved' ? '告警已闭环' : '等待责任人接单' }}
          </el-timeline-item>
        </el-timeline>
      </section>

      <div class="drawer-actions">
        <el-button
          v-if="detail.status === 'pending'"
          type="primary"
          @click="changeStatus('processing')"
        >
          接单处理
        </el-button>
        <el-button
          v-if="detail.status === 'processing'"
          type="primary"
          @click="changeStatus('resolved')"
        >
          闭环归档
        </el-button>
        <el-button v-if="detail.status === 'processing'" @click="changeStatus('resolved')">
          标记误报
        </el-button>
        <el-button v-if="detail.status === 'resolved'" disabled>已闭环</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { EChartsOption } from 'echarts'
import type { AlarmDetail, AlarmStatus } from '@/api/types/alarm'
import { getAlarmDetail, updateAlarm } from '@/api/modules/alarms'
import BaseChart from '@/components/charts/BaseChart.vue'
import RiskText from '@/components/base/RiskText.vue'
import StatusTag from '@/components/base/StatusTag.vue'
import { formatDateTime, formatNumber, formatPercent } from '@/utils/format'

const props = defineProps<{
  modelValue: boolean
  alarmId?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  updated: []
}>()

const detail = ref<AlarmDetail | null>(null)
const loading = ref(false)

const scores = computed(() => {
  if (!detail.value) return []
  return [
    {
      key: 'local',
      label: '局部视图',
      value: detail.value.three_view_scores.local,
      color: '#1d4ed8',
    },
    {
      key: 'global',
      label: '全局视图',
      value: detail.value.three_view_scores.global,
      color: '#60a5fa',
    },
    {
      key: 'external',
      label: '外部视图',
      value: detail.value.three_view_scores.external,
      color: '#38bdf8',
    },
  ]
})

const miniOption = computed<EChartsOption>(() => {
  const predicted = detail.value?.predicted_value ?? 0
  const actual = detail.value?.actual_value ?? 0
  const labels = ['-3h', '-2h', '-1h', '告警', '+1h', '+2h', '+3h']
  const predictedSeries = labels.map(() => predicted)
  const actualSeries = [
    predicted * 0.92,
    predicted * 0.96,
    predicted * 1.02,
    actual,
    predicted * 1.05,
    predicted * 0.98,
    predicted * 0.94,
  ].map((value) => Math.round(value))

  return {
    grid: { left: 36, right: 12, top: 16, bottom: 24 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#e5eaf3' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#eef2f8', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        name: '实际值',
        type: 'line',
        data: actualSeries,
        smooth: 0.25,
        symbolSize: 5,
        lineStyle: { width: 2, color: '#1d4ed8' },
        itemStyle: { color: '#1d4ed8' },
        areaStyle: { color: 'rgba(29, 78, 216, 0.05)' },
      },
      {
        name: '预测值',
        type: 'line',
        data: predictedSeries,
        smooth: 0.25,
        symbol: 'none',
        lineStyle: { width: 2, type: 'dashed', color: '#60a5fa' },
      },
    ],
  }
})

watch(
  () => [props.modelValue, props.alarmId] as const,
  ([visible]) => {
    if (visible && props.alarmId) void load()
  },
  { immediate: true },
)

async function load(): Promise<void> {
  if (!props.alarmId) return
  loading.value = true
  try {
    detail.value = await getAlarmDetail(props.alarmId)
  } catch {
    detail.value = null
  } finally {
    loading.value = false
  }
}

async function changeStatus(status: AlarmStatus): Promise<void> {
  if (!detail.value) return
  try {
    detail.value = await updateAlarm(detail.value.id, { status })
    ElMessage.success('告警状态已更新')
    emit('updated')
  } catch {
    // The request layer already shows an error message.
  }
}

function handleVisibleChange(value: boolean): void {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.drawer-loading {
  padding: 8px 0;
}

.alarm-detail {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.alarm-detail__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  background: linear-gradient(135deg, #eff6ff, #f8fbff);
  border: 1px solid var(--color-primary-border);
  border-radius: 12px;
}

.alarm-detail__eyebrow {
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.alarm-detail__title {
  max-width: 320px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.alarm-detail__tags {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.alarm-detail__time {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: right;
}

.alarm-detail__time b {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.detail-section h3 {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
}

.fact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.fact-grid > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 14px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
}

.fact-grid span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.fact-grid b {
  font-size: 15px;
  font-weight: 600;
}

.tone-danger {
  color: var(--color-danger);
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.score-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr) 48px;
  align-items: center;
  gap: 12px;
}

.score-row__label {
  font-size: 12px;
  color: var(--color-text-muted);
}

.score-row__value {
  font-size: 12px;
  font-weight: 600;
  text-align: right;
}

.cause-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cause-item {
  padding: 12px 14px;
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
}

.cause-item__top {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cause-item__index {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 600;
}

.cause-item__name {
  flex: 1;
  font-size: 13px;
  font-weight: 500;
}

.cause-item__confidence {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
}

.cause-item p {
  margin-top: 6px;
  padding-left: 30px;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-text-muted);
}

.loss-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.loss-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
}

.loss-card span {
  font-size: 12px;
  color: var(--color-text-muted);
}

.loss-card b {
  font-size: 18px;
  font-weight: 600;
}

.loss-card em {
  font-size: 11px;
  color: var(--color-text-tertiary);
  font-style: normal;
}

.drawer-actions {
  display: flex;
  gap: 10px;
  padding-top: 4px;
}
</style>
