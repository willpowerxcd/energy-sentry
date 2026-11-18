export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const USE_MOCK = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false'

export const MOCK_TODAY = import.meta.env.VITE_MOCK_TODAY || '2026-06-01'
