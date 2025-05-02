import { Timestamp } from 'firebase/firestore'
import type { Player } from './player'
import type { User } from './user'

export enum TeamStatus {
  NEW = 'new',
  PENDING = 'pending',
  APPROVED = 'aproved',
  REJECTED = 'rejected',
}

export type Team = {
  id: string
  name: string
  slug?: string
  city?: string
  arena?: string
  colors?: {
    primary: string
    secondary: string
  }
  status: TeamStatus
  logo?: string
  createdBy: User
  createdAt: Timestamp
  validateAt?: Timestamp
  roster?: Player[]
}
