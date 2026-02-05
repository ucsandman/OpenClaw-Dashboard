'use client';

import { useState, useEffect } from 'react';

export default function LearningStatsCard() {
  const [stats, setStats] = useState({
    decisions: 0,
    lessons: 0,
    successRate: 0,
    recentLessons: []
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/learning');
      const data = await res.json();
      if (data.stats && data.lessons) {
        setStats({
          decisions: data.stats.totalDecisions || 0,
          lessons: data.stats.totalLessons || 0,
          successRate: data.stats.successRate || 0,
          recentLessons: data.lessons.slice(0, 4).map(l => l.lesson || l.text || 'Lesson')
        });
      }
    } catch (error) {
      console.error('Failed to fetch learning stats:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🧠</span>
          Learning
        </h2>
        <div className="text-right">
          <div className="text-sm text-gray-400">Success Rate</div>
          <div className="text-xl font-bold text-green-400">{stats.successRate}%</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold fire-gradient bg-clip-text text-transparent">
              {stats.decisions}
            </div>
            <div className="text-xs text-gray-400">Decisions Tracked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold fire-gradient bg-clip-text text-transparent">
              {stats.lessons}
            </div>
            <div className="text-xs text-gray-400">Lessons Learned</div>
          </div>
        </div>

        {/* Success Rate Visualization */}
        <div className="glass-card p-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-300">Decision Success</span>
            <span className="text-white font-semibold">{stats.successRate}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.successRate}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Lessons */}
        <div>
          <div className="text-sm font-semibold text-gray-300 mb-2">Recent Lessons</div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stats.recentLessons.map((lesson, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>{lesson}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}