import type { AlarmDetail, AlarmItem } from '@/api/types/alarm'
import { mockAlarmDetails, mockAlarms } from '../fixtures/dashboard'

export const alarmState: AlarmItem[] = mockAlarms.map((item) => ({ ...item }))

export const alarmDetailState: Record<number, AlarmDetail> = Object.fromEntries(
  Object.entries(mockAlarmDetails).map(([key, value]) => [key, { ...value }]),
)
