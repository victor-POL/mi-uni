import { Pool } from 'pg'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE_UNI,
  password: process.env.PGPASSWORD,
  port: 5432,
  max: 20, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: true,
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
