'use client';

import { useState, useEffect } from 'react';

export default function InspirationCard() {
  const [ideas, setIdeas] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/inspiration');
      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        const formatted = data.ideas.map(idea => ({
          id: idea.id || 0,
          title: idea.title || 'Untitled',
          description: idea.description || '',
          funScore: idea.fun_factor || 0,
          learningScore: idea.learning_potential || 0,
          incomeScore: idea.income_potential || 0,
          totalScore: idea.score || ((idea.fun_factor || 0) + (idea.learning_potential || 0) + (idea.income_potential || 0))
        }));
        setIdeas(formatted.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch ideas:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getTotalScoreColor = (total) => {
    if (total >= 24) return 'bg-green-500';
    if (total >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">💡</span>
          Inspiration
        </h2>
        <span className="bg-fire-orange text-white px-2 py-1 rounded-full text-sm font-semibold">
          {ideas.length}
        </span>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {ideas.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">🤔</div>
            <div>No ideas captured yet</div>
          </div>
        ) : (
          ideas.map((idea) => (
            <div key={idea.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm mb-1">{idea.title}</div>
                  {idea.description && (
                    <div className="text-xs text-gray-300 mb-2">{idea.description.substring(0, 80)}</div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-white text-xs font-bold ml-2 ${getTotalScoreColor(idea.totalScore)}`}>
                  {idea.totalScore}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(idea.funScore)}`}>{idea.funScore}</div>
                  <div className="text-gray-400">Fun</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(idea.learningScore)}`}>{idea.learningScore}</div>
                  <div className="text-gray-400">Learn</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(idea.incomeScore)}`}>{idea.incomeScore}</div>
                  <div className="text-gray-400">Income</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
