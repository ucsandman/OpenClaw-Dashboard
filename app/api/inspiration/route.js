import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    // Get all ideas
    const ideas = await sql`SELECT * FROM ideas ORDER BY captured_at DESC LIMIT 50`;

    // Calculate stats
    const pending = ideas.filter(i => i.status === 'pending').length;
    const shipped = ideas.filter(i => i.status === 'shipped').length;
    const avgScore = ideas.length > 0 
      ? Math.round(ideas.reduce((sum, i) => sum + (i.score || 0), 0) / ideas.length)
      : 0;

    const stats = {
      totalIdeas: ideas.length,
      pending,
      shipped,
      avgScore,
      topIdeas: ideas.filter(i => i.score >= 70).length
    };

    return NextResponse.json({
      ideas,
      stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // SECURITY: Log detailed error server-side, return generic message to client
    console.error('Inspiration API error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching inspiration data', ideas: [], stats: {} }, { status: 500 });
  }
}
