'use client';

import { useState, useEffect } from 'react';

export default function ContextCard() {
  const [contextData, setContextData] = useState({
    todayPoints: 6,
    activeThreads: 2,
    recentPoints: [],
    threads: []
  });

  useEffect(() => {
    // Mock data representing context manager state
    const mockData = {
      todayPoints: 6,
      activeThreads: 2,
      recentPoints: [
        {
          id: 1,
          text: 'Building visual dashboard instead of CLI',
          category: 'decision',
          importance: 9,
          timestamp: '12:23 EST'
        },
        {
          id: 2,
          text: 'Token efficiency toolkit preventing overspend',
          category: 'insight',
          importance: 8,
          timestamp: '11:40 EST'
        },
        {
          id: 3,
          text: 'Wes prefers visual interfaces over command line',
          category: 'preference',
          importance: 8,
          timestamp: '12:21 EST'
        },
        {
          id: 4,
          text: 'Bounty hunting system ready for deployment',
          category: 'status',
          importance: 7,
          timestamp: '10:30 EST'
        }
      ],
      threads: [
        {
          name: 'Dashboard Development',
          messages: 12,
          lastUpdate: '12:23 EST',
          active: true
        },
        {
          name: 'Job Search Strategy',
          messages: 8,
          lastUpdate: '11:20 EST',
          active: true
        }
      ]
    };
    setContextData(mockData);
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'decision': return '⚡';
      case 'insight': return '💡';
      case 'preference': return '❤️';
      case 'status': return '📊';
      default: return '💭';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'decision': return 'bg-red-500';
      case 'insight': return 'bg-yellow-500';
      case 'preference': return 'bg-pink-500';
      case 'status': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getImportanceWidth = (importance) => `${importance * 10}%`;

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🧵</span>
          Context
        </h2>
        <div className="flex space-x-2">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {contextData.todayPoints} points
          </span>
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {contextData.activeThreads} threads
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Active Threads */}
        <div>
          <div className="text-sm font-semibold text-gray-300 mb-2">Active Threads</div>
          <div className="space-y-2">
            {contextData.threads.map((thread, index) => (
              <div key={index} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white text-sm">{thread.name}</div>
                  <div className="text-xs text-gray-400">{thread.messages} messages</div>
                </div>
                <div className="text-right">
                  <div className={`w-3 h-3 rounded-full ${thread.active ? 'bg-green-500' : 'bg-gray-500'} mb-1`}></div>
                  <div className="text-xs text-gray-400">{thread.lastUpdate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Key Points */}
        <div>
          <div className="text-sm font-semibold text-gray-300 mb-2">Recent Key Points</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {contextData.recentPoints.map((point) => (
              <div key={point.id} className="glass-card p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(point.category)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getCategoryColor(point.category)}`}>
                      {point.category}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{point.timestamp}</span>
                </div>
                
                <div className="text-sm text-white mb-2">{point.text}</div>
                
                {/* Importance Bar */}
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="h-1 fire-gradient rounded-full"
                    style={{ width: getImportanceWidth(point.importance) }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}