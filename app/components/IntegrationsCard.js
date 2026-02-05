'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function IntegrationsCard() {
  const integrations = [
    { name: 'Telegram', icon: '💬', status: 'connected' },
    { name: 'Google Calendar', icon: '📅', status: 'connected' },
    { name: 'Gmail', icon: '📧', status: 'connected' },
    { name: 'Notion', icon: '📝', status: 'connected' },
    { name: 'Neon DB', icon: '🗄️', status: 'connected' },
    { name: 'Vercel', icon: '▲', status: 'connected' },
    { name: 'GitHub', icon: '🐙', status: 'connected' },
    { name: 'ProtonMail', icon: '🔒', status: 'connected' },
    { name: 'Twitter/X', icon: '🐦', status: 'configured' },
    { name: 'Moltbook', icon: '🔥', status: 'connected' },
    { name: 'Brave Search', icon: '🦁', status: 'connected' },
    { name: 'ElevenLabs', icon: '🎙️', status: 'configured' },
  ];

  const connected = integrations.filter(i => i.status === 'connected').length;
  const total = integrations.length;

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🔌</span>
          Integrations
        </h2>
        <Link href="/integrations" className="text-sm text-fire-orange hover:underline">
          View All →
        </Link>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-bold text-green-400">{connected}<span className="text-gray-500 text-lg">/{total}</span></div>
        <div className="text-sm text-gray-400">Connected</div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {integrations.map((integration, idx) => (
          <div 
            key={idx} 
            className={`p-2 rounded-lg text-center ${
              integration.status === 'connected' 
                ? 'bg-green-500/20 border border-green-500/30' 
                : 'bg-yellow-500/20 border border-yellow-500/30'
            }`}
            title={`${integration.name} - ${integration.status}`}
          >
            <div className="text-xl">{integration.icon}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>🟢 {connected} connected</span>
        <span>🟡 {total - connected} configured</span>
      </div>
    </div>
  );
}
