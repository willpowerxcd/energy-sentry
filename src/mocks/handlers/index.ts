import { alarmHandlers } from './alarms'
import { authHandlers } from './auth'
import { buildingHandlers } from './buildings'
import { dashboardHandlers } from './dashboard'
import { reportHandlers } from './reports'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...alarmHandlers,
  ...buildingHandlers,
  ...reportHandlers,
]
