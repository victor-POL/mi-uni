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
 * @param user - Datos del usuario
 * @returns true si el usuario está autenticado y tiene ID válido
 */
export const isAuthenticatedWithValidId = (user: any): boolean => {
  return user !== null && hasValidUserId(user)
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
 * @param user - Datos del usuario (puede ser null si no está autenticado)
 * @returns ID del usuario o undefined si no está disponible
 */
export const getUserIdToPass = (user: any): number | undefined => {
  if (!isAuthenticatedWithValidId(user)) {
    return undefined
  }
  
  return extractUserId(user)
}