# Provider de Autenticación para Mi-Uni

## Descripción

Se ha implementado un sistema completo de autenticación usando React Context para toda la aplicación. Esto permite acceder al estado de autenticación desde cualquier componente de la aplicación.

## Archivos creados

### 1. `contexts/AuthContext.tsx`
Provider principal que maneja el estado de autenticación de la aplicación:
- Estado del usuario (autenticado o no)
- Estado de carga
- Función para cerrar sesión
- Escucha cambios en el estado de autenticación de Firebase

### 2. `components/Providers.tsx`
Wrapper que incluye todos los providers de la aplicación, actualmente solo incluye AuthProvider.

### 3. `components/ProtectedRoute.tsx`
Componente y hooks para proteger rutas y manejar redirecciones:
- `ProtectedRoute`: Componente que protege rutas
- `useRequireAuth`: Hook para requerir autenticación
- `useRedirectIfAuthenticated`: Hook para redirigir usuarios ya autenticados

## Uso del Provider

### Hook useAuth
\`\`\`typescript
import { useAuth } from '@/contexts/AuthContext'

function MiComponente() {
  const { pageUser, loading, signOut } = useAuth()
  
  if (loading) return <div>Cargando...</div>
  
  return (
    <div>
      {pageUser ? (
        <div>
          <p>Bienvenido {pageUser.displayName || pageUser.email}</p>
          <button onClick={signOut}>Cerrar sesión</button>
        </div>
      ) : (
        <p>No autenticado</p>
      )}
    </div>
  )
}
\`\`\`

### Proteger rutas
\`\`\`typescript
import { ProtectedRoute } from '@/components/ProtectedRoute'

function PaginaProtegida() {
  return (
    <ProtectedRoute>
      <div>Contenido solo para usuarios autenticados</div>
    </ProtectedRoute>
  )
}
\`\`\`

### Hook para redirigir usuarios autenticados
\`\`\`typescript
import { useRedirectIfAuthenticated } from '@/components/ProtectedRoute'

function LoginPage() {
  // Redirige a "/" si el usuario ya está autenticado
  const { loading } = useRedirectIfAuthenticated()
  
  if (loading) return <div>Verificando...</div>
  
  return <div>Formulario de login</div>
}
\`\`\`

## Ejemplos implementados

1. **Página de Login** (`app/login/page.tsx`):
   - Usa `useRedirectIfAuthenticated` para redirigir usuarios ya autenticados
   - Muestra un spinner mientras verifica el estado de autenticación

2. **Página Principal** (`app/page.tsx`):
   - Muestra información del usuario cuando está autenticado
   - Permite cerrar sesión
   - Muestra botones de login/registro cuando no está autenticado

3. **Página Mis Carreras** (`app/mis-carreras/page.tsx`):
   - Envuelta con `ProtectedRoute` para requerir autenticación
   - Solo usuarios autenticados pueden acceder

## Configuración inicial

El provider ya está configurado en el layout principal (`app/layout.tsx`) para que esté disponible en toda la aplicación.

## Funcionalidades disponibles

- ✅ Autenticación con GitHub
- ✅ Estado global de usuario
- ✅ Protección de rutas
- ✅ Redirección automática
- ✅ Cierre de sesión
- ✅ Estados de carga
- ✅ Persistencia de sesión (Firebase maneja esto automáticamente)

## Próximos pasos sugeridos

1. Añadir autenticación con email/password
2. Implementar manejo de errores más robusto
3. Añadir roles y permisos
4. Implementar refresh de tokens si es necesario
5. Añadir más providers de autenticación (Google, etc.)
