'use client';

import { useState, useEffect } from 'react';

export default function RecentActionsCard() {
  const [actions, setActions] = useState([]);

  useEffect(() => {
    // Mock data representing recent actions from action-audit.md
    const mockActions = [
      {
        id: 1,
        type: 'build',
        action: 'Created Dashboard Web GUI',
        platform: 'Local',
        timestamp: '2026-02-04 12:23 EST',
        status: 'in-progress'
      },
      {
        id: 2,
        type: 'apply',
        action: 'Applied to Technical Solution Architect',
        platform: 'LinkedIn',
        timestamp: '2026-02-04 11:20 EST',
        status: 'completed'
      },
      {
        id: 3,
        type: 'build',
        action: 'Token Efficiency Toolkit',
        platform: 'Local',
        timestamp: '2026-02-04 11:40 EST',
        status: 'completed'
      },
      {
        id: 4,
        type: 'build',
        action: 'Bounty Hunter Assistant',
        platform: 'Local',
        timestamp: '2026-02-04 08:10 EST',
        status: 'completed'
      },
      {
        id: 5,
        type: 'post',
        action: 'HumanConnect philosophy post',
        platform: 'Moltbook',
        timestamp: '2026-02-03 17:44 EST',
        status: 'completed'
      },
      {
        id: 6,
        type: 'security',
        action: 'Handled phishing email',
        platform: 'ProtonMail',
        timestamp: '2026-02-04 00:51 EST',
        status: 'completed'
      }
    ];
    setActions(mockActions);
  }, []);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'build': return '🔨';
      case 'post': return '📝';
      case 'apply': return '💼';
      case 'security': return '🛡️';
      case 'message': return '💬';
      case 'api': return '🔗';
      case 'calendar': return '📅';
      default: return '⚡';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'build': return 'bg-green-500';
      case 'post': return 'bg-blue-500';
      case 'apply': return 'bg-purple-500';
      case 'security': return 'bg-red-500';
      case 'message': return 'bg-yellow-500';
      case 'api': return 'bg-orange-500';
      case 'calendar': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const formatTimestamp = (timestamp) => {
    const parts = timestamp.split(' ');
    return {
      time: parts[1],
      date: parts[0]
    };
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">⚡</span>
          Recent Actions
        </h2>
        <span className="bg-fire-orange text-white px-2 py-1 rounded-full text-sm font-semibold">
          {actions.length}
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">😴</div>
            <div>No recent actions</div>
          </div>
        ) : (
          actions.map((action) => {
            const { time, date } = formatTimestamp(action.timestamp);
            
            return (
              <div key={action.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getTypeIcon(action.type)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getTypeColor(action.type)}`}>
                        {action.type}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{action.action}</div>
                      <div className="text-xs text-gray-400">{action.platform}</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(action.status)}</span>
                    <div>
                      <div className="text-xs text-white font-semibold">{time}</div>
                      <div className="text-xs text-gray-400">{date}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div>
            <div className="font-semibold text-green-400">{actions.filter(a => a.type === 'build').length}</div>
            <div className="text-gray-400">Built</div>
          </div>
          <div>
            <div className="font-semibold text-blue-400">{actions.filter(a => a.type === 'post').length}</div>
            <div className="text-gray-400">Posted</div>
          </div>
          <div>
            <div className="font-semibold text-purple-400">{actions.filter(a => a.type === 'apply').length}</div>
            <div className="text-gray-400">Applied</div>
          </div>
          <div>
            <div className="font-semibold text-red-400">{actions.filter(a => a.type === 'security').length}</div>
            <div className="text-gray-400">Security</div>
          </div>
        </div>
      </div>
    </div>
  );
}