'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IntegrationsDashboard() {
  const [integrations, setIntegrations] = useState([]);
  const [lastUpdated, setLastUpdated] = useState('');

  // Hardcoded integrations for now - can make dynamic later
  const staticIntegrations = [
    {
      id: 1,
      name: 'Telegram',
      icon: '💬',
      status: 'connected',
      description: 'Primary chat interface',
      lastSync: 'Live',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 2,
      name: 'Google Calendar',
      icon: '📅',
      status: 'connected',
      description: 'Calendar sync via gog CLI',
      lastSync: 'Every heartbeat',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 3,
      name: 'Gmail',
      icon: '📧',
      status: 'connected',
      description: 'Email monitoring & alerts',
      lastSync: 'Every 2 hours',
      color: 'from-red-400 to-red-600'
    },
    {
      id: 4,
      name: 'Notion',
      icon: '📝',
      status: 'connected',
      description: 'Inbox, Dashboard, CRM',
      lastSync: 'On demand',
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 5,
      name: 'Neon Database',
      icon: '🗄️',
      status: 'connected',
      description: 'Cloud data sync',
      lastSync: 'Every 4 hours',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      id: 6,
      name: 'Vercel',
      icon: '▲',
      status: 'connected',
      description: 'Dashboard deployment',
      lastSync: 'On deploy',
      color: 'from-white to-gray-400'
    },
    {
      id: 7,
      name: 'GitHub',
      icon: '🐙',
      status: 'connected',
      description: 'Code repos & version control',
      lastSync: 'On commit',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 8,
      name: 'ProtonMail',
      icon: '🔒',
      status: 'connected',
      description: 'MoltFire email (browser)',
      lastSync: 'Manual check',
      color: 'from-violet-400 to-violet-600'
    },
    {
      id: 9,
      name: 'Twitter/X',
      icon: '🐦',
      status: 'configured',
      description: '@MoltFire account',
      lastSync: 'Via skill',
      color: 'from-sky-400 to-sky-600'
    },
    {
      id: 10,
      name: 'Moltbook',
      icon: '🔥',
      status: 'connected',
      description: 'AI social platform',
      lastSync: 'Every 4 hours',
      color: 'from-orange-400 to-red-600'
    },
    {
      id: 11,
      name: 'Brave Search',
      icon: '🦁',
      status: 'connected',
      description: 'Web search API',
      lastSync: 'On demand',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 12,
      name: 'ElevenLabs',
      icon: '🎙️',
      status: 'configured',
      description: 'TTS voice generation',
      lastSync: 'On demand',
      color: 'from-pink-400 to-pink-600'
    }
  ];

  useEffect(() => {
    setIntegrations(staticIntegrations);
    setLastUpdated(new Date().toLocaleTimeString());
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'connected':
        return <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">● Connected</span>;
      case 'configured':
        return <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-bold">◐ Configured</span>;
      case 'error':
        return <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">✕ Error</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full font-bold">○ Unknown</span>;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const configuredCount = integrations.filter(i => i.status === 'configured').length;

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Navigation */}
      <nav className="mb-6">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
              🔌
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Integrations</h1>
              <p className="text-gray-400">Connected Services & APIs {lastUpdated && `• ${lastUpdated}`}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-white">{integrations.length}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{connectedCount}</div>
          <div className="text-sm text-gray-400">Connected</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{configuredCount}</div>
          <div className="text-sm text-gray-400">Configured</div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <div key={integration.id} className="glass-card p-5 hover:bg-opacity-20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${integration.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {integration.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{integration.name}</div>
                  <div className="text-xs text-gray-400">{integration.description}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              {getStatusBadge(integration.status)}
              <span className="text-xs text-gray-500">Sync: {integration.lastSync}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Info Section */}
      <div className="glass-card p-6 mt-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">ℹ️</span>
          About Integrations
        </h2>
        <div className="text-gray-300 space-y-2 text-sm">
          <p><strong>Connected:</strong> Fully operational, actively syncing data</p>
          <p><strong>Configured:</strong> API keys/credentials set up, available on demand</p>
          <p className="text-gray-500 mt-4">To add new integrations, configure them in the Clawdbot gateway or add API keys to the secrets folder.</p>
        </div>
      </div>
    </div>
  );
}
