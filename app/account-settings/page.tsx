'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getSignInMethodsForEmail, linkEmailPassword } from '@/lib/firebase/auth'
import { auth } from '@/lib/firebase/clientApp'
import { linkWithPopup, GithubAuthProvider } from 'firebase/auth'

export default function AccountSettingsPage() {
  const { user } = useAuth()
  const [signInMethods, setSignInMethods] = useState<string[]>([])
  const [loading, setLoading] = useState('')
  const [result, setResult] = useState('')
  const [passwordForLink, setPasswordForLink] = useState('')

  useEffect(() => {
    if (user?.firebaseEmail) {
      loadSignInMethods()
    }
  }, [user])

  const loadSignInMethods = async () => {
    if (!user?.firebaseEmail) return
    
    try {
      const methods = await getSignInMethodsForEmail("correovictor5@gmail.com")

      setSignInMethods(methods)
    } catch (error) {
      console.error('Error loading sign in methods:', error)
    }
  }

  const handleLinkEmailPassword = async () => {
    if (!passwordForLink) {
      setResult('❌ Por favor ingresa una contraseña')
      return
    }

    if (!user?.firebaseEmail) {
      setResult('❌ No se pudo obtener el email del usuario actual')
      return
    }

    try {
      setLoading('email')
      setResult('')
      
      // Usar el email del usuario actual, no el del formulario
      await linkEmailPassword(user.firebaseEmail, passwordForLink)
      setResult('✅ Email/Password vinculado exitosamente')
      
      // Recargar métodos
      await loadSignInMethods()
      
      // Limpiar campo de contraseña
      setPasswordForLink('')
      
    } catch (error) {
      console.error('Error linking email/password:', error)
      let errorMessage = 'Error al vincular email/password'
      
      if (error instanceof Error) {
        if (error.message.includes('credential-already-in-use')) {
          errorMessage = 'Este email ya está vinculado a otra cuenta'
        } else if (error.message.includes('provider-already-linked')) {
          errorMessage = 'Ya tienes email/password vinculado'
        } else if (error.message.includes('weak-password')) {
          errorMessage = 'La contraseña es muy débil. Usa al menos 6 caracteres'
        } else {
          errorMessage = error.message
        }
      }
      
      setResult(`❌ ${errorMessage}`)
    } finally {
      setLoading('')
    }
  }

  const handleLinkGitHub = async () => {
    try {
      setLoading('github')
      setResult('')
      
      const provider = new GithubAuthProvider()
      const currentUser = auth.currentUser
      
      if (!currentUser) {
        throw new Error('No hay usuario autenticado')
      }
      
      await linkWithPopup(currentUser, provider)
      setResult('✅ GitHub vinculado exitosamente')
      
      // Recargar métodos
      await loadSignInMethods()
      
    } catch (error) {
      console.error('Error linking GitHub:', error)
      let errorMessage = 'Error al vincular GitHub'
      
      if (error instanceof Error) {
        if (error.message.includes('credential-already-in-use')) {
          errorMessage = 'Esta cuenta de GitHub ya está vinculada a otra cuenta'
        } else if (error.message.includes('provider-already-linked')) {
          errorMessage = 'Ya tienes GitHub vinculado'
        } else {
          errorMessage = error.message
        }
      }
      
      setResult(`❌ ${errorMessage}`)
    } finally {
      setLoading('')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Por favor inicia sesión para ver la configuración de cuenta</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Configuración de Cuenta</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Información actual */}
          <Card>
            <CardHeader>
              <CardTitle>Información Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <p className="text-sm font-medium">{user.firebaseEmail}</p>
              </div>
              
              <div>
                <Label>Nombre</Label>
                <p className="text-sm font-medium">{user.firebaseDisplayName || 'No configurado'}</p>
              </div>
              
              <div>
                <Label>Proveedor Actual</Label>
                <Badge variant={user.authProvider === 'github.com' ? 'default' : 'secondary'}>
                  {user.authProvider === 'github.com' ? 'GitHub' : 'Email/Password'}
                </Badge>
              </div>
              
              <Separator />
              
              <div>
                <Label>Métodos de Autenticación Disponibles</Label>
                <div className="flex gap-2 mt-2">
                  {signInMethods.length > 0 ? (
                    signInMethods.map((method) => {
                      let displayName = method
                      if (method === 'github.com') {
                        displayName = 'GitHub'
                      } else if (method === 'password') {
                        displayName = 'Email/Password'
                      }
                      
                      return (
                        <Badge key={method} variant="outline">
                          {displayName}
                        </Badge>
                      )
                    })
                  ) : (
                    <p className="text-sm text-gray-500">Cargando...</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vincular métodos */}
          <Card>
            <CardHeader>
              <CardTitle>Vincular Métodos de Autenticación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vincular Email/Password */}
              {!signInMethods.includes('password') && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Vincular Email/Password</h4>
                  <p className="text-sm text-gray-600">
                    Se vinculará email/password a tu cuenta actual usando el mismo email.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="email-link">Email (actual)</Label>
                    <Input
                      id="email-link"
                      type="email"
                      value={user?.firebaseEmail || ''}
                      readOnly
                      disabled
                      className="bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500">
                      El email no se puede cambiar al vincular métodos de autenticación
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-link">Nueva Contraseña</Label>
                    <Input
                      id="password-link"
                      type="password"
                      value={passwordForLink}
                      onChange={(e) => setPasswordForLink(e.target.value)}
                      placeholder="Ingresa una contraseña segura"
                    />
                  </div>
                  <Button 
                    onClick={handleLinkEmailPassword}
                    disabled={!!loading || !passwordForLink}
                    className="w-full"
                  >
                    {loading === 'email' ? 'Vinculando...' : 'Vincular Email/Password'}
                  </Button>
                </div>
              )}

              {/* Vincular GitHub */}
              {!signInMethods.includes('github.com') && (
                <div className="space-y-4">
                  {signInMethods.includes('password') && <Separator />}
                  <h4 className="font-semibold">Vincular GitHub</h4>
                  <p className="text-sm text-gray-600">
                    Vincula tu cuenta de GitHub para poder usar ambos métodos de autenticación.
                  </p>
                  <Button 
                    onClick={handleLinkGitHub}
                    disabled={!!loading}
                    className="w-full bg-gray-900 hover:bg-gray-800"
                  >
                    {loading === 'github' ? 'Vinculando...' : 'Vincular GitHub'}
                  </Button>
                </div>
              )}

              {/* Resultado */}
              {result && (
                <div className={`p-3 rounded-md text-sm ${
                  result.includes('✅') 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {result}
                </div>
              )}

              {/* Mensaje si ya están todos vinculados */}
              {signInMethods.includes('password') && signInMethods.includes('github.com') && (
                <div className="text-center py-4">
                  <p className="text-green-600 font-medium">✅ Tienes todos los métodos de autenticación disponibles</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Puedes iniciar sesión con email/password o con GitHub
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
