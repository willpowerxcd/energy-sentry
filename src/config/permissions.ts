import type { Role } from '@/api/types/auth'

export const ROLE_LABELS: Record<Role, string> = {
  admin: '管理员',
  logistics: '后勤',
  ops: '运维',
  observer: '观察员',
}

export const PERMISSIONS = {
  alarmView: 'alarm:view',
  alarmHandle: 'alarm:handle',
  alarmAssign: 'alarm:assign',
  suggestionView: 'suggestion:view',
  suggestionAdopt: 'suggestion:adopt',
  reportView: 'report:view',
  reportGenerate: 'report:generate',
  reportExport: 'report:export',
  deviceView: 'device:view',
  deviceEdit: 'device:edit',
  settingsManage: 'settings:manage',
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const ROLE_PERMISSIONS: Record<Role, PermissionCode[]> = {
  admin: Object.values(PERMISSIONS),
  logistics: [
    PERMISSIONS.alarmView,
    PERMISSIONS.alarmHandle,
    PERMISSIONS.alarmAssign,
    PERMISSIONS.suggestionView,
    PERMISSIONS.suggestionAdopt,
    PERMISSIONS.reportView,
    PERMISSIONS.reportGenerate,
    PERMISSIONS.reportExport,
    PERMISSIONS.deviceView,
  ],
  ops: [
    PERMISSIONS.alarmView,
    PERMISSIONS.alarmHandle,
    PERMISSIONS.suggestionView,
    PERMISSIONS.reportView,
    PERMISSIONS.reportExport,
    PERMISSIONS.deviceView,
    PERMISSIONS.deviceEdit,
  ],
  observer: [
    PERMISSIONS.alarmView,
    PERMISSIONS.suggestionView,
    PERMISSIONS.reportView,
    PERMISSIONS.reportExport,
    PERMISSIONS.deviceView,
  ],
}

export function permissionsForRoles(roles: Role[]): PermissionCode[] {
  return [...new Set(roles.flatMap((role) => ROLE_PERMISSIONS[role] ?? []))]
}
