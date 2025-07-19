"use client"

import type React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  Home, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  User,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { UserAvatar } from '@/components/UserAvatar'
import { useState } from 'react'

interface AppHeaderProps {
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title = "Sistema de Gestión Académica", 
  showBackButton = true,
  backHref
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isInitialized, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  const navigationItems = [
    {
      name: 'Inicio',
      href: '/',
      icon: Home,
      public: true
    },
    {
      name: 'Planes de Estudio',
      href: '/planes-estudio',
      icon: GraduationCap,
      public: true
    },
    {
      name: 'Oferta de Materias',
      href: '/oferta-materias',
      icon: Calendar,
      public: true
    },
    {
      name: 'Mis Carreras',
      href: '/mis-carreras',
      icon: User,
      public: false
    },
    {
      name: 'Materias en Curso',
      href: '/materias-en-curso',
      icon: BookOpen,
      public: false
    }
  ]

  const visibleNavItems = navigationItems.filter(item => 
    item.public || (isInitialized && user)
  )

  const renderUserSection = () => {
    if (!isInitialized) {
      return (
        <div className="flex items-center gap-3">
          <div className="text-right animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <UserAvatar user={null} showPlaceholder={true} size={32} />
        </div>
      )
    }

    if (user) {
      return (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user.displayName || user.email}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
          <UserAvatar user={user} size={32} />
          <Button 
            variant="outline" 
            onClick={signOut}
            className="hidden sm:flex bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
            size="sm"
          >
            Cerrar Sesión
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="outline" size="sm">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button size="sm">
            Registrarse
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {showBackButton && pathname !== '/' && (
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* User section - hidden on mobile */}
              <div className="hidden md:block">
                {renderUserSection()}
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              {/* Navigation items */}
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}

              {/* User section for mobile */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <UserAvatar user={user} size={32} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        signOut()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full"
                      size="sm"
                    >
                      Cerrar Sesión
                    </Button>
                  </div>
                ) : isInitialized ? (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full" size="sm">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full" size="sm">
                        Registrarse
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2 animate-pulse">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
