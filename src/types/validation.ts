import type { Timestamp } from 'firebase/firestore'
import type { Team } from './team'
import type { User } from './user'

export enum ValidationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type Validation = {
  id: string
  team: Team
  message?: string
  status: ValidationStatus
  validatedAt: Timestamp
  validatedBy: User
  createdAt: Timestamp
  createdBy: User
}
