import {
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from 'firebase/auth'

import { auth } from '@/lib/firebase/clientApp'
import type { User } from 'firebase/auth'

type AuthStateChangedCallback = (user: User | null) => void

export function onAuthStateChanged(cb: AuthStateChangedCallback) {
  return _onAuthStateChanged(auth, cb)
}

type IdTokenChangedCallback = (user: User | null) => void

export function onIdTokenChanged(cb: IdTokenChangedCallback) {
  return _onIdTokenChanged(auth, cb)
}

export async function signInWithGitHub() {
  const provider = new GithubAuthProvider()

  return signInWithPopup(auth, provider)
}

export async function signOut() {
  return auth.signOut()
}
