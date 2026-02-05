'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GoalsDashboard() {
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({ totalGoals: 0, active: 0, completed: 0, avgProgress: 0 });
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/goals');
      const data = await res.json();
      if (data.goals && Array.isArray(data.goals)) {
        setGoals(data.goals);
      }
      if (data.stats) {
        setStats({
          totalGoals: data.stats.totalGoals || 0,
          active: data.stats.active || 0,
          completed: data.stats.completed || 0,
          avgProgress: data.stats.avgProgress || 0
        });
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return '💼';
      case 'income': return '💰';
      case 'business': return '🏢';
      case 'learning': return '📚';
      case 'personal': return '🎯';
      default: return '📌';
    }
  };

  const getDaysRemaining = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    const target = new Date(dateStr);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  };

  const getProgressColor = (progress) => {
    const p = progress || 0;
    if (p >= 75) return 'bg-green-500';
    if (p >= 50) return 'bg-yellow-500';
    if (p >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

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
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Goal Tracker</h1>
              <p className="text-gray-400">Progress & Milestone Tracking {lastUpdated && `• Updated ${lastUpdated}`}</p>
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
          <div className="text-3xl font-bold text-white">{stats.totalGoals}</div>
          <div className="text-sm text-gray-400">Total Goals</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.active}</div>
          <div className="text-sm text-gray-400">Active</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.completed}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.avgProgress}%</div>
          <div className="text-sm text-gray-400">Avg Progress</div>
        </div>
      </div>

      {/* Goals */}
      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-gray-400">No goals yet. Add one to get started!</div>
          </div>
        ) : (
          goals.map((goal) => {
            const daysRemaining = getDaysRemaining(goal.target_date);
            const milestones = goal.milestones || [];
            const progress = goal.progress || 0;
            
            return (
              <div key={goal.id} className="glass-card p-6 border-l-4 border-l-orange-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getCategoryIcon(goal.category)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                      <div className="text-sm text-gray-400">
                        {goal.target_date && `Target: ${goal.target_date}`}
                        {daysRemaining !== null && ` • ${daysRemaining} days remaining`}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getStatusColor(goal.status)}`}>
                    {goal.status || 'active'}
                  </span>
                </div>

                {/* Description */}
                {goal.description && (
                  <p className="text-gray-300 mb-4">{goal.description}</p>
                )}

                {/* Main Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Progress</span>
                    <span className="text-white font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Milestones */}
                {milestones.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {milestones.map((milestone) => (
                        <div key={milestone.id} className="glass-card p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{milestone.status === 'completed' ? '✅' : '⬜'}</span>
                            <span className={`text-sm ${milestone.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                              {milestone.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">⚡</span>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/goal-tracker && python goals.py check');
              alert('Command copied! Paste in terminal.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-green-400 font-semibold">🔍 Health Check</div>
            <div className="text-xs text-gray-400">Review all goal status</div>
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/goal-tracker && python goals.py add "New Goal" --category work --target 2026-04-01');
              alert('Command copied! Edit and paste in terminal.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-blue-400 font-semibold">➕ Add Goal</div>
            <div className="text-xs text-gray-400">Create a new goal</div>
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/goal-tracker && python goals.py progress 1 30');
              alert('Command copied! Adjust goal ID and percentage, then paste.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-yellow-400 font-semibold">📊 Update Progress</div>
            <div className="text-xs text-gray-400">Log goal progress</div>
          </button>
        </div>
      </div>
    </div>
  );
}
