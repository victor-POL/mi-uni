import {
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
  linkWithCredential,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithCredential,
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

// Autenticación con email y contraseña
export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

// Función mejorada para email/password con manejo de conflictos
export async function signInWithEmailAdvanced(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      // Verificar si la cuenta existe con otro proveedor
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      
      if (signInMethods.includes('github.com')) {
        throw new Error(`Esta cuenta existe con GitHub. Por favor inicia sesión con GitHub primero.`)
      }
    }
    throw error
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  return userCredential
}

// Función mejorada para registro con manejo de conflictos
export async function signUpWithEmailAdvanced(email: string, password: string) {
  try {
    return await signUpWithEmail(email, password)
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // Verificar qué métodos están disponibles para este email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email)
      
      if (signInMethods.includes('github.com')) {
        throw new Error(`Esta cuenta ya existe con GitHub. Inicia sesión con GitHub y luego podrás vincular email/password en configuraciones.`)
      } else if (signInMethods.includes('password')) {
        throw new Error(`Ya existe una cuenta con este email. Por favor inicia sesión.`)
      }
    }
    throw error
  }
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email)
}

// Verificar qué métodos de login están disponibles para un email
export async function getSignInMethodsForEmail(email: string) {
  return fetchSignInMethodsForEmail(auth, email)
}

// Vincular cuenta de email/password a usuario existente
export async function linkEmailPassword(email: string, password: string) {
  const user = auth.currentUser
  if (!user) {
    throw new Error('No user is currently signed in')
  }
  
  const credential = EmailAuthProvider.credential(email, password)
  return linkWithCredential(user, credential)
}

// Manejar conflicto de cuenta existente con diferente credential
export async function handleAccountExistsError(error: any, email: string, password: string) {
  if (error.code === 'auth/account-exists-with-different-credential') {
    // Obtener los métodos de login disponibles para este email
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    
    if (signInMethods.includes('password')) {
      // El usuario ya tiene una cuenta con email/password
      // Intentar hacer login con email/password primero
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Luego vincular la credencial de GitHub
      if (error.credential) {
        await linkWithCredential(userCredential.user, error.credential)
      }
      
      return userCredential
    } else if (signInMethods.includes('github.com')) {
      // El usuario ya tiene una cuenta con GitHub
      // Necesitamos que se autentique primero con GitHub
      throw new Error('Esta cuenta ya existe con GitHub. Por favor inicia sesión con GitHub primero y luego podrás vincular email/password en configuraciones.')
    }
  }
  
  throw error
}

// Función auxiliar para manejar errores específicos de GitHub
function handleGitHubError(error: any): string {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      return 'Inicio de sesión cancelado'
    case 'auth/popup-blocked':
      return 'Popup bloqueado por el navegador. Por favor permite popups para este sitio.'
    default:
      return `Error al iniciar sesión con GitHub: ${error.message || 'Error desconocido'}`
  }
}

// Función auxiliar para manejar conflictos de cuenta
async function handleAccountConflict(error: any): Promise<string> {
  const email = error.customData?.email || error.email
  
  if (!email) {
    return `Ya existe una cuenta con este email usando un método diferente. Por favor:
1. Inicia sesión con email/contraseña si tienes una cuenta registrada
2. O revisa qué método de autenticación usaste originalmente
3. Puedes vincular métodos adicionales en Configuración de Cuenta`
  }

  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    
    if (signInMethods.includes('password')) {
      return `Esta cuenta ya existe con email/password (${email}). Por favor:
1. Inicia sesión con tu email y contraseña
2. Ve a Configuración de Cuenta  
3. Vincula tu cuenta de GitHub`
    }
  } catch (fetchError) {
    console.error('Error obteniendo métodos de login:', fetchError)
  }

  return `Ya existe una cuenta registrada con ${email}. Intenta iniciar sesión con el método original y luego vincula GitHub en Configuración de Cuenta.`
}

// Función mejorada para GitHub con manejo de conflictos
export async function signInWithGitHubAdvanced() {
  try {
    const provider = new GithubAuthProvider()
    return await signInWithPopup(auth, provider)
  } catch (error: any) {
    
    if (error.code === 'auth/account-exists-with-different-credential') {
      const errorMessage = await handleAccountConflict(error)
      throw new Error(errorMessage)
    }
    
    const errorMessage = handleGitHubError(error)
    throw new Error(errorMessage)
  }
}

export async function signOut() {
  return auth.signOut()
}
