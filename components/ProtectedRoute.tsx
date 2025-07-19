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
  const { pageUser, isUserInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isUserInitialized && !pageUser) {
      router.push('/login')
    }
  }, [isUserInitialized, pageUser, router])

  if (!isUserInitialized) {
    return <>{fallback}</>
  }

  if (!pageUser) {
    return null
  }

  return <>{children}</>
}

// Hook para verificar si el usuario está autenticado
export const useRequireAuth = () => {
  const { pageUser, isUserInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isUserInitialized && !pageUser) {
      router.replace('/login')
    }
  }, [isUserInitialized, pageUser, router])

  return { pageUser, loading: !isUserInitialized }
}

// Hook para redirigir usuarios autenticados
export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const { pageUser, isUserInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isUserInitialized && pageUser) {
      router.replace(redirectTo)
    }
  }, [isUserInitialized, pageUser, router, redirectTo])

  return { pageUser, loading: !isUserInitialized }
}
