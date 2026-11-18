export type Role = 'admin' | 'logistics' | 'ops' | 'observer'

export interface AuthUser {
  id: number
  username: string
  display_name: string
  roles: Role[]
  permissions: string[]
}

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: AuthUser
}

export interface RefreshResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}
