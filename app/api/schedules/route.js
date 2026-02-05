import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    // Get all scheduled jobs
    const schedules = await sql`SELECT * FROM scheduled_jobs ORDER BY next_run ASC NULLS LAST`;

    // Stats
    const now = new Date().toISOString();
    const stats = {
      totalJobs: schedules.length,
      enabledJobs: schedules.filter(s => s.enabled === 1).length,
      dueNow: schedules.filter(s => s.next_run && s.next_run <= now).length
    };

    return NextResponse.json({
      schedules,
      stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // SECURITY: Log detailed error server-side, return generic message to client
    console.error('Schedules API error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching schedules data', schedules: [], stats: {} }, { status: 500 });
  }
}
