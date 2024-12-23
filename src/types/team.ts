import { Timestamp } from 'firebase/firestore'
import type { Player } from './player'
import type { User } from './user'

export enum TeamStatus {
  NEW = 'new',
  APPROVED = 'aproved',
  REJECTED = 'rejected',
}

export type Team = {
  id: string
  name: string
  status: TeamStatus
  logo?: string
  createdBy: User
  createdAt: Timestamp
  roster?: Player[]
}
