import { query } from '@/connection'

// Tipos para el usuario
export interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  creado_at: Date
}

export interface UsuarioAutenticacion {
  usuario_id: number
  tipo_autenticacion: 'github' | 'google' | 'facebook' | 'twitter' | 'microsoft' | 'ldap' | 'local'
  external_id: string
  datos_extra?: any
  creado_at: Date
}

export interface GitHubUserData {
  id: string
  email: string
  name: string
  login: string
  avatar_url?: string
}

export interface EmailPasswordUserData {
  id: string // Firebase UID
  email: string
  displayName?: string
  photoURL?: string
}

export interface AuthUserData {
  id: string
  email: string
  name?: string
  provider: 'github' | 'email'
  providerData?: any
}

/**
 * Busca un usuario por su ID externo de GitHub
 */
export async function findUserByGitHubId(githubId: string): Promise<Usuario | null> {
  try {
    await query(`SET search_path = prod, public`)
    
    const result = await query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.creado_at
      FROM prod.usuario u
      JOIN prod.usuario_autenticacion ua ON u.id = ua.usuario_id
      WHERE ua.tipo_autenticacion = 'github' 
        AND ua.external_id = $1
    `, [githubId])

    if( result.rows.length === 0 ) {
      return null
    }

    return result.rows[0] as unknown as Usuario
  } catch (error) {
    console.error('Database error finding user by GitHub ID:', error)
    throw error
  }
}

/**
 * Busca un usuario por su Firebase UID
 */
export async function findUserByFirebaseId(firebaseId: string): Promise<Usuario | null> {
  try {
    await query(`SET search_path = prod, public`)
    
    const result = await query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellido,
        u.email,
        u.creado_at
      FROM prod.usuario u
      JOIN prod.usuario_autenticacion ua ON u.id = ua.usuario_id
      WHERE ua.tipo_autenticacion = 'email' 
        AND ua.external_id = $1
    `, [firebaseId])

    return result.rows.length > 0 ? result.rows[0] as unknown as Usuario: null

  } catch (error) {
    console.error('Database error finding user by Firebase ID:', error)
    throw error
  }
}

/**
 * Busca un usuario por email
 */
export async function findUserByEmail(email: string): Promise<Usuario | null> {
  try {
    await query(`SET search_path = prod, public`)
    
    const result = await query(`
      SELECT 
        id,
        nombre,
        apellido,
        email,
        creado_at
      FROM prod.usuario
      WHERE email = $1
    `, [email])

    return result.rows.length > 0 ? result.rows[0] as unknown as Usuario : null

  } catch (error) {
    console.error('Database error finding user by email:', error)
    throw error
  }
}

/**
 * Crea un nuevo usuario y su registro de autenticación GitHub
 */
export async function createUserWithGitHub(githubData: GitHubUserData): Promise<Usuario> {
  try {
    // Iniciar transacción para asegurar consistencia
    await query('BEGIN', [])
    await query(`SET search_path = prod, public`)

    // Parsear el nombre completo
    const fullName = githubData.name || githubData.login
    const nameParts = fullName.split(' ')
    const nombre = nameParts[0] || githubData.login
    const apellido = nameParts.slice(1).join(' ') || ''

    // 1. Crear el usuario
    const userResult = await query(`
      INSERT INTO prod.usuario (nombre, apellido, email)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, apellido, email, creado_at
    `, [nombre, apellido, githubData.email])

    const newUser = userResult.rows[0] as unknown as Usuario

    // 2. Crear el registro de autenticación
    await query(`
      INSERT INTO prod.usuario_autenticacion 
      (usuario_id, tipo_autenticacion, external_id, datos_extra)
      VALUES ($1, 'github', $2, $3)
    `, [
      newUser.id, 
      githubData.id, 
      JSON.stringify({
        login: githubData.login,
        avatar_url: githubData.avatar_url,
        name: githubData.name
      })
    ])

    await query('COMMIT')
    
    return newUser as unknown as Usuario

  } catch (error) {
    await query('ROLLBACK')
    console.error('Database error creating user with GitHub:', error)
    throw error
  }
}

/**
 * Crea un nuevo usuario y su registro de autenticación Email/Password
 */
export async function createUserWithEmailPassword(userData: EmailPasswordUserData): Promise<Usuario> {
  try {
    // Iniciar transacción para asegurar consistencia
    await query('BEGIN', [])
    await query(`SET search_path = prod, public`)

    // Parsear el nombre completo
    const fullName = userData.displayName || userData.email.split('@')[0]
    const nameParts = fullName.split(' ')
    const nombre = nameParts[0] || userData.email.split('@')[0]
    const apellido = nameParts.slice(1).join(' ') || ''

    // 1. Crear el usuario
    const userResult = await query(`
      INSERT INTO prod.usuario (nombre, apellido, email)
      VALUES ($1, $2, $3)
      RETURNING id, nombre, apellido, email, creado_at
    `, [nombre, apellido, userData.email])

    const newUser = userResult.rows[0] as unknown as Usuario

    // 2. Crear el registro de autenticación
    await query(`
      INSERT INTO prod.usuario_autenticacion 
      (usuario_id, tipo_autenticacion, external_id, datos_extra)
      VALUES ($1, 'email', $2, $3)
    `, [
      newUser.id, 
      userData.id, // Firebase UID
      JSON.stringify({
        displayName: userData.displayName,
        photoURL: userData.photoURL
      })
    ])

    await query('COMMIT')
    
    return newUser

  } catch (error) {
    await query('ROLLBACK')
    console.error('Database error creating user with Email/Password:', error)
    throw error
  }
}

