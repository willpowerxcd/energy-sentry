<template>
  <div class="page ui-kit">
    <p class="ui-kit__intro">设计 token 与基础组件验收页 · 仅开发环境可见</p>

    <div class="ui-grid">
      <AppCard title="颜色 Token" subtitle="页面与图表统一引用 CSS 变量">
        <div class="swatch-grid">
          <div v-for="color in colors" :key="color.name" class="swatch-item">
            <span class="swatch" :style="{ background: color.value }" />
            <div>
              <b>{{ color.name }}</b>
              <code>{{ color.value }}</code>
            </div>
          </div>
        </div>
      </AppCard>

      <AppCard title="字体与数字" subtitle="Inter 正文 + Barlow 数字">
        <div class="type-samples">
          <div class="type-sample">
            <span class="type-sample__label">页面标题 20/28</span>
            <b class="type-sample__title">园区能耗总览</b>
          </div>
          <div class="type-sample">
            <span class="type-sample__label">卡片标题 16/24</span>
            <b class="type-sample__card-title">实际值 vs 预测值曲线</b>
          </div>
          <div class="type-sample">
            <span class="type-sample__label">正文 14/22</span>
            <p>通过正常用能基线识别异常，并把异常翻译成可执行的处理建议。</p>
          </div>
          <div class="type-sample">
            <span class="type-sample__label">KPI 数字 32/40</span>
            <b class="type-sample__number num">12,860 <em>kWh</em></b>
          </div>
        </div>
      </AppCard>

      <AppCard title="按钮与表单">
        <div class="row">
          <el-button type="primary">主要按钮</el-button>
          <el-button>次要按钮</el-button>
          <el-button type="danger" plain>危险操作</el-button>
          <el-button link type="primary">文字按钮</el-button>
        </div>
        <div class="form-sample">
          <el-input placeholder="请输入楼栋名称" />
          <el-select placeholder="选择楼栋类型">
            <el-option label="实验楼" value="lab" />
            <el-option label="宿舍楼" value="dorm" />
            <el-option label="图书馆" value="library" />
          </el-select>
          <el-date-picker type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
        </div>
      </AppCard>

      <AppCard title="状态标签与风险">
        <div class="row">
          <StatusTag status="pending" />
          <StatusTag status="processing" />
          <StatusTag status="resolved" />
        </div>
        <div class="row">
          <RiskText level="severe" />
          <RiskText level="warning" />
          <RiskText level="attention" />
          <RiskText level="normal" />
        </div>
        <div class="row">
          <el-tag type="danger" effect="light">严重</el-tag>
          <el-tag type="warning" effect="light">预警</el-tag>
          <el-tag type="primary" effect="light">关注</el-tag>
          <el-tag type="success" effect="light">正常</el-tag>
        </div>
      </AppCard>
    </div>

    <div class="kpi-grid">
      <StatCard label="今日用电" value="12,860" unit="kWh">
        <template #icon><IconZap /></template>
      </StatCard>
      <StatCard label="异常告警" value="18" unit="条" tone="danger">
        <template #icon><IconBell /></template>
      </StatCard>
      <StatCard label="本月预计节省" value="3.6万" unit="元" tone="warning">
        <template #icon><IconWallet /></template>
      </StatCard>
      <StatCard label="本月碳减排" value="21.3" unit="tCO₂" tone="success">
        <template #icon><IconCloud /></template>
      </StatCard>
    </div>

    <AppCard title="图表" subtitle="BaseChart 封装：ECharts 按需注册、自适应、可切换主题">
      <BaseChart :option="chartOption" height="280px" />
    </AppCard>

    <AppCard title="表格" subtitle="Element Plus 表格统一覆盖表头、行高与状态色">
      <el-table :data="rows">
        <el-table-column prop="time" label="时间" width="150" />
        <el-table-column prop="building" label="楼栋" width="140" />
        <el-table-column prop="type" label="异常类型" />
        <el-table-column label="风险" width="100">
          <template #default="{ row }">
            <RiskText :level="row.level" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
      </el-table>
    </AppCard>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import IconBell from '~icons/lucide/bell'
