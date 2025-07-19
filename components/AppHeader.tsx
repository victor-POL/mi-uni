"use client"

import type React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { UserAvatar } from "@/components/UserAvatar"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

interface AppHeaderProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = "-", showBackButton = true, backHref }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { pageUser, isUserInitialized } = useAuth()
  const { state, isMobile, openMobile } = useSidebar()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  // Determinar si la sidebar está visible
  const isSidebarVisible = isMobile ? openMobile : state === "expanded"

  const renderUserSection = () => {
    if (!isUserInitialized) {
      return (
        <div className="flex items-center gap-3">
          <div className="text-right animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <UserAvatar pageUser={null} showPlaceholder={true} size={32} />
        </div>
      )
    }

    if (pageUser) {
      // Si la sidebar está visible, solo mostrar el avatar
      if (isSidebarVisible) {
        return <UserAvatar pageUser={pageUser} size={32} />
      }
      
      // Si la sidebar no está visible, mostrar información completa
      return (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{pageUser.displayName || pageUser.email}</p>
            <p className="text-xs text-gray-500">{pageUser.email}</p>
          </div>
          <UserAvatar pageUser={pageUser} size={32} />
        </div>
      )
    }

    // Si no hay usuario y la sidebar está visible, no mostrar nada
    if (isSidebarVisible) {
      return null
    }

    // Si no hay usuario y la sidebar no está visible, mostrar botones de autenticación
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">Registrarse</Button>
        </Link>
      </div>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            {showBackButton && pathname !== "/" && (
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          </div>

          {/* Right side - solo UserAvatar cuando sidebar está visible */}
          <div className="flex items-center gap-3">
            {renderUserSection()}
          </div>
        </div>
      </div>
    </header>
  )
}
