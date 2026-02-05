import { NextResponse } from 'next/server';

// Bounties API - placeholder until bounty tracking is added to Neon
export async function GET() {
  try {
    // Return placeholder data for now
    const bounties = [];
    const cveResearch = [];
    const stats = { 
      totalAvailable: 0, 
      totalEarned: 0, 
      activeSubmissions: 0, 
      successRate: 0,
      message: 'Bounty tracking coming soon'
    };

    return NextResponse.json({
      bounties,
      cveResearch,
      stats,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    // SECURITY: Log detailed error server-side, return generic message to client
    console.error('Bounties API error:', error);
    return NextResponse.json({ error: 'An error occurred while fetching bounty data', bounties: [], cveResearch: [], stats: {} }, { status: 500 });
  }
}
