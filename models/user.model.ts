import type { User } from 'firebase/auth'

export type UserFirebase = User

export interface PageUser {
  id: string
  email: string
  displayName?: string
  photoURL?: string
}
