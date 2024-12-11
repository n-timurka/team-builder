export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export type User = {
  id: string
  name: string
  email: string
  photo?: string
  provider?: string
  role: UserRole
}
