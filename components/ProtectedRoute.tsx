"use client"

import type React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingPage } from '@/components/ui/loading-spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <LoadingPage text="Verificando autenticación..." variant="dots" />
}) => {
  const { user, isUserInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isUserInitialized && !user) {
      router.push('/login')
    }
  }, [isUserInitialized, user, router])

  if (!isUserInitialized) {
    return <>{fallback}</>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

// Hook para redirigir usuarios autenticados
export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const { user, isUserInitialized } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isUserInitialized && user) {
      router.replace(redirectTo)
    }
  }, [isUserInitialized, user, router, redirectTo])

  return { user, loading: !isUserInitialized }
}