import IconCloud from '~icons/lucide/cloud'
import IconWallet from '~icons/lucide/wallet'
import IconZap from '~icons/lucide/zap'
import type { AlarmLevel, AlarmStatus } from '@/api/types/alarm'
import AppCard from '@/components/base/AppCard.vue'
import RiskText from '@/components/base/RiskText.vue'
import StatCard from '@/components/base/StatCard.vue'
import StatusTag from '@/components/base/StatusTag.vue'
import BaseChart from '@/components/charts/BaseChart.vue'

const colors = [
  { name: 'Primary', value: '#1D4ED8' },
  { name: 'Primary Soft', value: '#EFF6FF' },
  { name: 'Page BG', value: '#F6F8FC' },
  { name: 'Text Primary', value: '#0F172A' },
  { name: 'Danger', value: '#DC2626' },
  { name: 'Warning', value: '#D97706' },
  { name: 'Success', value: '#16A34A' },
  { name: 'Border', value: '#E5EAF3' },
]

interface TableRow {
  time: string
  building: string
  type: string
  level: AlarmLevel
  status: AlarmStatus
}

const rows: TableRow[] = [
  {
    time: '06-01 10:23',
    building: '实验楼B',
    type: '能耗异常',
    level: 'severe',
    status: 'pending',
  },
  {
    time: '06-01 09:58',
    building: '宿舍楼C',
    type: '设备离线',
    level: 'warning',
    status: 'processing',
  },
  {
    time: '06-01 08:47',
    building: '图书馆D',
    type: '能耗突增',
    level: 'severe',
    status: 'pending',
  },
  {
    time: '06-01 07:31',
    building: '体育馆E',
    type: '功率异常',
    level: 'attention',
    status: 'resolved',
  },
]

const chartOption: EChartsOption = {
  grid: { left: 40, right: 18, top: 20, bottom: 28 },
  tooltip: { trigger: 'axis' },
  xAxis: {
    type: 'category',
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
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
      data: [220, 160, 980, 1420, 1180, 760, 300],
      smooth: 0.25,
      showSymbol: false,
      lineStyle: { width: 2, color: '#1d4ed8' },
      areaStyle: { color: 'rgba(29, 78, 216, 0.05)' },
    },
    {
      name: '预测值',
      type: 'line',
      data: [200, 170, 900, 1100, 1080, 700, 280],
      smooth: 0.25,
      showSymbol: false,
      lineStyle: { width: 2, type: 'dashed', color: '#60a5fa' },
    },
  ],
}
</script>

<style scoped>
.ui-kit {
  max-width: 1440px;
}

.ui-kit__intro {
  color: var(--color-text-muted);
  font-size: 13px;
}

.ui-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.swatch-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.swatch-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.swatch {
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  border-radius: 9px;
  flex-shrink: 0;
}

.swatch-item b {
  display: block;
  font-size: 12px;
  font-weight: 500;
}

.swatch-item code {
  display: block;
  margin-top: 2px;
  color: var(--color-text-muted);
  font-family: var(--font-num);
  font-size: 11px;
}

.type-samples {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.type-sample__label {
  display: block;
  margin-bottom: 2px;
  color: var(--color-text-muted);
  font-size: 11px;
}

.type-sample__title {
  font-size: 20px;
  font-weight: 600;
}

.type-sample__card-title {
  font-size: 16px;
  font-weight: 600;
}

.type-sample p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.type-sample__number {
  font-size: 32px;
  font-weight: 600;
}

.type-sample__number em {
  color: var(--color-text-muted);
  font-size: 13px;
  font-style: normal;
}

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.row + .row {
  margin-top: 14px;
}

.form-sample {
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 1100px) {
  .ui-grid,
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
