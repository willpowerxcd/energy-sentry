import type { AlarmLevel, AlarmStatus } from '@/api/types/alarm'
import type { ReportStatus } from '@/api/types/report'

export interface StatusMeta {
  label: string
  className: string
  color: string
}

export const ALARM_LEVEL_META: Record<AlarmLevel, StatusMeta> = {
  severe: { label: '严重', className: 'is-danger', color: '#dc2626' },
  warning: { label: '预警', className: 'is-warning', color: '#d97706' },
  attention: { label: '关注', className: 'is-info', color: '#2563eb' },
  normal: { label: '正常', className: 'is-success', color: '#16a34a' },
}

export const ALARM_STATUS_META: Record<AlarmStatus, StatusMeta> = {
  pending: { label: '待处理', className: 'is-danger', color: '#dc2626' },
  processing: { label: '处理中', className: 'is-warning', color: '#d97706' },
  resolved: { label: '已闭环', className: 'is-info', color: '#2563eb' },
}

export const REPORT_STATUS_META: Record<ReportStatus, StatusMeta> = {
  generating: { label: '生成中', className: 'is-warning', color: '#d97706' },
  completed: { label: '已完成', className: 'is-success', color: '#16a34a' },
  failed: { label: '生成失败', className: 'is-danger', color: '#dc2626' },
}

export const RISK_LEVEL_ORDER: AlarmLevel[] = ['severe', 'warning', 'attention', 'normal']
