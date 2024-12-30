import type { Team } from './team'

export enum PlayerPosition {
  GUARD = 'g',
  FORWARD = 'f',
  CENTER = 'c',
}

export type Player = {
  id: string
  name: string
  fullName: string[]
  number: string
  photo?: string
  birthDate?: string
  position: PlayerPosition
  team?: Team
}
