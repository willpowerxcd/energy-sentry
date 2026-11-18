import { delay, http as mswHttp, HttpResponse } from 'msw'
import type { LoginPayload } from '@/api/types/auth'
import { mockAccounts, toPublicUser, type MockAccount } from '../fixtures/users'

const ACCESS_PREFIX = 'mock-access'
const REFRESH_PREFIX = 'mock-refresh'

function issueToken(prefix: string, username: string): string {
  return `${prefix}.${username}.${Date.now()}`
}

function parseToken(token: string, prefix: string): string | null {
  const [actualPrefix, username] = token.split('.')
  return actualPrefix === prefix && username ? username : null
}

function findAccount(username: string): MockAccount | undefined {
  return mockAccounts.find((account) => account.username === username)
}

function bearerToken(request: Request): string {
  return request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''
}

export const authHandlers = [
  mswHttp.post('/api/v1/auth/login', async ({ request }) => {
    await delay(280)
    const body = (await request.json()) as LoginPayload
    const account = mockAccounts.find(
      (item) => item.username === body.username && item.password === body.password,
    )

    if (!account) {
      return HttpResponse.json(
        { code: 'AUTH_INVALID', message: '用户名或密码错误' },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      access_token: issueToken(ACCESS_PREFIX, account.username),
      refresh_token: issueToken(REFRESH_PREFIX, account.username),
      token_type: 'bearer',
      expires_in: 7200,
      user: toPublicUser(account),
    })
  }),

  mswHttp.get('/api/v1/auth/me', ({ request }) => {
    const username = parseToken(bearerToken(request), ACCESS_PREFIX)
    const account = username ? findAccount(username) : undefined

    if (!account) {
      return HttpResponse.json(
        { code: 'AUTH_UNAUTHORIZED', message: '登录已过期' },
        { status: 401 },
      )
    }

    return HttpResponse.json(toPublicUser(account))
  }),

  mswHttp.post('/api/v1/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refresh_token?: string }
    const username = body.refresh_token
      ? parseToken(body.refresh_token, REFRESH_PREFIX)
      : null
    const account = username ? findAccount(username) : undefined

    if (!account) {
      return HttpResponse.json(
        { code: 'AUTH_REFRESH_INVALID', message: '刷新令牌无效' },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      access_token: issueToken(ACCESS_PREFIX, account.username),
      refresh_token: issueToken(REFRESH_PREFIX, account.username),
      token_type: 'bearer',
      expires_in: 7200,
    })
  }),

  mswHttp.post('/api/v1/auth/logout', () => new HttpResponse(null, { status: 204 })),
]
