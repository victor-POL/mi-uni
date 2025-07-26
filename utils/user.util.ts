import type { PageUser, UserFirebase } from "@/models/user.model"

export const mapFirebaseUserToPageUser = (user: UserFirebase): PageUser => {
  return {
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
  }
}

/**
 * Verifica si el usuario tiene un ID válido en la base de datos
 * @param user - Datos del usuario
 * @returns true si el usuario tiene un ID válido
 */
export const hasValidUserId = (user: any): boolean => {
  return user?.dbId && user.dbId > 0
}

/**
 * Verifica si el usuario está autenticado y tiene un ID válido
 * @param isLoggedIn - Si el usuario está autenticado
 * @param user - Datos del usuario
 * @returns true si el usuario está autenticado y tiene ID válido
 */
export const isAuthenticatedWithValidId = (isLoggedIn: boolean, user: any): boolean => {
  return isLoggedIn && hasValidUserId(user)
}

/**
 * Extrae el ID del usuario de los datos del usuario
 * @param user - Datos del usuario
 * @returns ID del usuario
 */
export const extractUserId = (user: any): number => {
  return user.dbId
}

/**
 * Determina el ID de usuario a pasar a la API
 * @param isLoggedIn - Si el usuario está autenticado
 * @param user - Datos del usuario
 * @returns ID del usuario o undefined si no está disponible
 */
export const getUserIdToPass = (isLoggedIn: boolean, user: any): number | undefined => {
  if (!isAuthenticatedWithValidId(isLoggedIn, user)) {
    return undefined
  }
  
  return extractUserId(user)
}