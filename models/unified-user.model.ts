import type { PageUser } from './user.model'

// Usuario unificado que combina datos de Firebase y BD
export interface UnifiedUser {
  // Datos de autenticación (Firebase)
  firebaseId: string        // UID de Firebase
  firebaseEmail: string     // Email de Firebase
  firebaseDisplayName?: string
  firebasePhotoURL?: string
  
  // Datos de la aplicación (PostgreSQL)
  dbId: number             // ID de la BD para relaciones
  nombre: string           // Nombre editable
  apellido: string         // Apellido editable
  email: string            // Email de la aplicación
  createdAt: Date
  
  // Estado de sincronización
  isDbSynced: boolean      // Si está sincronizado con la BD
}

// Función para crear usuario unificado
export function createUnifiedUser(
  user: PageUser, 
  dbUser: { id: number; nombre: string; apellido: string; email: string } | null
): UnifiedUser | null {
  if (!user) return null
  
  return {
    // Firebase data
    firebaseId: user.id,
    firebaseEmail: user.email,
    firebaseDisplayName: user.displayName,
    firebasePhotoURL: user.photoURL,
    
    // DB data (si existe)
    dbId: dbUser?.id || 0,
    nombre: dbUser?.nombre || user.displayName?.split(' ')[0] || '',
    apellido: dbUser?.apellido || user.displayName?.split(' ').slice(1).join(' ') || '',
    email: dbUser?.email || user.email,
    createdAt: new Date(),
    
    // Sync status
    isDbSynced: !!dbUser
  }
}
