import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    // Get latest snapshot (real-time data)
    const latestSnapshot = await sql`
      SELECT * FROM token_snapshots 
      ORDER BY timestamp DESC 
      LIMIT 1
    `;

    // Get today's totals
    const today = new Date().toISOString().split('T')[0];
    const todayTotals = await sql`
      SELECT * FROM daily_totals 
      WHERE date = ${today}
    `;

    // Get 7-day history
    const history = await sql`
      SELECT * FROM daily_totals 
      ORDER BY date DESC 
      LIMIT 7
    `;

    // Get recent snapshots (last 24 hours for chart)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const recentSnapshots = await sql`
      SELECT timestamp, tokens_in, tokens_out, context_pct, hourly_pct_left, weekly_pct_left
      FROM token_snapshots 
      WHERE timestamp > ${yesterday}
      ORDER BY timestamp ASC
    `;

    const latest = latestSnapshot[0] || null;
    const todayData = todayTotals[0] || null;

    // Calculate cost estimates (Claude pricing)
    // Opus: $15/M input, $75/M output
    // Sonnet: $3/M input, $15/M output
    const estimateCost = (tokensIn, tokensOut, model = 'opus') => {
      if (model.includes('sonnet')) {
        return (tokensIn * 3 / 1000000) + (tokensOut * 15 / 1000000);
      }
      // Default to Opus pricing
      return (tokensIn * 15 / 1000000) + (tokensOut * 75 / 1000000);
    };

    return NextResponse.json({
      current: latest ? {
        tokensIn: latest.tokens_in,
        tokensOut: latest.tokens_out,
        contextUsed: latest.context_used,
        contextMax: latest.context_max,
        contextPct: latest.context_pct,
        hourlyPctLeft: latest.hourly_pct_left,
        weeklyPctLeft: latest.weekly_pct_left,
        hourlyUsed: 100 - (latest.hourly_pct_left || 0),
        weeklyUsed: 100 - (latest.weekly_pct_left || 0),
        compactions: latest.compactions,
        model: latest.model,
        session: latest.session_key,
        updatedAt: latest.timestamp
      } : null,
      today: todayData ? {
        date: todayData.date,
        tokensIn: todayData.total_tokens_in,
        tokensOut: todayData.total_tokens_out,
        totalTokens: todayData.total_tokens,
        peakContextPct: todayData.peak_context_pct,
        snapshots: todayData.snapshots_count,
        estimatedCost: estimateCost(todayData.total_tokens_in, todayData.total_tokens_out)
      } : null,
      history: history.map(day => ({
        date: day.date,
        tokensIn: day.total_tokens_in,
        tokensOut: day.total_tokens_out,
        totalTokens: day.total_tokens,
        peakContextPct: day.peak_context_pct,
        snapshots: day.snapshots_count,
        estimatedCost: estimateCost(day.total_tokens_in, day.total_tokens_out)
      })),
      timeline: recentSnapshots.map(s => ({
        time: s.timestamp,
        tokensIn: s.tokens_in,
        tokensOut: s.tokens_out,
        contextPct: s.context_pct,
        hourlyLeft: s.hourly_pct_left,
        weeklyLeft: s.weekly_pct_left
      })),
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // SECURITY: Log detailed error server-side, return generic message to client
    console.error('Tokens API error:', error);
    return NextResponse.json({
      current: null,
      today: null,
      history: [],
      timeline: [],
      lastUpdated: new Date().toISOString(),
      error: 'An error occurred while fetching token data'
    }, { status: 500 });
  }
}
