import { delay, http as mswHttp, HttpResponse } from 'msw'
import { mockReportDetail, mockReports } from '../fixtures/reports'

export const reportHandlers = [
  mswHttp.get('/api/v1/reports', async () => {
    await delay(240)
    return HttpResponse.json({ items: mockReports, total: mockReports.length })
  }),

  mswHttp.get('/api/v1/reports/:id', async ({ params }) => {
    await delay(220)
    if (Number(params.id) !== mockReportDetail.id) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '报告不存在' },
        { status: 404 },
      )
    }
    return HttpResponse.json(mockReportDetail)
  }),
]
