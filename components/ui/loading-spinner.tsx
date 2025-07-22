import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
  variant?: "default" | "dots" | "pulse"
}

export const LoadingSpinner = ({ 
  size = "md", 
  className, 
  text,
  variant = "default"
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg", 
    xl: "text-xl"
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className="flex space-x-1">
          <div className={cn("bg-blue-600 rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: "0ms" }}></div>
          <div className={cn("bg-blue-600 rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: "150ms" }}></div>
          <div className={cn("bg-blue-600 rounded-full animate-bounce", sizeClasses[size])} style={{ animationDelay: "300ms" }}></div>
        </div>
        {text && (
          <p className={cn("text-gray-600 animate-pulse", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <div className={cn("bg-blue-600 rounded-full animate-pulse", sizeClasses[size])}></div>
        {text && (
          <p className={cn("text-gray-600 animate-pulse", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    )
  }

  // Default spinner variant
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", sizeClasses[size])}></div>
      {text && (
        <p className={cn("text-gray-600", textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  )
}

// Componente de página completa de loading
export const LoadingPage = ({ 
  text = "Cargando...",
  size = "lg",
  variant = "default"
}: Pick<LoadingSpinnerProps, "text" | "size" | "variant">) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner 
        size={size}
        text={text}
        variant={variant}
        className="text-center"
      />
    </div>
  )
}

// Componente de loading inline
export const LoadingInline = ({ 
  text = "Cargando...",
  size = "sm",
  variant = "default"
}: Pick<LoadingSpinnerProps, "text" | "size" | "variant">) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <LoadingSpinner 
        size={size}
        text={text}
        variant={variant}
      />
    </div>
  )
}

// Componente de loading para botones
export const LoadingButton = ({ size = "sm" }: Pick<LoadingSpinnerProps, "size">) => {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-white", sizeClasses[size])}></div>
  )
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
}
