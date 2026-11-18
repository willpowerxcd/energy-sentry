import { delay, http as mswHttp, HttpResponse } from 'msw'
import { mockBuildings } from '../fixtures/buildings'

export const buildingHandlers = [
  mswHttp.get('/api/v1/buildings', async () => {
    await delay(200)
    return HttpResponse.json(mockBuildings)
  }),

  mswHttp.get('/api/v1/buildings/:id', async ({ params }) => {
    await delay(180)
    const building = mockBuildings.find((item) => item.id === Number(params.id))
    if (!building) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: '楼栋不存在' },
        { status: 404 },
      )
    }
    return HttpResponse.json(building)
  }),
]
