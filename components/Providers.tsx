"use client"

import type React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </AuthProvider>
  )
}
