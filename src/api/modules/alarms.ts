import type {
  AlarmDetail,
  AlarmItem,
  AlarmQuery,
  AlarmStatus,
} from '@/api/types/alarm'
import type { PageResult } from '@/api/types/common'
import { http } from '../http'

export function getAlarms(params: AlarmQuery): Promise<PageResult<AlarmItem>> {
  return http.get<PageResult<AlarmItem>>('/alarms', { params })
}

export function getAlarmDetail(id: number): Promise<AlarmDetail> {
  return http.get<AlarmDetail>(`/alarms/${id}`)
}

export function updateAlarm(
  id: number,
  payload: { status: AlarmStatus; note?: string },
): Promise<AlarmDetail> {
  return http.patch<AlarmDetail>(`/alarms/${id}`, payload)
}
