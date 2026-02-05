'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'mode', title: 'Choose Mode' },
  { id: 'database', title: 'Database' },
  { id: 'deploy', title: 'Deploy' },
  { id: 'complete', title: 'Complete' }
];

export default function SetupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('welcome');
  const [setupMode, setSetupMode] = useState(null); // 'quick' or 'full'
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(null);

  const goToStep = (step) => setCurrentStep(step);
  const nextStep = () => {
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1].id);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integration: 'neon',
          credentials: { DATABASE_URL: databaseUrl }
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, message: error.message });
    }
    setTesting(false);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const neonSchema = `-- Run this in your Neon SQL Editor
-- Creates all tables needed for OpenClaw Dashboard

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  category TEXT DEFAULT 'general',
  encrypted BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_snapshots (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT NOW(),
  tokens_in INTEGER,
  tokens_out INTEGER,
  model TEXT,
  session_key TEXT,
  daily_remaining TEXT,
  weekly_remaining TEXT
);

CREATE TABLE IF NOT EXISTS decisions (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  description TEXT,
  context TEXT,
  tags TEXT,
  outcome TEXT,
  outcome_date TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  lesson TEXT,
  confidence INTEGER,
  tags TEXT
);

CREATE TABLE IF NOT EXISTS ideas (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  title TEXT,
  description TEXT,
  tags TEXT,
  score INTEGER,
  status TEXT DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  name TEXT,
  platform TEXT,
  handle TEXT,
  status TEXT DEFAULT 'new',
  notes TEXT,
  next_followup DATE
);

CREATE TABLE IF NOT EXISTS interactions (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  created_at TIMESTAMP DEFAULT NOW(),
  type TEXT,
  direction TEXT,
  summary TEXT
);

CREATE TABLE IF NOT EXISTS goals (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  title TEXT,
  category TEXT,
  target_date DATE,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  event_id TEXT UNIQUE,
  title TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  location TEXT,
  description TEXT,
  synced_at TIMESTAMP DEFAULT NOW()
);`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, i) => (
              <div 
                key={step.id}
                className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  STEPS.findIndex(s => s.id === currentStep) >= i 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    STEPS.findIndex(s => s.id === currentStep) > i
                      ? 'bg-cyan-500'
                      : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 rounded-2xl">
          
          {/* Welcome */}
          {currentStep === 'welcome' && (
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to OpenClaw Dashboard</h1>
              <p className="text-gray-300 mb-8">
                Your AI agent's command center. Let's get you set up in under 5 minutes.
              </p>
              <button
                onClick={nextStep}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Let's Go →
              </button>
            </div>
          )}

          {/* Choose Mode */}
          {currentStep === 'mode' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">How do you want to use the dashboard?</h2>
              <p className="text-gray-400 mb-8">Choose based on your needs. You can upgrade anytime.</p>
              
              <div className="grid gap-4">
                <button
                  onClick={() => { setSetupMode('quick'); goToStep('complete'); }}
                  className="p-6 rounded-xl border-2 border-gray-700 hover:border-cyan-500 text-left transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">⚡</div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400">Quick Start (Try It Now)</h3>
                      <p className="text-gray-400 mt-1">Data stored in your browser. Perfect for trying it out.</p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">No signup</span>
                        <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded">Instant</span>
                        <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs rounded">Browser only</span>
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { setSetupMode('full'); nextStep(); }}
                  className="p-6 rounded-xl border-2 border-gray-700 hover:border-cyan-500 text-left transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">☁️</div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400">Full Setup (Recommended)</h3>
                      <p className="text-gray-400 mt-1">Cloud database + hosting. Access from anywhere, sync with your agent.</p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-1 bg-cyan-900 text-cyan-300 text-xs rounded">Cloud sync</span>
                        <span className="px-2 py-1 bg-cyan-900 text-cyan-300 text-xs rounded">Multi-device</span>
                        <span className="px-2 py-1 bg-cyan-900 text-cyan-300 text-xs rounded">5 min setup</span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Database Setup */}
          {currentStep === 'database' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Set Up Your Database</h2>
              <p className="text-gray-400 mb-6">We'll use Neon - a free serverless PostgreSQL database.</p>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">1</span>
                    <h3 className="font-bold text-white">Create a Neon Account (Free)</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Click below to open Neon. Sign up with GitHub or Google - takes 30 seconds.</p>
                  <a 
                    href="https://console.neon.tech/signup" 
                    target="_blank"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Open Neon Console →
                  </a>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">2</span>
                    <h3 className="font-bold text-white">Create a New Project</h3>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Name it anything (e.g., "openclaw-dashboard"). Choose the region closest to you.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">3</span>
                    <h3 className="font-bold text-white">Copy Your Connection String</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    In your Neon dashboard, find the connection string (starts with <code className="bg-gray-700 px-1 rounded">postgresql://</code>). Paste it below:
                  </p>
                  <input
                    type="password"
                    value={databaseUrl}
                    onChange={(e) => setDatabaseUrl(e.target.value)}
                    placeholder="postgresql://user:password@host/database"
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 mb-3"
                  />
                  <button
                    onClick={testConnection}
                    disabled={!databaseUrl || testing}
                    className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {testing ? 'Testing...' : 'Test Connection'}
                  </button>
                  {testResult && (
                    <div className={`mt-3 p-3 rounded-lg ${testResult.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                      {testResult.success ? '✓ ' : '✗ '}{testResult.message}
                    </div>
                  )}
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">4</span>
                    <h3 className="font-bold text-white">Create Tables</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    Go to the <strong>SQL Editor</strong> in Neon and run this script:
                  </p>
                  <div className="relative">
                    <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto max-h-48 overflow-y-auto">
                      {neonSchema}
                    </pre>
                    <button
                      onClick={() => copyToClipboard(neonSchema, 'schema')}
                      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs"
                    >
                      {copied === 'schema' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => goToStep('mode')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={!testResult?.success}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white py-3 rounded-lg font-medium"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Deploy */}
          {currentStep === 'deploy' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Deploy Your Dashboard</h2>
              <p className="text-gray-400 mb-6">One click to deploy on Vercel (free tier available).</p>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">1</span>
                    <h3 className="font-bold text-white">Deploy to Vercel</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Click below to deploy. When asked for environment variables, paste your DATABASE_URL.
                  </p>
                  <a
                    href="https://vercel.com/new/clone?repository-url=https://github.com/ucsandman/OpenClaw-Dashboard&env=DATABASE_URL&envDescription=Your%20Neon%20PostgreSQL%20connection%20string"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium border border-gray-700 transition-all"
                  >
                    <svg height="20" viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
                    Deploy with Vercel
                  </a>
                </div>

                <div className="p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold">2</span>
                    <h3 className="font-bold text-white">Set Environment Variable</h3>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    When Vercel asks, paste your DATABASE_URL:
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={databaseUrl}
                      readOnly
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white pr-20"
                    />
                    <button
                      onClick={() => copyToClipboard(databaseUrl, 'url')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs"
                    >
                      {copied === 'url' ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-emerald-900/30 border border-emerald-700 rounded-xl">
                  <p className="text-emerald-300 text-sm">
                    💡 <strong>Tip:</strong> Vercel will give you a URL like <code>your-app.vercel.app</code>. 
                    Bookmark it - that's your dashboard!
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => goToStep('database')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-lg font-medium"
                  >
                    I've Deployed →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Complete */}
          {currentStep === 'complete' && (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-4">You're All Set!</h1>
              
              {setupMode === 'quick' ? (
                <div>
                  <p className="text-gray-300 mb-6">
                    Quick Start mode is active. Your data will be stored in this browser.
                  </p>
                  <p className="text-gray-400 text-sm mb-8">
                    Want to sync across devices? You can set up cloud storage anytime from the Integrations page.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300 mb-6">
                    Your dashboard is deployed and connected to your database!
                  </p>
                  <div className="bg-gray-800 p-4 rounded-xl text-left mb-8">
                    <h3 className="font-bold text-white mb-2">Next Steps:</h3>
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>✓ Visit your Vercel URL to see your dashboard</li>
                      <li>✓ Go to Integrations to connect your services</li>
                      <li>✓ Set up Clawdbot to sync data automatically</li>
                    </ul>
                  </div>
                </div>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Go to Dashboard →
              </button>
            </div>
          )}
        </div>

        {/* Help Link */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Need help? <a href="https://docs.clawd.bot" target="_blank" className="text-cyan-400 hover:underline">Read the docs</a> or <a href="https://discord.com/invite/clawd" target="_blank" className="text-cyan-400 hover:underline">join Discord</a>
        </p>
      </div>
    </div>
  );
}
