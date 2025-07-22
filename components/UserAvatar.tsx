"use client"

import Image from "next/image"
import type React from "react"
import { User as UserIcon } from "lucide-react"

interface UserAvatarProps {
  user: {
    firebasePhotoURL?: string | null
    firebaseDisplayName?: string | null
    nombre?: string | null
    apellido?: string | null
    email?: string | null
  } | null
  size?: number
  className?: string
  showPlaceholder?: boolean
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 32, 
  className = "",
  showPlaceholder = true 
}) => {
  const baseClasses = `rounded-full ${className}`
  
  // Si hay usuario y tiene foto
  if (user?.firebasePhotoURL) {
    return (
      <Image 
        src={user.firebasePhotoURL} 
        alt={user.firebaseDisplayName || user.nombre || user.email || "Avatar"} 
        width={size}
        height={size}
        className={`${baseClasses} object-cover`}
      />
    )
  }
  
  // Si hay usuario pero no tiene foto, mostrar iniciales
  if (user && !user.firebasePhotoURL) {
    const displayName = user.firebaseDisplayName || `${user.nombre || ''} ${user.apellido || ''}`.trim()
    const initials = displayName 
      ? displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
      : user.email?.charAt(0).toUpperCase() || '?'
    
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
