"use client"

import type React from 'react'
import { AppHeader } from '@/components/AppHeader'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title,
  showBackButton = true,
  backHref
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title={title}
        showBackButton={showBackButton}
        backHref={backHref}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
