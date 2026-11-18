import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  BuildingRankingItem,
  DashboardAlarm,
  DashboardSeries,
  DashboardSummary,
  Granularity,
} from '@/api/types/dashboard'
import {
  getDashboardAlarms,
  getDashboardRanking,
  getDashboardSeries,
  getDashboardSummary,
} from '@/api/modules/dashboard'
import { MOCK_TODAY } from '@/config/env'

export const useDashboardStore = defineStore('dashboard', () => {
  const date = ref(MOCK_TODAY)
  const granularity = ref<Granularity>('day')

  const summary = ref<DashboardSummary | null>(null)
  const series = ref<DashboardSeries | null>(null)
  const ranking = ref<BuildingRankingItem[]>([])
  const alarms = ref<DashboardAlarm[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const [nextSummary, nextSeries, nextRanking, nextAlarms] = await Promise.all([
        getDashboardSummary(date.value),
        getDashboardSeries(date.value, granularity.value),
        getDashboardRanking(date.value),
        getDashboardAlarms(5),
      ])

      summary.value = nextSummary
      series.value = nextSeries
      ranking.value = nextRanking
      alarms.value = nextAlarms
    } catch (err) {
      error.value = err instanceof Error ? err.message : '数据加载失败'
    } finally {
      loading.value = false
    }
  }

  return {
    date,
    granularity,
    summary,
    series,
    ranking,
    alarms,
    loading,
    error,
    load,
  }
})
