"use client"

import Image from "next/image"
import type React from "react"
import { User as UserIcon } from "lucide-react"

interface UserAvatarProps {
  pageUser: {
    photoURL?: string | null
    displayName?: string | null
    email?: string | null
  } | null
  size?: number
  className?: string
  showPlaceholder?: boolean
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  pageUser, 
  size = 32, 
  className = "",
  showPlaceholder = true 
}) => {
  const baseClasses = `rounded-full ${className}`
  
  // Si hay usuario y tiene foto
  if (pageUser?.photoURL) {
    return (
      <Image 
        src={pageUser.photoURL} 
        alt={pageUser.displayName || pageUser.email || "Avatar"} 
        width={size}
        height={size}
        className={`${baseClasses} object-cover`}
      />
    )
  }
  
  // Si hay usuario pero no tiene foto, mostrar iniciales
  if (pageUser && !pageUser.photoURL) {
    const initials = pageUser.displayName 
      ? pageUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
      : pageUser.email?.charAt(0).toUpperCase() || '?'
    
    return (
      <div 
        className={`${baseClasses} bg-blue-500 text-white flex items-center justify-center text-sm font-medium`}
        style={{ width: size, height: size }}
      >
        {initials}
      </div>
    )
  }
  
  // Placeholder cuando no hay usuario o está cargando
  if (showPlaceholder) {
    return (
      <div 
        className={`${baseClasses} bg-gray-200 text-gray-400 flex items-center justify-center animate-pulse`}
        style={{ width: size, height: size }}
      >
        <UserIcon size={size * 0.6} />
      </div>
    )
  }
  
  return null
}
