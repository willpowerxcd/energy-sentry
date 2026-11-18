import type { PageResult } from '@/api/types/common'
import type { ReportDetail, ReportListItem } from '@/api/types/report'
import { http } from '../http'

export function getReports(params?: {
  page?: number
  page_size?: number
}): Promise<PageResult<ReportListItem>> {
  return http.get<PageResult<ReportListItem>>('/reports', { params })
}

export function getReportDetail(id: number): Promise<ReportDetail> {
  return http.get<ReportDetail>(`/reports/${id}`)
}
