'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LearningDashboard() {
  const [decisions, setDecisions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({ totalDecisions: 0, totalLessons: 0, successRate: 0, patterns: 0 });
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/learning');
      const data = await res.json();
      if (data.decisions && Array.isArray(data.decisions)) setDecisions(data.decisions);
      if (data.lessons && Array.isArray(data.lessons)) setLessons(data.lessons);
      if (data.stats) setStats({
        totalDecisions: data.stats.totalDecisions || 0,
        totalLessons: data.stats.totalLessons || 0,
        successRate: data.stats.successRate || 0,
        patterns: data.stats.patterns || 0
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch learning data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success': return 'bg-green-500 text-white';
      case 'failure': return 'bg-red-500 text-white';
      case 'mixed': return 'bg-yellow-500 text-black';
      case 'pending': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'mixed': return '⚠️';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const getConfidenceColor = (conf) => {
    const c = conf || 0;
    if (c >= 90) return 'text-green-400';
    if (c >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(t => t);
    return [];
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl">
              🧠
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Learning Database</h1>
              <p className="text-gray-400">Decisions, Outcomes & Lessons {lastUpdated && `• Updated ${lastUpdated}`}</p>
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
          <div className="text-3xl font-bold text-purple-400">{stats.totalDecisions}</div>
          <div className="text-sm text-gray-400">Decisions Tracked</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.totalLessons}</div>
          <div className="text-sm text-gray-400">Lessons Learned</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.successRate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.patterns}</div>
          <div className="text-sm text-gray-400">Patterns Found</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Decisions */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Recent Decisions
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {decisions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🤔</div>
                <div>No decisions logged yet</div>
              </div>
            ) : (
              decisions.map((decision) => (
                <div key={decision.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-2">
                      <span className="text-xl">{getOutcomeIcon(decision.outcome)}</span>
                      <div>
                        <div className="font-semibold text-white">{decision.decision}</div>
                        <div className="text-xs text-gray-400">{decision.timestamp || decision.date}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getOutcomeColor(decision.outcome)}`}>
                      {decision.outcome || 'pending'}
                    </span>
                  </div>
                  
                  {decision.context && (
                    <div className="text-sm text-gray-400 mb-3 pl-7">{decision.context}</div>
                  )}
                  
                  {parseTags(decision.tags).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pl-7">
                      {parseTags(decision.tags).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Lessons */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">💡</span>
            Distilled Lessons
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {lessons.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📚</div>
                <div>No lessons captured yet</div>
              </div>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
                  <div className="font-semibold text-white mb-2">{lesson.lesson}</div>
                  
                  {lesson.source_decisions && (
                    <div className="text-sm text-gray-400 mb-3">{lesson.source_decisions}</div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-xs text-gray-400">Confidence</div>
                        <div className={`font-bold ${getConfidenceColor(lesson.confidence)}`}>
                          {lesson.confidence || 0}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Validated</div>
                        <div className="font-bold text-white">{lesson.times_validated || 0}x</div>
                      </div>
                    </div>
                    
                    <div className="w-24">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${(lesson.confidence || 0) >= 90 ? 'bg-green-500' : (lesson.confidence || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${lesson.confidence || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
              navigator.clipboard.writeText('cd tools/learning-database && python learner.py patterns');
              alert('Command copied!');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-purple-400 font-semibold">🔮 View Patterns</div>
            <div className="text-xs text-gray-400">Analyze decision patterns</div>
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/learning-database && python learner.py log "decision" --context "context"');
              alert('Command copied! Edit and paste.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-blue-400 font-semibold">📝 Log Decision</div>
            <div className="text-xs text-gray-400">Record a new decision</div>
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/learning-database && python learner.py lesson "learned X" --confidence 80');
              alert('Command copied! Edit and paste.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-yellow-400 font-semibold">💡 Add Lesson</div>
            <div className="text-xs text-gray-400">Capture a new lesson</div>
          </button>
        </div>
      </div>
    </div>
  );
}
