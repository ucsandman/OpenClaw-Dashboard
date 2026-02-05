'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BountyHunterDashboard() {
  const [bounties, setBounties] = useState([]);
  const [cveResearch, setCveResearch] = useState([]);
  const [stats, setStats] = useState({ totalAvailable: 0, totalEarned: 0, activeSubmissions: 0, successRate: 0 });
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/bounties');
      const data = await res.json();
      if (data.bounties) setBounties(data.bounties);
      if (data.cveResearch) setCveResearch(data.cveResearch);
      if (data.stats) setStats(data.stats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch bounties:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'EASY': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HARD': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'text-red-400 bg-red-900';
      case 'HIGH': return 'text-orange-400 bg-orange-900';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-900';
      case 'LOW': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-500';
      case 'claimed': return 'bg-yellow-500';
      case 'submitted': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Navigation */}
      <nav className="mb-6">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Bounty Hunter</h1>
              <p className="text-gray-400">CVE Research & Income Tracking {lastUpdated && `• Updated ${lastUpdated}`}</p>
            </div>
          </div>
          <button onClick={fetchData} className="px-3 py-2 glass-card hover:bg-opacity-20 transition-all rounded-lg">
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400">${stats.totalAvailable.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Available Bounties</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">${stats.totalEarned}</div>
          <div className="text-sm text-gray-400">Total Earned</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.activeSubmissions}</div>
          <div className="text-sm text-gray-400">Active Submissions</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{stats.successRate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Bounties */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Open Bounties
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {bounties.map((bounty) => (
              <div key={bounty.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-semibold text-white">{bounty.title}</div>
                    <div className="text-xs text-gray-400">{bounty.platform} • {bounty.daysOpen} days open</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-400">${bounty.reward}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getDifficultyColor(bounty.difficulty)}`}>
                      {bounty.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(bounty.status)}`}>
                      {bounty.status}
                    </span>
                  </div>
                  <div className={`text-sm font-semibold ${getScoreColor(bounty.opportunityScore)}`}>
                    Score: {bounty.opportunityScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CVE Research */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🔬</span>
            CVE Research
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cveResearch.map((cve, index) => (
              <div key={index} className="glass-card p-4 hover:bg-opacity-20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-white font-mono">{cve.cveId}</div>
                    <div className="text-xs text-gray-400">{cve.vendor}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${getSeverityColor(cve.severity)}`}>
                    {cve.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-300 mb-3">{cve.description}</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    Template: <span className="text-white">{cve.templateStatus.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">Feasibility:</span>
                    <div className="w-24 bg-gray-700 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${cve.feasibilityScore >= 70 ? 'bg-green-500' : cve.feasibilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${cve.feasibilityScore}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(cve.feasibilityScore)}`}>
                      {cve.feasibilityScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Intelligence */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Market Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <div className="text-sm text-gray-400 mb-1">CVE Templates Rate</div>
            <div className="text-2xl font-bold text-green-400">$100 each</div>
            <div className="text-xs text-gray-500">Consistent market rate</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-gray-400 mb-1">Open CVE Issues</div>
            <div className="text-2xl font-bold text-yellow-400">48</div>
            <div className="text-xs text-gray-500">In Algora #7549</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-gray-400 mb-1">Top Earner</div>
            <div className="text-2xl font-bold text-purple-400">$11,800</div>
            <div className="text-xs text-gray-500">Proven income potential</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-sm font-semibold text-yellow-400 mb-2">💡 Strategy Tip</div>
          <div className="text-sm text-gray-300">
            Focus on CVEs with 70+ feasibility scores. gurgguda's 6 sub-agents earned $575 systematically targeting EASY/MEDIUM templates.
          </div>
        </div>
      </div>
    </div>
  );
}