import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

const sql = neon(process.env.DATABASE_URL);

// Initialize settings table if it doesn't exist
async function ensureSettingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      category TEXT DEFAULT 'general',
      encrypted BOOLEAN DEFAULT false,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// GET - Fetch all settings or specific key
export async function GET(request) {
  try {
    await ensureSettingsTable();
    
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const category = searchParams.get('category');
    
    let settings;
    if (key) {
      settings = await sql`SELECT * FROM settings WHERE key = ${key}`;
    } else if (category) {
      settings = await sql`SELECT * FROM settings WHERE category = ${category} ORDER BY key`;
    } else {
      settings = await sql`SELECT * FROM settings ORDER BY category, key`;
    }
    
    // Mask encrypted values for display
    const masked = settings.map(s => ({
      ...s,
      value: s.encrypted ? maskValue(s.value) : s.value,
      hasValue: !!s.value
    }));
    
    return NextResponse.json({ settings: masked });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create or update setting
export async function POST(request) {
  try {
    await ensureSettingsTable();
    
    const body = await request.json();
    const { key, value, category = 'general', encrypted = false } = body;
    
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    
    await sql`
      INSERT INTO settings (key, value, category, encrypted, updated_at)
      VALUES (${key}, ${value}, ${category}, ${encrypted}, NOW())
      ON CONFLICT (key) DO UPDATE SET
        value = ${value},
        category = ${category},
        encrypted = ${encrypted},
        updated_at = NOW()
    `;
    
    return NextResponse.json({ success: true, key });
  } catch (error) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove a setting
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    
    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 });
    }
    
    await sql`DELETE FROM settings WHERE key = ${key}`;
    
    return NextResponse.json({ success: true, deleted: key });
  } catch (error) {
    console.error('Settings DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to mask sensitive values
function maskValue(value) {
  if (!value) return '';
  if (value.length <= 8) return '••••••••';
  return value.substring(0, 4) + '••••••••' + value.substring(value.length - 4);
}
