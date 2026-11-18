export type ReportType = 'weekly' | 'monthly' | 'alarm'
export type ReportStatus = 'generating' | 'completed' | 'failed'

export interface ReportListItem {
  id: number
  title: string
  report_type: ReportType
  scope: string
  period_start: string
  period_end: string
  generated_at: string
  status: ReportStatus
}

export interface ReportSummary {
  total_kwh: number
  alarm_count: number
  saving_yuan: number
  carbon_t: number
}

export interface ReportDetail {
  id: number
  title: string
  period_start: string
  period_end: string
  summary: ReportSummary
  anomalies: Array<Record<string, unknown>>
  ranking: Array<Record<string, unknown>>
  savings: Record<string, unknown>
  causes: Array<Record<string, unknown>>
  measures: Array<Record<string, unknown>>
  carbon: Record<string, unknown>
  conclusion: string
}
