import { Pool } from 'pg'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'mi_uni',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // máximo número de conexiones en el pool
  idleTimeoutMillis: 30000, // tiempo de inactividad antes de cerrar la conexión
  connectionTimeoutMillis: 10000, // tiempo de espera para conectar (aumentado)
  ssl: false // Explícitamente deshabilitar SSL para desarrollo local
})

// Log de configuración para debug
console.log('Database connection config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  hasPassword: !!process.env.DB_PASSWORD
})

// Función para ejecutar queries
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Función para obtener una conexión del pool (para transacciones)
export async function getClient() {
  return await pool.connect()
}

// Función para cerrar el pool (útil para testing o shutdown)
export async function closePool() {
  await pool.end()
}

export default pool
