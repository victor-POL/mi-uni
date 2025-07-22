"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Calendar, GraduationCap, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { UserAvatar } from "@/components/UserAvatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export const AppSidebar: React.FC = () => {
  const pathname = usePathname()
  const { user, isUserInitialized, signOut } = useAuth()

  const publicItems = [
    {
      name: "Inicio",
      href: "/",
      icon: Home,
    },
    {
      name: "Planes de Estudio",
      href: "/planes-estudio",
      icon: GraduationCap,
    },
    {
      name: "Oferta de Materias",
      href: "/oferta-materias",
      icon: Calendar,
    },
  ]

  const privateItems = [
    {
      name: "Mis Carreras",
      href: "/mis-carreras",
      icon: User,
    },
    {
      name: "Materias en Curso",
      href: "/materias-en-curso",
      icon: BookOpen,
    },
  ]

  const devItems = [
    {
      name: "Test Auth Firebase",
      href: "/test-firebase-auth",
      icon: User,
    },
    {
      name: "Configuración Cuenta",
      href: "/account-settings",
      icon: User,
    },
  ]

  const renderUserSection = () => {
    if (!isUserInitialized) {
      return (
        <div className="flex items-center gap-3 p-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      )
    }

    if (user) {
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-2">
            <UserAvatar user={user} size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.firebaseDisplayName || user.nombre || user.email}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={signOut}
            className="w-full justify-start gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button className="w-full justify-start" size="sm">
            Registrarse
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Mi Universidad</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(() => {
          if (!isUserInitialized) {
            // Placeholder para operaciones privadas mientras se verifica la autenticación
            return (
              <>
                <SidebarSeparator />
                <SidebarGroup>
                  <SidebarGroupLabel>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )
          }
          
          if (user) {
            // Operaciones privadas para usuarios autenticados
            return (
              <>
                <SidebarSeparator />
                <SidebarGroup>
                  <SidebarGroupLabel>Mi Cuenta</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {privateItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={isActive}>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                  <SidebarGroupLabel>Desarrollo</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {devItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild isActive={isActive}>
                              <Link href={item.href}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            )
          }
          
          return null
        })()}
      </SidebarContent>

      <SidebarFooter>{renderUserSection()}</SidebarFooter>
    </Sidebar>
  )
}
