"use client"

import type React from "react"
import { AppHeader } from "@/components/AppHeader"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarInset } from "@/components/ui/sidebar"

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  showBackButton?: boolean
  backHref?: string
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, showBackButton = true, backHref }) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset className="flex-1">
        <AppHeader title={title} showBackButton={showBackButton} backHref={backHref} />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </SidebarInset>
    </div>
  )
}
