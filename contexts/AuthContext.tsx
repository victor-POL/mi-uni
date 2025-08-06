'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from '@/lib/firebase/auth'
import type { PageUser } from '@/models/user.model'
import type { UnifiedUser } from '@/models/unified-user.model'
import { mapFirebaseUserToPageUser } from '@/utils/user.util'
import { createUnifiedUser } from '@/models/unified-user.model'

interface AuthContextType {
  user: UnifiedUser | null // Usuario unificado
  loading: boolean
  isUserInitialized: boolean
  isLoggedIn: boolean // Nueva propiedad calculada
  userId: number | undefined // ID del usuario para API calls
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isUserInitialized: false,
  isLoggedIn: false,
  userId: undefined,
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

      // Determinar el tipo de proveedor
      const providerData = firebaseUser.providerData[0]
      const isGitHubProvider = providerData?.providerId === 'github.com'

      let response: Response | undefined
      let dbUser = null

      if (isGitHubProvider) {
        // Extraer información para la API de GitHub
        const githubData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          login: firebaseUser.email?.split('@')[0] || '',
          avatar_url: firebaseUser.photoURL || undefined,
        }

        // Sincronizar con base de datos como GitHub
        response = await fetch('/api/auth/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ githubData }),
        })
      } else {
        // Es email/password - extraer información para la API
        const emailPasswordData = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        }

        // Sincronizar con base de datos como Email/Password
        response = await fetch('/api/auth/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailPasswordData }),
        })
      }

      if (response?.ok) {
        const result = await response.json()
        if (result.success) {
          dbUser = result.data.user
          console.log('✅ Usuario sincronizado con BD:', dbUser)
        }
      }

      // Crear usuario unificado
      const providerType = isGitHubProvider ? 'github.com' : 'password'
      const unifiedUser = createUnifiedUser(user, dbUser, providerType)
      setUser(unifiedUser)
    } catch (error) {
      console.error('💥 Error sincronizando usuario:', error)

      // En caso de error, crear usuario solo con datos de Firebase
      const user: PageUser = mapFirebaseUserToPageUser(firebaseUser)
      const fallbackUser = createUnifiedUser(user, null, 'unknown')
      setUser(fallbackUser)
    }
  }

  useEffect(() => {
    console.log('🔧 1.Configurando listener de autenticación...')

    const unsubscribe = onAuthStateChanged(async (firebaseUser: User | null) => {
      console.log('🔔 1. Estado de autenticación cambió:', firebaseUser ? 'Logueado' : 'Deslogueado')

      if (firebaseUser) {
        console.log('👤 2. Usuario Firebase:', {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        })

        await syncCompleteUser(firebaseUser)
      } else {
        console.log('🚪 2. Limpiando usuario...')
        setUser(null)
      }

      console.log('⏰ 3. Completando inicialización...')
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

  const value = useMemo(() => {
    const isLoggedIn = user !== null && isUserInitialized
    const userId = isLoggedIn && user?.dbId && user.dbId > 0 ? user.dbId : undefined

    return {
      user,
      loading,
      isUserInitialized,
      isLoggedIn,
      userId,
      signOut,
    }
  }, [user, loading, isUserInitialized])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
