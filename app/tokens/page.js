'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TokensDashboard() {
  const [tokenData, setTokenData] = useState({
    dailyUsed: 0,
    dailyLimit: 18000,
    weeklyUsed: 0,
    weeklyLimit: 126000,
    monthlyUsed: 0,
    monthlyLimit: 540000
  });
  const [lastUpdated, setLastUpdated] = useState('');
  const [operations, setOperations] = useState([]);

  const costGuide = [
    { operation: 'LinkedIn snapshot', tokens: 50000, cost: '$0.75', risk: 'HIGH' },
    { operation: 'Generic webpage', tokens: 20000, cost: '$0.30', risk: 'MEDIUM' },
    { operation: 'Form filling', tokens: 5000, cost: '$0.08', risk: 'LOW' },
    { operation: 'Simple click', tokens: 100, cost: '$0.001', risk: 'LOW' },
    { operation: 'API call', tokens: 500, cost: '$0.008', risk: 'LOW' },
    { operation: 'Memory read', tokens: 2000, cost: '$0.03', risk: 'LOW' },
    { operation: 'File write', tokens: 1000, cost: '$0.015', risk: 'LOW' }
  ];

  const fetchTokenData = async () => {
    try {
      const res = await fetch('/api/tokens');
      const data = await res.json();
      
      // Parse the actual API response
      const todayIn = data?.stats?.today?.tokens_in || 0;
      const todayOut = data?.stats?.today?.tokens_out || 0;
      const dailyUsed = todayIn + todayOut;
      
      const totalIn = data?.stats?.total?.tokens_in || 0;
      const totalOut = data?.stats?.total?.tokens_out || 0;
      const totalUsed = totalIn + totalOut;
      
      setTokenData({
        dailyUsed: dailyUsed,
        dailyLimit: 18000,
        weeklyUsed: totalUsed, // Approximate - use total for now
        weeklyLimit: 126000,
        monthlyUsed: totalUsed,
        monthlyLimit: 540000
      });
      
      // Set operations from usage data
      if (data?.usage && Array.isArray(data.usage)) {
        const ops = data.usage.slice(0, 10).map((u, idx) => ({
          id: u.id || idx,
          name: u.operation || 'Unknown operation',
          timestamp: u.timestamp || '',
          tokensIn: u.tokens_in || 0,
          tokensOut: u.tokens_out || 0,
          total: (u.tokens_in || 0) + (u.tokens_out || 0),
          model: u.model || 'unknown'
        }));
        setOperations(ops);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch token data:', error);
    }
  };

  useEffect(() => {
    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Safe percentage calculations (avoid division by zero)
  const safePct = (used, limit) => {
    if (!limit || limit === 0) return 0;
    return ((used || 0) / limit) * 100;
  };

  const getDailyPct = () => safePct(tokenData.dailyUsed, tokenData.dailyLimit);
  const getWeeklyPct = () => safePct(tokenData.weeklyUsed, tokenData.weeklyLimit);
  const getMonthlyPct = () => safePct(tokenData.monthlyUsed, tokenData.monthlyLimit);

  const getStatusColor = (pct) => {
    if (pct > 100) return 'bg-red-500';
    if (pct > 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (pct) => {
    if (pct > 100) return 'CRITICAL';
    if (pct > 75) return 'WARNING';
    return 'OK';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'bg-red-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatNumber = (num) => (num ?? 0).toLocaleString();

  return (
    <div className="min-h-screen p-6">
      <nav className="mb-6">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Token Efficiency</h1>
              <p className="text-gray-400">Real-time Cost Monitoring {lastUpdated && `• Updated ${lastUpdated}`}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchTokenData}
              className="px-3 py-2 glass-card hover:bg-opacity-20 transition-all rounded-lg"
            >
              🔄 Refresh
            </button>
            <div className={`px-4 py-2 rounded-full text-white font-bold ${getStatusColor(getDailyPct())}`}>
              {getStatusText(getDailyPct())} - {getDailyPct().toFixed(0)}%
            </div>
          </div>
        </div>
      </header>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Daily */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Daily Budget</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(getDailyPct())}`}>
              {getStatusText(getDailyPct())}
            </span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {getDailyPct().toFixed(1)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
            <div 
              className={`h-4 rounded-full transition-all ${getStatusColor(getDailyPct())}`}
              style={{ width: `${Math.min(getDailyPct(), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatNumber(tokenData.dailyUsed)} used</span>
            <span>{formatNumber(tokenData.dailyLimit)} limit</span>
          </div>
        </div>

        {/* Weekly */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Weekly Budget</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(getWeeklyPct())}`}>
              {getStatusText(getWeeklyPct())}
            </span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {getWeeklyPct().toFixed(1)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
            <div 
              className={`h-4 rounded-full transition-all ${getStatusColor(getWeeklyPct())}`}
              style={{ width: `${Math.min(getWeeklyPct(), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatNumber(tokenData.weeklyUsed)} used</span>
            <span>{formatNumber(tokenData.weeklyLimit)} limit</span>
          </div>
        </div>

        {/* Monthly */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Monthly Budget</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(getMonthlyPct())}`}>
              {getStatusText(getMonthlyPct())}
            </span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            {getMonthlyPct().toFixed(1)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
            <div 
              className={`h-4 rounded-full transition-all ${getStatusColor(getMonthlyPct())}`}
              style={{ width: `${Math.min(getMonthlyPct(), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatNumber(tokenData.monthlyUsed)} used</span>
            <span>{formatNumber(tokenData.monthlyLimit)} limit</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Operations */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Recent Operations
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {operations.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📭</div>
                <div>No operations logged yet</div>
                <div className="text-xs mt-2">Token usage will appear here once tracked</div>
              </div>
            ) : (
              operations.map((op) => (
                <div key={op.id} className="glass-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-white">{op.name}</div>
                      <div className="text-xs text-gray-400">{op.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-400">{formatNumber(op.total)}</div>
                      <div className="text-xs text-gray-400">tokens</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span className="text-green-400">↓ {formatNumber(op.tokensIn)}</span>
                      <span className="text-blue-400">↑ {formatNumber(op.tokensOut)}</span>
                    </div>
                    <span className="text-xs text-gray-400">{op.model}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cost Reference Guide */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">💰</span>
            Cost Reference Guide
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3">Operation</th>
                  <th className="pb-3">Tokens</th>
                  <th className="pb-3">Est. Cost</th>
                  <th className="pb-3">Risk</th>
                </tr>
              </thead>
              <tbody>
                {costGuide.map((item, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3 text-white">{item.operation}</td>
                    <td className="py-3 text-gray-300">{formatNumber(item.tokens)}</td>
                    <td className="py-3 text-gray-300">{item.cost}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${getRiskColor(item.risk)}`}>
                        {item.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Emergency Rules */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">⚠️</span>
          Budget Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4 border-l-4 border-l-red-500">
            <div className="text-red-400 font-semibold mb-2">When Budget Low (&lt;25%)</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>1. Switch to Sonnet for automation</li>
              <li>2. Avoid browser snapshots</li>
              <li>3. Summarize context to files</li>
              <li>4. Use direct API calls</li>
            </ul>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-yellow-500">
            <div className="text-yellow-400 font-semibold mb-2">Model Selection</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Complex reasoning → Opus</li>
              <li>• Automation/execution → Sonnet</li>
              <li>• Simple/status → Haiku</li>
              <li>• Context &gt;150k → Summarize first</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
