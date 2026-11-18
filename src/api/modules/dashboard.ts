import type {
  BuildingRankingItem,
  DashboardAlarm,
  DashboardSeries,
  DashboardSummary,
  Granularity,
} from '@/api/types/dashboard'
import { http } from '../http'

export function getDashboardSummary(date: string): Promise<DashboardSummary> {
  return http.get<DashboardSummary>('/dashboard/summary', { params: { date } })
}

export function getDashboardSeries(
  date: string,
  granularity: Granularity,
): Promise<DashboardSeries> {
  return http.get<DashboardSeries>('/dashboard/series', { params: { date, granularity } })
}

export function getDashboardRanking(date: string): Promise<BuildingRankingItem[]> {
  return http.get<BuildingRankingItem[]>('/dashboard/ranking', { params: { date } })
}

export function getDashboardAlarms(limit = 5): Promise<DashboardAlarm[]> {
  return http.get<DashboardAlarm[]>('/dashboard/alarms', { params: { limit } })
}
