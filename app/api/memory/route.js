import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    // Get latest health snapshot
    const healthSnapshot = await sql`
      SELECT * FROM health_snapshots 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;

    // Get health history (last 7 snapshots)
    const healthHistory = await sql`
      SELECT timestamp, health_score, total_lines, potential_duplicates, stale_facts_count
      FROM health_snapshots 
      ORDER BY timestamp DESC 
      LIMIT 7
    `;

    // Get top entities
    const topEntities = await sql`
      SELECT name, type, mention_count 
      FROM entities 
      ORDER BY mention_count DESC 
      LIMIT 20
    `;

    // Get topics
    const topics = await sql`
      SELECT name, mention_count 
      FROM topics 
      ORDER BY mention_count DESC
    `;

    // Get entity type breakdown
    const entityTypes = await sql`
      SELECT type, COUNT(*) as count, SUM(mention_count) as total_mentions
      FROM entities
      GROUP BY type
      ORDER BY total_mentions DESC
    `;

    const health = healthSnapshot[0] || null;

    return NextResponse.json({
      health: health ? {
        score: health.health_score,
        totalFiles: health.total_files,
        totalLines: health.total_lines,
        totalSizeKb: health.total_size_kb,
        memoryMdLines: health.memory_md_lines,
        oldestDaily: health.oldest_daily_file,
        newestDaily: health.newest_daily_file,
        daysWithNotes: health.days_with_notes,
        avgLinesPerDay: health.avg_lines_per_day,
        duplicates: health.potential_duplicates,
        staleCount: health.stale_facts_count,
        updatedAt: health.timestamp
      } : null,
      healthHistory: healthHistory.map(h => ({
        timestamp: h.timestamp,
        score: h.health_score,
        lines: h.total_lines,
        duplicates: h.potential_duplicates,
        stale: h.stale_facts_count
      })),
      entities: topEntities.map(e => ({
        name: e.name,
        type: e.type,
        mentions: e.mention_count
      })),
      topics: topics.map(t => ({
        name: t.name,
        mentions: t.mention_count
      })),
      entityBreakdown: entityTypes.map(e => ({
        type: e.type,
        count: e.count,
        totalMentions: e.total_mentions
      })),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // SECURITY: Log detailed error server-side, return generic message to client
    console.error('Memory API error:', error);
    return NextResponse.json({
      health: null,
      healthHistory: [],
      entities: [],
      topics: [],
      entityBreakdown: [],
      lastUpdated: new Date().toISOString(),
      error: 'An error occurred while fetching memory data'
    }, { status: 500 });
  }
}
