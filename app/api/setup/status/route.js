import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

// Check if the dashboard is properly configured
export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ 
        configured: false, 
        reason: 'no_database',
        message: 'DATABASE_URL not set' 
      });
    }

    // Try to connect to the database
    const sql = neon(process.env.DATABASE_URL);
    
    // Check if settings table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'settings'
    `;

    if (tables.length === 0) {
      return NextResponse.json({ 
        configured: false, 
        reason: 'no_tables',
        message: 'Database tables not created' 
      });
    }

    // All good!
    return NextResponse.json({ 
      configured: true,
      message: 'Dashboard is configured' 
    });

  } catch (error) {
    return NextResponse.json({ 
      configured: false, 
      reason: 'connection_error',
      message: error.message 
    });
  }
}
