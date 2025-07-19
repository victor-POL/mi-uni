import {
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
} from 'firebase/auth'

import { auth } from '@/lib/firebase/clientApp'

export function onAuthStateChanged(cb) {
  return _onAuthStateChanged(auth, cb)
}

export function onIdTokenChanged(cb) {
  return _onIdTokenChanged(auth, cb)
}

export async function signInWithGitHub() {
  const provider = new GithubAuthProvider()

  return signInWithPopup(auth, provider)
}

export async function signOut() {
  return auth.signOut()
}
