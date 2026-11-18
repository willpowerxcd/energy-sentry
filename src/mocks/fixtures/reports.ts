import type { ReportDetail, ReportListItem } from '@/api/types/report'

export const mockReports: ReportListItem[] = [
  {
    id: 1,
    title: '2026年5月节能诊断报告',
    report_type: 'monthly',
    scope: '全校园区',
    period_start: '2026-05-01',
    period_end: '2026-05-31',
    generated_at: '2026-06-01T08:30:00+08:00',
    status: 'completed',
  },
  {
    id: 2,
    title: '实验楼B夜间空耗专项报告',
    report_type: 'alarm',
    scope: '实验楼B',
    period_start: '2026-05-24',
    period_end: '2026-05-30',
    generated_at: '2026-05-31T16:10:00+08:00',
    status: 'completed',
  },
  {
    id: 3,
    title: '2026年第21周运行周报',
    report_type: 'weekly',
    scope: '全校园区',
    period_start: '2026-05-18',
    period_end: '2026-05-24',
    generated_at: '2026-05-25T09:00:00+08:00',
    status: 'completed',
  },
]

export const mockReportDetail: ReportDetail = {
  id: 1,
  title: '2026年5月节能诊断报告',
  period_start: '2026-05-01',
  period_end: '2026-05-31',
  summary: {
    total_kwh: 128600,
    alarm_count: 18,
    saving_yuan: 36200,
    carbon_t: 21.3,
  },
  anomalies: [],
  ranking: [],
  savings: {},
  causes: [],
  measures: [],
  carbon: {},
  conclusion:
    '本月异常主要由设备管理不规范及系统效率下降引起。通过落实治理措施，预计可节省 36,200 元，减少碳排放 21.3 tCO₂。建议持续优化设备运行策略及人员管理，建立长效节能机制。',
}
