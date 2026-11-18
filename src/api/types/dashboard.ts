import type { AlarmLevel, AlarmStatus } from './alarm'

export type Granularity = 'day' | 'week' | 'month'

export interface DashboardSummary {
  today_kwh: number
  alarm_count: number
  estimated_saving_yuan: number
  carbon_reduced_t: number
  day_over_day: number
  year_over_year: number
  target_completion: number
  equivalent_trees: number
}

export interface SeriesAnomaly {
  index: number
  value: number
  alarm_id?: number
}

export interface DashboardSeries {
  labels: string[]
  actual: number[]
  predicted: number[]
  lower?: number[]
  upper?: number[]
  anomalies: SeriesAnomaly[]
}

export interface BuildingRankingItem {
  building_id: number
  building_name: string
  kwh: number
}

export interface DashboardAlarm {
  id: number
  alarm_time: string
  building_id: number
  building_name: string
  alarm_type: string
  alarm_level: AlarmLevel
  suggestion: string
  status: AlarmStatus
}
