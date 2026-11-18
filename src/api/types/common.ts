export interface ApiError {
  code: string
  message: string
  detail?: unknown
}

export interface PageResult<T> {
  items: T[]
  total: number
}

export type TaskStatus = 'pending' | 'running' | 'succeeded' | 'failed'
