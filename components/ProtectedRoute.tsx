"use client"

import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Cargando...</div> 
}) => {
  const { user, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login')
    }
  }, [isInitialized, user, router])

  if (!isInitialized) {
    return <>{fallback}</>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

// Hook para verificar si el usuario está autenticado
export const useRequireAuth = () => {
  const { user, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login')
    }
  }, [isInitialized, user, router])

  return { user, loading: !isInitialized }
}

// Hook para redirigir usuarios autenticados
export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const { user, isInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isInitialized && user) {
      router.push(redirectTo)
    }
  }, [isInitialized, user, router, redirectTo])

  return { user, loading: !isInitialized }
}
