import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

/**
 * Health check endpoint for MoltFire Dashboard
 * Returns system health status for monitoring
 */
export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    checks: {}
  };

  // Check database connection
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`SELECT 1 as health_check`;
    health.checks.database = { status: 'healthy', latency: 'ok' };
  } catch (error) {
    health.status = 'degraded';
    health.checks.database = { status: 'unhealthy', error: 'Connection failed' };
  }

  // Check environment variables
  const requiredEnvVars = ['DATABASE_URL'];
  const missingVars = requiredEnvVars.filter(v => !process.env[v]);

  if (missingVars.length > 0) {
    health.status = 'degraded';
    health.checks.environment = {
      status: 'unhealthy',
      missing: missingVars.length
    };
  } else {
    health.checks.environment = { status: 'healthy' };
  }

  // Check if API key auth is configured
  health.checks.authentication = {
    status: process.env.DASHBOARD_API_KEY ? 'configured' : 'not_configured',
    warning: !process.env.DASHBOARD_API_KEY ? 'API endpoints are unprotected - set DASHBOARD_API_KEY' : null
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
