import { Timestamp } from 'firebase/firestore'

export enum TeamStatus {
  NEW = 'new',
  APPROVED = 'aproved',
  REJECTED = 'rejected',
}

export type Team = {
  id: string
  name: string
  status: TeamStatus
  createdBy: string
  createdAt: Timestamp
}
