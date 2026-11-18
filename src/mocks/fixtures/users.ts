import type { AuthUser, Role } from '@/api/types/auth'
import { permissionsForRoles } from '@/config/permissions'

export interface MockAccount extends AuthUser {
  password: string
}

function account(
  id: number,
  username: string,
  password: string,
  displayName: string,
  roles: Role[],
): MockAccount {
  return {
    id,
    username,
    password,
    display_name: displayName,
    roles,
    permissions: permissionsForRoles(roles),
  }
}

export const mockAccounts: MockAccount[] = [
  account(1, 'admin', 'admin123', '管理员', ['admin']),
  account(2, 'logistics', 'logistics123', '后勤管理员', ['logistics']),
  account(3, 'ops', 'ops123', '运维工程师', ['ops']),
  account(4, 'observer', 'observer123', '观察员', ['observer']),
]

export function toPublicUser(account: MockAccount): AuthUser {
  return {
    id: account.id,
    username: account.username,
    display_name: account.display_name,
    roles: account.roles,
    permissions: account.permissions,
  }
}
