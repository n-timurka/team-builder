import { Timestamp } from 'firebase/firestore'

export type Team = {
  id: string
  name: string
  status: 'new' | 'aproved' | 'rejected'
  createdBy: string
  createdAt: Timestamp
}
