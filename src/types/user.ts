export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
}
export enum Permissions {
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  TEAM_VIEW = 'team:view',
  TEAM_CREATE = 'team:create',
  TEAM_UPDATE = 'team:update',
  TEAM_DELETE = 'team:delete',

  PLAYER_VIEW = 'player:view',
  PLAYER_CREATE = 'player:create',
  PLAYER_UPDATE = 'player:update',
  PLAYER_DELETE = 'player:delete',
}

export const RolePermissions = {
  [UserRole.USER]: [
    Permissions.TEAM_CREATE,
    Permissions.TEAM_UPDATE,
    Permissions.PLAYER_CREATE,
    Permissions.PLAYER_UPDATE,
  ],
  [UserRole.EDITOR]: [
    Permissions.TEAM_VIEW,
    Permissions.TEAM_UPDATE,
    Permissions.TEAM_CREATE,
    Permissions.PLAYER_VIEW,
  ],
  [UserRole.ADMIN]: Object.values(Permissions),
}

export type User = {
  id: string
  name: string
  email: string
  photo?: string
  provider?: string
  role: UserRole
}
