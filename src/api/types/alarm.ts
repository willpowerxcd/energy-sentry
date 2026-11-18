export type AlarmLevel = 'normal' | 'attention' | 'warning' | 'severe'
export type AlarmStatus = 'pending' | 'processing' | 'resolved'

export interface AlarmItem {
  id: number
  alarm_time: string
  building_id: number
  building_name: string
  alarm_type: string
  alarm_level: AlarmLevel
  suggestion: string
  status: AlarmStatus
}

export interface AlarmCause {
  cause: string
  confidence: number
  check: string
}

export interface AlarmLoss {
  energy_kwh: number
  money_yuan: number
  carbon_kg: number
}

export interface ThreeViewScores {
  local: number
  global: number
  external: number
}

export interface AlarmDetail extends AlarmItem {
  actual_value: number
  predicted_value: number
  residual_rate: number
  three_view_scores: ThreeViewScores
  possible_causes: AlarmCause[]
  loss: AlarmLoss
  handler?: string
  handle_time?: string
}

export interface AlarmQuery {
  page?: number
  page_size?: number
  building_id?: number
  level?: AlarmLevel
  status?: AlarmStatus
  type?: string
  start?: string
  end?: string
  keyword?: string
  [key: string]: unknown
}
