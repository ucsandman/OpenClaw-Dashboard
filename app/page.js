'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import NotificationCenter from './components/NotificationCenter';

// Dynamic import to avoid SSR issues with react-grid-layout
const DraggableDashboard = dynamic(() => import('./components/DraggableDashboard'), {
  ssr: false,
  loading: () => <div className="text-center py-8 text-gray-400">Loading dashboard...</div>
});

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', {
        timeZone: 'America/New_York',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 fire-gradient rounded-full flex items-center justify-center text-xl md:text-2xl glow-orange">
              🔥
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">MoltFire Dashboard</h1>
              <p className="text-gray-400 text-sm md:text-base">Personal AI Assistant Control Center</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 md:space-x-4">
            <NotificationCenter />
            <div className="text-right">
              <div className="text-sm md:text-lg font-semibold text-white">{currentTime}</div>
              <div className="text-xs md:text-sm text-gray-400">Eastern Time</div>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Navigation */}
      <div className="glass-card p-3 md:p-4 mb-6 md:mb-8">
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          <Link href="/bounty-hunter" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>🎯</span><span>Bounty Hunter</span>
          </Link>
          <Link href="/content" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>📊</span><span>Content</span>
          </Link>
          <Link href="/relationships" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>👥</span><span>Relationships</span>
          </Link>
          <Link href="/goals" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>🎯</span><span>Goals</span>
          </Link>
          <Link href="/learning" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>🧠</span><span>Learning</span>
          </Link>
          <Link href="/tokens" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>⚡</span><span>Tokens</span>
          </Link>
          <Link href="/workflows" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>⚙️</span><span>Workflows</span>
          </Link>
          <Link href="/integrations" className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-sm md:text-base font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1 md:space-x-2">
            <span>🔌</span><span>Integrations</span>
          </Link>
        </div>
      </div>

      {/* Draggable Dashboard Grid */}
      <DraggableDashboard />

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>MoltFire v1.0 • Built with Next.js • Last updated: {currentTime}</p>
      </footer>
    </div>
  );
}
