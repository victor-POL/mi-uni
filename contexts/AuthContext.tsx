"use client"

import type React from 'react'
import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut as firebaseSignOut } from '@/lib/firebase/auth'
import type { PageUser, UserFirebase } from '@/models/user.model'
import { mapFirebaseUserToPageUser } from '@/utils/user.util'

interface AuthContextType {
  pageUser: PageUser | null
  loading: boolean
  isUserInitialized: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  pageUser: null,
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
  const [pageUser, setPageUser] = useState<PageUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUserInitialized, setIsUserInitialized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser: User | null) => {
      if (pageUser) {
        const pageUser: PageUser = mapFirebaseUserToPageUser(firebaseUser as UserFirebase)
        setPageUser(pageUser)
      } else {
        setPageUser(null)
      }

      setLoading(false)
      setIsUserInitialized(true)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    try {
      await firebaseSignOut()
      setPageUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = useMemo(() => ({
    pageUser,
    loading,
    isUserInitialized,
    signOut,
  }), [pageUser, loading, isUserInitialized])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