/**
 * Actualiza los datos extra de autenticación GitHub (para sincronizar perfil)
 */
export async function updateGitHubAuthData(userId: number, githubData: GitHubUserData): Promise<void> {
  try {
    await query(`SET search_path = prod, public`)
    
    await query(`
      UPDATE prod.usuario_autenticacion 
      SET datos_extra = $1
      WHERE usuario_id = $2 AND tipo_autenticacion = 'github'
    `, [
      JSON.stringify({
        login: githubData.login,
        avatar_url: githubData.avatar_url,
        name: githubData.name
      }),
      userId
    ])

  } catch (error) {
    console.error('Database error updating GitHub auth data:', error)
    throw error
  }
}

/**
 * Función principal: Verificar o crear usuario de GitHub
 * Esta es la función que se llamará en cada login
 */
export async function verifyOrCreateGitHubUser(githubData: GitHubUserData): Promise<Usuario> {
  try {
    // 1. Buscar por GitHub ID primero
    let user = await findUserByGitHubId(githubData.id)
    
    if (user) {
      // Usuario existe, actualizar datos de GitHub por si cambiaron
      await updateGitHubAuthData(user.id, githubData)
      return user
    }

    // 2. Si no se encuentra por GitHub ID, buscar por email
    user = await findUserByEmail(githubData.email)
    
    if (user) {
      // Usuario existe con el mismo email pero sin GitHub, agregar GitHub auth
      await query(`SET search_path = prod, public`)
      await query(`
        INSERT INTO prod.usuario_autenticacion 
        (usuario_id, tipo_autenticacion, external_id, datos_extra)
        VALUES ($1, 'github', $2, $3)
        ON CONFLICT (tipo_autenticacion, external_id) DO UPDATE SET
          datos_extra = EXCLUDED.datos_extra
      `, [
        user.id, 
        githubData.id, 
        JSON.stringify({
          login: githubData.login,
          avatar_url: githubData.avatar_url,
          name: githubData.name
        })
      ])
      
      return user
    }

    // 3. Usuario no existe, crear nuevo
    return await createUserWithGitHub(githubData)

  } catch (error) {
    console.error('Error in verifyOrCreateGitHubUser:', error)
    throw error
  }
}

/**
 * Función principal: Verificar o crear usuario de Email/Password
 * Esta es la función que se llamará en cada login con email/password
 */
export async function verifyOrCreateEmailPasswordUser(userData: EmailPasswordUserData): Promise<Usuario> {
  try {
    // 1. Buscar por Firebase UID primero
    let user = await findUserByFirebaseId(userData.id)
    
    if (user) {
      return user
    }

    // 2. Si no se encuentra por Firebase UID, buscar por email
    user = await findUserByEmail(userData.email)
    
    if (user) {
      // Usuario existe con el mismo email pero sin Firebase auth, agregar Firebase auth
      await query(`SET search_path = prod, public`)
      await query(`
        INSERT INTO prod.usuario_autenticacion 
        (usuario_id, tipo_autenticacion, external_id, datos_extra)
        VALUES ($1, 'email', $2, $3)
        ON CONFLICT (tipo_autenticacion, external_id) DO UPDATE SET
          datos_extra = EXCLUDED.datos_extra
      `, [
        user.id, 
        userData.id, // Firebase UID
        JSON.stringify({
          displayName: userData.displayName,
          photoURL: userData.photoURL
        })
      ])
      
      return user
    }

    // 3. Usuario no existe, crear nuevo
    return await createUserWithEmailPassword(userData)

  } catch (error) {
    console.error('Error in verifyOrCreateEmailPasswordUser:', error)
    throw error
  }
}

/**
 * Obtener información completa del usuario incluyendo métodos de autenticación
 */
export async function getUserWithAuth(userId: number): Promise<Usuario & { auth_methods: UsuarioAutenticacion[] } | null> {
  try {
    await query(`SET search_path = prod, public`)
    
    // Obtener usuario
    const userResult = await query(`
      SELECT id, nombre, apellido, email, creado_at
      FROM prod.usuario
      WHERE id = $1
    `, [userId])

    if (userResult.rows.length === 0) {
      return null
    }

    const user = userResult.rows[0]

    // Obtener métodos de autenticación
    const authResult = await query(`
      SELECT 
        usuario_id,
        tipo_autenticacion,
        external_id,
        datos_extra,
        creado_at
      FROM prod.usuario_autenticacion
      WHERE usuario_id = $1
    `, [userId])

    return {
      ...user,
      auth_methods: authResult.rows
    }

  } catch (error) {
    console.error('Database error getting user with auth:', error)
    throw error
  }
}
