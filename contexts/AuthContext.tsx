"use client"

import type React from 'react'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from '@/lib/firebase/auth'
import type { PageUser } from '@/models/user.model'
import type { UnifiedUser } from '@/models/unified-user.model'
import { mapFirebaseUserToPageUser } from '@/utils/user.util'
import { createUnifiedUser } from '@/models/unified-user.model'

interface AuthContextType {
  user: UnifiedUser | null     // Usuario unificado
  loading: boolean
  isUserInitialized: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isUserInitialized: false,
  signOut: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UnifiedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUserInitialized, setIsUserInitialized] = useState(false)

  // Función para sincronizar usuario completo
  const syncCompleteUser = async (firebaseUser: User) => {
    try {
      // Mapear usuario de Firebase
      const user: PageUser = mapFirebaseUserToPageUser(firebaseUser)
      
      // Extraer información para la API
      const githubData = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        login: firebaseUser.email?.split('@')[0] || '',
        avatar_url: firebaseUser.photoURL || undefined
      }
      
      // Sincronizar con base de datos
      const response = await fetch('/api/auth/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubData })
      })

      let dbUser = null
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          dbUser = result.data.user
          console.log('✅ Usuario sincronizado con BD:', dbUser)
        }
      }

      // Crear usuario unificado
      const unifiedUser = createUnifiedUser(user, dbUser)
      setUser(unifiedUser)
            
    } catch (error) {
      console.error('💥 Error sincronizando usuario:', error)
      
      // En caso de error, crear usuario solo con datos de Firebase
      const user: PageUser = mapFirebaseUserToPageUser(firebaseUser)
      const fallbackUser = createUnifiedUser(user, null)
      setUser(fallbackUser)
    }
  }

  useEffect(() => {
    console.log('🔧 Configurando listener de autenticación...')
    
    const unsubscribe = onAuthStateChanged(async (firebaseUser: User | null) => {
      console.log('🔔 Estado de autenticación cambió:', firebaseUser ? 'Logueado' : 'Deslogueado')
      
      if (firebaseUser) {
        console.log('👤 Usuario Firebase:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        })
        
        await syncCompleteUser(firebaseUser)
      } else {
        console.log('🚪 Limpiando usuario...')
        setUser(null)
      }

      console.log('⏰ Completando inicialización...')
      setLoading(false)
      setIsUserInitialized(true)
    })

    return () => {
      console.log('🧹 Limpiando listener')
      unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut()
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = useMemo(() => ({
    user,
    loading,
    isUserInitialized,
    signOut,
  }), [user, loading, isUserInitialized])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
