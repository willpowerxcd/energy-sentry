import { USE_MOCK } from '@/config/env'

export async function setupMock(): Promise<void> {
  if (!USE_MOCK) return

  try {
    const { worker } = await import('./browser')
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: { url: '/mockServiceWorker.js' },
    })
    console.info('[msw] Mock API enabled')
  } catch (error) {
    console.warn('[msw] Failed to start mock API', error)
  }
}
