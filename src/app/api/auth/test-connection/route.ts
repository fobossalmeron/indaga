import { NextRequest } from 'next/server'
import { Pool } from 'pg'

export async function GET(request: NextRequest) {
    try {
        const vercelDbUrl = process.env.VERCELDB__POSTGRES_URL
        const databaseUrl = process.env.DATABASE_URL

        if (!vercelDbUrl && !databaseUrl) {
            return Response.json({
                error: 'No database URL configured',
                success: false
            }, { status: 500 })
        }

        const pool = new Pool({
            connectionString: vercelDbUrl || databaseUrl,
            ssl: {
                rejectUnauthorized: false,
            },
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 20,
        })

        const client = await pool.connect()
        const result = await client.query('SELECT NOW() as current_time, version() as db_version')
        client.release()
        await pool.end()

        return Response.json({
            success: true,
            message: 'Database connection successful',
            data: {
                currentTime: result.rows[0].current_time,
                dbVersion: result.rows[0].db_version
            }
        })

    } catch (error) {
        console.error('Database connection test failed:', error)
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            code: error instanceof Error && 'code' in error ? (error as any).code : undefined
        }, { status: 500 })
    }
} 