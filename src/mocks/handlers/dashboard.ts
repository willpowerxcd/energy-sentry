import { delay, http as mswHttp, HttpResponse } from 'msw'
import type { Granularity } from '@/api/types/dashboard'
import { alarmState } from '../db/alarms'
import {
  mockRanking,
  mockSeriesDay,
  mockSeriesMonth,
  mockSeriesWeek,
  mockSummary,
} from '../fixtures/dashboard'

export const dashboardHandlers = [
  mswHttp.get('/api/v1/dashboard/summary', async () => {
    await delay(220)
    return HttpResponse.json(mockSummary)
  }),

  mswHttp.get('/api/v1/dashboard/series', async ({ request }) => {
    await delay(280)
    const granularity = new URL(request.url).searchParams.get('granularity') as
      | Granularity
      | null

    const data =
      granularity === 'week'
        ? mockSeriesWeek
        : granularity === 'month'
          ? mockSeriesMonth
          : mockSeriesDay

    return HttpResponse.json(data)
  }),

  mswHttp.get('/api/v1/dashboard/ranking', async () => {
    await delay(240)
    return HttpResponse.json(mockRanking)
  }),

  mswHttp.get('/api/v1/dashboard/alarms', async ({ request }) => {
    await delay(240)
    const rawLimit = Number(new URL(request.url).searchParams.get('limit') ?? 5)
    const limit = Number.isFinite(rawLimit) ? rawLimit : 5
    return HttpResponse.json(alarmState.slice(0, limit))
  }),
]
