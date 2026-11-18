import dayjs from 'dayjs'
import type { AlarmDetail } from '@/api/types/alarm'
import type {
  BuildingRankingItem,
  DashboardAlarm,
  DashboardSeries,
  DashboardSummary,
  SeriesAnomaly,
} from '@/api/types/dashboard'
import { MOCK_TODAY } from '@/config/env'

const TODAY_TOTAL = 12860
const PREDICTED_TOTAL = 11352

function scaleToTotal(values: number[], total: number): number[] {
  const sum = values.reduce((acc, value) => acc + value, 0)
  let running = 0

  return values.map((value, index) => {
    if (index === values.length - 1) return total - running
    const scaled = Math.round((value / sum) * total)
    running += scaled
    return scaled
  })
}

const dayShape = [
  180, 150, 120, 110, 120, 200, 380, 620, 780, 980, 1600, 1100, 900, 820, 900, 1350, 1180, 900,
  700, 780, 620, 420, 300, 200,
]

const dayPredictedShape = [
  170, 140, 115, 105, 115, 190, 340, 560, 700, 850, 1080, 1000, 900, 820, 880, 1200, 1100, 920,
  720, 680, 560, 390, 280, 190,
]

const dayActual = scaleToTotal(dayShape, TODAY_TOTAL)
const dayPredicted = scaleToTotal(dayPredictedShape, PREDICTED_TOTAL)

