import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

// POST - Test a connection with provided credentials
export async function POST(request) {
  try {
    const body = await request.json();
    const { integration, credentials } = body;
    
    switch (integration) {
      case 'neon':
        return await testNeon(credentials);
      case 'notion':
        return await testNotion(credentials);
      case 'github':
        return await testGitHub(credentials);
      case 'openai':
        return await testOpenAI(credentials);
      case 'anthropic':
        return await testAnthropic(credentials);
      case 'brave':
        return await testBrave(credentials);
      case 'elevenlabs':
        return await testElevenLabs(credentials);
      default:
        // Generic "has value" test for integrations without specific test endpoints
        const hasValues = Object.values(credentials || {}).some(v => v && v.length > 0);
        if (hasValues) {
          return NextResponse.json({ 
            success: true, 
            message: 'Credentials saved (connection not verified)' 
          });
        }
        return NextResponse.json({ 
          success: false, 
          message: 'Please enter credentials' 
        });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

async function testNeon(credentials) {
  try {
    const sql = neon(credentials.DATABASE_URL);
    await sql`SELECT 1 as test`;
    return NextResponse.json({ success: true, message: 'Database connection successful!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: `Database error: ${error.message}` });
  }
}

async function testNotion(credentials) {
  try {
    const res = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${credentials.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, message: `Connected as ${data.name || 'Notion user'}` });
    }
    return NextResponse.json({ success: false, message: 'Invalid Notion API key' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

async function testGitHub(credentials) {
  try {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${credentials.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, message: `Connected as @${data.login}` });
    }
    return NextResponse.json({ success: false, message: 'Invalid GitHub token' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

async function testOpenAI(credentials) {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${credentials.OPENAI_API_KEY}` }
    });
    if (res.ok) {
      return NextResponse.json({ success: true, message: 'OpenAI API key valid!' });
    }
    return NextResponse.json({ success: false, message: 'Invalid OpenAI API key' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

async function testAnthropic(credentials) {
  try {
    // Anthropic doesn't have a simple auth check endpoint, so we just verify format
    if (credentials.ANTHROPIC_API_KEY?.startsWith('sk-ant-')) {
      return NextResponse.json({ success: true, message: 'API key format valid' });
    }
    return NextResponse.json({ success: false, message: 'Invalid API key format (should start with sk-ant-)' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

async function testBrave(credentials) {
  try {
    const res = await fetch('https://api.search.brave.com/res/v1/web/search?q=test', {
      headers: { 'X-Subscription-Token': credentials.BRAVE_API_KEY }
    });
    if (res.ok) {
      return NextResponse.json({ success: true, message: 'Brave Search API connected!' });
    }
    return NextResponse.json({ success: false, message: 'Invalid Brave API key' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}

async function testElevenLabs(credentials) {
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 'xi-api-key': credentials.ELEVENLABS_API_KEY }
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ success: true, message: `Connected! ${data.subscription?.character_count || 0} chars remaining` });
    }
    return NextResponse.json({ success: false, message: 'Invalid ElevenLabs API key' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
