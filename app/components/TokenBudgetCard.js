'use client';

import { useState, useEffect } from 'react';

export default function TokenBudgetCard() {
  const [data, setData] = useState({
    hourUsed: 0,
    weekUsed: 0,
    hourRemaining: 100,
    weekRemaining: 100,
    contextUsed: 0,
    contextMax: 200000,
    contextPct: 0,
    model: 'loading...',
    status: 'loading',
    todayTokens: 0,
    todayCost: 0,
    compactions: 0
  });
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tokens');
      const json = await res.json();
      
      if (json.current) {
        const current = json.current;
        const today = json.today;
        
        let status = 'ok';
        if (current.hourlyPctLeft < 10 || current.weeklyPctLeft < 10) status = 'critical';
        else if (current.hourlyPctLeft < 30 || current.weeklyPctLeft < 30) status = 'warning';
        
        setData({
          hourUsed: current.hourlyUsed || 0,
          weekUsed: current.weeklyUsed || 0,
          hourRemaining: current.hourlyPctLeft || 100,
          weekRemaining: current.weeklyPctLeft || 100,
          contextUsed: current.contextUsed || 0,
          contextMax: current.contextMax || 200000,
          contextPct: current.contextPct || 0,
          model: current.model || 'unknown',
          compactions: current.compactions || 0,
          todayTokens: today?.totalTokens || 0,
          todayCost: today?.estimatedCost || 0,
          status
        });
        setLastUpdated(new Date(current.updatedAt || Date.now()).toLocaleTimeString());
      } else {
        setData(prev => ({ ...prev, status: 'no-data' }));
        setLastUpdated('No data yet');
      }
    } catch (error) {
      console.error('Failed to fetch token data:', error);
      setData(prev => ({ ...prev, status: 'error' }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-gray-500';
      case 'no-data': return 'bg-gray-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'critical': return '🔴 Low Capacity!';
      case 'warning': return '🟡 Moderate';
      case 'error': return '❌ Error';
      case 'no-data': return '⏳ Awaiting Data';
      default: return '🟢 Good';
    }
  };

  const formatCost = (cost) => {
    if (cost < 0.01) return '<$0.01';
    return `$${cost.toFixed(2)}`;
  };

  return (
    <div className="glass-card p-4 md:p-6 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
          <span className="mr-2">⚡</span>
          Token Usage
        </h2>
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${getStatusColor(data.status)}`}>
            {getStatusText(data.status)}
          </span>
          {lastUpdated && (
            <div className="text-xs text-gray-500">{lastUpdated}</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Context Window - Most important! */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">📚 Context Window</span>
            <span className="text-white font-semibold">
              {Math.round(data.contextUsed/1000)}k / {Math.round(data.contextMax/1000)}k ({data.contextPct}%)
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                data.contextPct > 80 ? 'bg-red-500' : 
                data.contextPct > 60 ? 'bg-yellow-500' : 
                'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
              style={{ width: `${data.contextPct}%` }}
            ></div>
          </div>
        </div>

        {/* Hourly Usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">⏱️ Hourly Budget</span>
            <span className="text-white font-semibold">{data.hourRemaining}% left</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                data.hourRemaining < 20 ? 'bg-red-500' : 
                data.hourRemaining < 40 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${data.hourRemaining}%` }}
            ></div>
          </div>
        </div>

        {/* Weekly Usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-300">📅 Weekly Budget</span>
            <span className="text-white font-semibold">{data.weekRemaining}% left</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                data.weekRemaining < 20 ? 'bg-red-500' : 
                data.weekRemaining < 40 ? 'bg-yellow-500' : 
                'bg-blue-500'
              }`}
              style={{ width: `${data.weekRemaining}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="glass-card p-2">
            <div className="text-lg md:text-xl font-bold text-green-400">{data.hourRemaining}%</div>
            <div className="text-[10px] text-gray-400">Hour</div>
          </div>
          <div className="glass-card p-2">
            <div className="text-lg md:text-xl font-bold text-blue-400">{data.weekRemaining}%</div>
            <div className="text-[10px] text-gray-400">Week</div>
          </div>
          <div className="glass-card p-2">
            <div className="text-lg md:text-xl font-bold text-purple-400">{data.contextPct}%</div>
            <div className="text-[10px] text-gray-400">Context</div>
          </div>
          <div className="glass-card p-2">
            <div className="text-lg md:text-xl font-bold text-fire-orange">{data.compactions}</div>
            <div className="text-[10px] text-gray-400">Compacts</div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Today's Usage</div>
              <div className="text-white font-semibold">
                {(data.todayTokens / 1000).toFixed(1)}k tokens
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Est. Cost</div>
              <div className="text-green-400 font-semibold">
                {formatCost(data.todayCost)}
              </div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="text-xs text-gray-500 flex justify-between items-center">
          <span>🧠 {data.model}</span>
          <span className="text-fire-orange">Live from Clawdbot</span>
        </div>
      </div>
    </div>
  );
}
