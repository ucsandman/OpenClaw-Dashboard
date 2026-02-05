import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    // Get upcoming calendar events from Neon
    const events = await sql`
      SELECT id, summary, start_time, end_time, location, description 
      FROM calendar_events 
      WHERE start_time >= NOW() - INTERVAL '1 hour'
      ORDER BY start_time 
      LIMIT 10
    `;
    
    return NextResponse.json({
      events: events || [],
      lastUpdated: new Date().toISOString(),
      count: events?.length || 0
    });
  } catch (error) {
    // SECURITY: Log detailed error server-side, return generic message to client
    console.error('Calendar API error:', error);
    return NextResponse.json({
      events: [],
      error: 'An error occurred while fetching calendar data',
      lastUpdated: new Date().toISOString()
    }, { status: 500 });
  }
}