const dayLabels = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}:00`)

const dayAnomalies: SeriesAnomaly[] = [
  { index: 10, value: dayActual[10], alarm_id: 101 },
  { index: 15, value: dayActual[15], alarm_id: 103 },
]

export const mockSeriesDay: DashboardSeries = {
  labels: dayLabels,
  actual: dayActual,
  predicted: dayPredicted,
  anomalies: dayAnomalies,
}

const weekLabels = Array.from({ length: 7 }, (_, index) =>
  dayjs(MOCK_TODAY)
    .subtract(6 - index, 'day')
    .format('MM-DD'),
)
const weekActual = [11800, 12200, 11900, 12400, 12100, 9800, 9300]
const weekPredicted = [11400, 11700, 11500, 11900, 11800, 10100, 9600]

export const mockSeriesWeek: DashboardSeries = {
  labels: weekLabels,
  actual: weekActual,
  predicted: weekPredicted,
  anomalies: [{ index: 3, value: weekActual[3], alarm_id: 103 }],
}

const monthLabels = Array.from({ length: 30 }, (_, index) =>
  dayjs(MOCK_TODAY)
    .subtract(29 - index, 'day')
    .format('MM-DD'),
)
const monthActual = Array.from(
  { length: 30 },
  (_, index) => 11200 + ((index * 37) % 900) + (index % 7 < 5 ? 500 : -300),
)
const monthPredicted = monthActual.map((value, index) => value - 600 + ((index * 19) % 200))
const monthAnomalies: SeriesAnomaly[] = [7, 14, 21, 28].map((index) => ({
  index,
  value: monthActual[index],
}))

export const mockSeriesMonth: DashboardSeries = {
  labels: monthLabels,
  actual: monthActual,
  predicted: monthPredicted,
  anomalies: monthAnomalies,
}

export const mockSummary: DashboardSummary = {
  today_kwh: TODAY_TOTAL,
  alarm_count: 18,
  estimated_saving_yuan: 36200,
  carbon_reduced_t: 21.3,
  day_over_day: 0.086,
  year_over_year: -0.062,
  target_completion: 0.82,
  equivalent_trees: 1274,
}

export const mockRanking: BuildingRankingItem[] = [
  { building_id: 2, building_name: '实验楼B', kwh: 3280 },
  { building_id: 3, building_name: '宿舍楼C', kwh: 2450 },
  { building_id: 4, building_name: '图书馆D', kwh: 1860 },
  { building_id: 1, building_name: '行政楼A', kwh: 1620 },
  { building_id: 5, building_name: '体育馆E', kwh: 1150 },
]

export const mockAlarms: DashboardAlarm[] = [
  {
    id: 101,
    alarm_time: '2026-06-01T10:23:00+08:00',
    building_id: 2,
    building_name: '实验楼B',
    alarm_type: '能耗异常',
    alarm_level: 'severe',
    suggestion: '检查空调和实验设备',
    status: 'pending',
  },
  {
    id: 102,
    alarm_time: '2026-06-01T09:58:00+08:00',
    building_id: 3,
    building_name: '宿舍楼C',
    alarm_type: '设备离线',
    alarm_level: 'warning',
    suggestion: '检查网关通讯状态',
    status: 'processing',
  },
  {
    id: 103,
    alarm_time: '2026-06-01T08:47:00+08:00',
    building_id: 4,
    building_name: '图书馆D',
    alarm_type: '能耗突增',
    alarm_level: 'severe',
    suggestion: '核查活动和冷源策略',
    status: 'pending',
  },
  {
    id: 104,
    alarm_time: '2026-06-01T07:31:00+08:00',
    building_id: 5,
    building_name: '体育馆E',
    alarm_type: '功率异常',
    alarm_level: 'warning',
    suggestion: '检查配电回路',
    status: 'processing',
  },
  {
    id: 105,
    alarm_time: '2026-06-01T05:12:00+08:00',
    building_id: 1,
    building_name: '行政楼A',
    alarm_type: '数据缺失',
    alarm_level: 'attention',
    suggestion: '补采缺失数据',
    status: 'resolved',
  },
]

function makeDetail(
  base: DashboardAlarm,
  extra: Omit<AlarmDetail, keyof DashboardAlarm>,
): AlarmDetail {
  return { ...base, ...extra }
}

export const mockAlarmDetails: Record<number, AlarmDetail> = {
  101: makeDetail(mockAlarms[0], {
    actual_value: 2160,
    predicted_value: 1320,
    residual_rate: 0.636,
    three_view_scores: { local: 0.82, global: 0.74, external: 0.61 },
    possible_causes: [
      { cause: '空调未关闭', confidence: 0.72, check: '核查空调定时策略与夜间关机设置' },
      { cause: '实验设备待机', confidence: 0.58, check: '巡查实验设备待机功耗与排班' },
    ],
    loss: { energy_kwh: 840, money_yuan: 672, carbon_kg: 394.8 },
  }),
  102: makeDetail(mockAlarms[1], {
    actual_value: 0,
    predicted_value: 420,
    residual_rate: 1,
    three_view_scores: { local: 0.91, global: 0.55, external: 0.78 },
    possible_causes: [
      { cause: '网关离线', confidence: 0.88, check: '检查网关供电和网络连接' },
      { cause: '电表故障', confidence: 0.42, check: '现场核对电表读数' },
    ],
    loss: { energy_kwh: 420, money_yuan: 336, carbon_kg: 197.4 },
  }),
  103: makeDetail(mockAlarms[2], {
    actual_value: 2860,
    predicted_value: 1520,
    residual_rate: 0.881,
    three_view_scores: { local: 0.86, global: 0.69, external: 0.73 },
    possible_causes: [
      { cause: '大型活动', confidence: 0.64, check: '核对当日活动安排和开放时间' },
      { cause: '冷源策略异常', confidence: 0.51, check: '检查冷站运行策略和设定温度' },
    ],
    loss: { energy_kwh: 1340, money_yuan: 1072, carbon_kg: 629.8 },
  }),
  104: makeDetail(mockAlarms[3], {
    actual_value: 1980,
    predicted_value: 1380,
    residual_rate: 0.435,
    three_view_scores: { local: 0.71, global: 0.62, external: 0.58 },
    possible_causes: [
      { cause: '设备启停异常', confidence: 0.67, check: '检查设备启停记录和接触器状态' },
      { cause: '回路过载', confidence: 0.45, check: '测量回路电流并核对负载' },
    ],
    loss: { energy_kwh: 600, money_yuan: 480, carbon_kg: 282 },
  }),
  105: makeDetail(mockAlarms[4], {
    actual_value: 0,
    predicted_value: 380,
    residual_rate: 1,
    three_view_scores: { local: 0.77, global: 0.48, external: 0.69 },
    possible_causes: [
      { cause: '通信中断', confidence: 0.81, check: '检查采集器与平台连接' },
      { cause: '采集延迟', confidence: 0.39, check: '核对采集任务执行时间' },
    ],
    loss: { energy_kwh: 380, money_yuan: 304, carbon_kg: 178.6 },
  }),
}
