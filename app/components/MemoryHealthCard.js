'use client';

import { useState, useEffect } from 'react';

export default function MemoryHealthCard() {
  const [data, setData] = useState({
    health: null,
    entities: [],
    topics: [],
    loading: true
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/memory');
      const json = await res.json();
      setData({
        health: json.health,
        entities: json.entities || [],
        topics: json.topics || [],
        entityBreakdown: json.entityBreakdown || [],
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch memory health:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'person': return '👤';
      case 'tool': return '🔧';
      case 'service': return '🌐';
      case 'file': return '📄';
      default: return '📌';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'person': return 'bg-blue-500/20 text-blue-400';
      case 'tool': return 'bg-purple-500/20 text-purple-400';
      case 'service': return 'bg-green-500/20 text-green-400';
      case 'file': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (data.loading) {
    return (
      <div className="glass-card p-6 h-full flex items-center justify-center">
        <div className="text-gray-400">Loading memory health...</div>
      </div>
    );
  }

  const health = data.health;

  return (
    <div className="glass-card p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
          <span className="mr-2">🧠</span>
          Memory Health
        </h2>
        {health && (
          <div className={`text-2xl md:text-3xl font-bold ${getScoreColor(health.score)}`}>
            {health.score}
          </div>
        )}
      </div>

      {health ? (
        <div className="space-y-4">
          {/* Health Score Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Health Score</span>
              <span className="text-gray-300">{health.score}/100</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${getScoreGradient(health.score)}`}
                style={{ width: `${health.score}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="glass-card p-2">
              <div className="text-lg font-bold text-white">{health.totalFiles}</div>
              <div className="text-[10px] text-gray-400">Files</div>
            </div>
            <div className="glass-card p-2">
              <div className="text-lg font-bold text-white">{(health.totalLines / 1000).toFixed(1)}k</div>
              <div className="text-[10px] text-gray-400">Lines</div>
            </div>
            <div className="glass-card p-2">
              <div className="text-lg font-bold text-white">{health.daysWithNotes}</div>
              <div className="text-[10px] text-gray-400">Days</div>
            </div>
          </div>

          {/* Issues */}
          <div className="flex gap-4 text-sm">
            <div className={`flex items-center ${health.duplicates > 5 ? 'text-yellow-400' : 'text-green-400'}`}>
              <span className="mr-1">{health.duplicates > 5 ? '⚠️' : '✅'}</span>
              {health.duplicates} duplicates
            </div>
            <div className={`flex items-center ${health.staleCount > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              <span className="mr-1">{health.staleCount > 0 ? '⚠️' : '✅'}</span>
              {health.staleCount} stale
            </div>
          </div>

          {/* Top Entities */}
          {data.entities.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Top Entities</div>
              <div className="flex flex-wrap gap-1">
                {data.entities.slice(0, 8).map((entity, i) => (
                  <span 
                    key={i}
                    className={`px-2 py-0.5 rounded text-xs ${getTypeColor(entity.type)}`}
                    title={`${entity.type}: ${entity.mentions} mentions`}
                  >
                    {getTypeIcon(entity.type)} {entity.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {data.topics.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-2">Topics</div>
              <div className="flex flex-wrap gap-1">
                {data.topics.map((topic, i) => (
                  <span 
                    key={i}
                    className="px-2 py-0.5 rounded text-xs bg-fire-orange/20 text-fire-orange"
                  >
                    #{topic.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-xs text-gray-500">
            Updated: {new Date(health.updatedAt).toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <div className="text-4xl mb-2">📊</div>
          <div>No health data yet</div>
          <div className="text-xs mt-2">Run memory scan to generate</div>
        </div>
      )}
    </div>
  );
}
