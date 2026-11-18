import { delay, http as mswHttp, HttpResponse } from 'msw'
import type { AlarmStatus } from '@/api/types/alarm'
import { alarmDetailState, alarmState } from '../db/alarms'

export const alarmHandlers = [
  mswHttp.get('/api/v1/alarms', async ({ request }) => {
    await delay(260)
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size') ?? 10))
    const level = url.searchParams.get('level')
    const status = url.searchParams.get('status')
    const buildingId = url.searchParams.get('building_id')

    const filtered = alarmState.filter(
      (item) =>
        (!level || item.alarm_level === level) &&
        (!status || item.status === status) &&
        (!buildingId || String(item.building_id) === buildingId),
    )

    const start = (page - 1) * pageSize
    return HttpResponse.json({
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
    })
  }),

  mswHttp.get('/api/v1/alarms/:id', async ({ params }) => {
    await delay(200)
    const detail = alarmDetailState[Number(params.id)]
    if (!detail) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '告警不存在' },
        { status: 404 },
      )
    }
    return HttpResponse.json(detail)
  }),

  mswHttp.patch('/api/v1/alarms/:id', async ({ params, request }) => {
    await delay(220)
    const id = Number(params.id)
    const body = (await request.json()) as { status: AlarmStatus; note?: string }
    const item = alarmState.find((alarm) => alarm.id === id)

    if (!item) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '告警不存在' },
        { status: 404 },
      )
    }

    item.status = body.status
    const detail = alarmDetailState[id]
    if (detail) detail.status = body.status

    return HttpResponse.json(detail ?? item)
  }),
]
