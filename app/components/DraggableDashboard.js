'use client';

import { useState, useEffect } from 'react';
import TokenBudgetCard from './TokenBudgetCard';
import FollowUpsCard from './FollowUpsCard';
import CalendarWidget from './CalendarWidget';
import LearningStatsCard from './LearningStatsCard';
import ProjectsCard from './ProjectsCard';
import InspirationCard from './InspirationCard';
import ContextCard from './ContextCard';
import RecentActionsCard from './RecentActionsCard';
import TokenChart from './TokenChart';
import GoalsChart from './GoalsChart';
import IntegrationsCard from './IntegrationsCard';
import MemoryHealthCard from './MemoryHealthCard';

const allCards = [
  { id: 'tokenBudget', component: TokenBudgetCard, title: '⚡ Token Budget', defaultWidth: 'md:col-span-2' },
  { id: 'followUps', component: FollowUpsCard, title: '👥 Follow-ups', defaultWidth: '' },
  { id: 'calendar', component: CalendarWidget, title: '📅 Calendar', defaultWidth: '' },
  { id: 'learning', component: LearningStatsCard, title: '🧠 Learning', defaultWidth: '' },
  { id: 'projects', component: ProjectsCard, title: '📁 Projects', defaultWidth: 'md:col-span-2 lg:col-span-3' },
  { id: 'inspiration', component: InspirationCard, title: '💡 Inspiration', defaultWidth: '' },
  { id: 'context', component: ContextCard, title: '📋 Context', defaultWidth: 'md:col-span-2' },
  { id: 'recentActions', component: RecentActionsCard, title: '🕐 Recent Actions', defaultWidth: 'md:col-span-2' },
  { id: 'integrations', component: IntegrationsCard, title: '🔌 Integrations', defaultWidth: 'md:col-span-2' },
  { id: 'memoryHealth', component: MemoryHealthCard, title: '🧠 Memory Health', defaultWidth: '' },
  { id: 'tokenChart', component: TokenChart, title: '📊 Token Usage', defaultWidth: 'lg:col-span-1' },
  { id: 'goalsChart', component: GoalsChart, title: '🎯 Goals Progress', defaultWidth: 'lg:col-span-1' },
];

const defaultOrder = allCards.map(c => c.id);

export default function DraggableDashboard() {
  const [cardOrder, setCardOrder] = useState(defaultOrder);
  const [hiddenCards, setHiddenCards] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedOrder = localStorage.getItem('dashboardOrder');
    const savedHidden = localStorage.getItem('dashboardHidden');
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        if (Array.isArray(parsed)) {
          setCardOrder(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse saved dashboard order:', e);
        localStorage.removeItem('dashboardOrder');
      }
    }
    if (savedHidden) {
      try {
        const parsed = JSON.parse(savedHidden);
        if (Array.isArray(parsed)) {
          setHiddenCards(parsed);
        }
      } catch (e) {
        console.warn('Failed to parse saved hidden cards:', e);
        localStorage.removeItem('dashboardHidden');
      }
    }
  }, []);

  const moveCard = (id, direction) => {
    const idx = cardOrder.indexOf(id);
    if (direction === 'up' && idx > 0) {
      const newOrder = [...cardOrder];
      [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
      setCardOrder(newOrder);
      localStorage.setItem('dashboardOrder', JSON.stringify(newOrder));
    } else if (direction === 'down' && idx < cardOrder.length - 1) {
      const newOrder = [...cardOrder];
      [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
      setCardOrder(newOrder);
      localStorage.setItem('dashboardOrder', JSON.stringify(newOrder));
    }
  };

  const toggleCardVisibility = (id) => {
    let newHidden;
    if (hiddenCards.includes(id)) {
      newHidden = hiddenCards.filter(h => h !== id);
    } else {
      newHidden = [...hiddenCards, id];
    }
    setHiddenCards(newHidden);
    localStorage.setItem('dashboardHidden', JSON.stringify(newHidden));
  };

  const resetLayout = () => {
    setCardOrder(defaultOrder);
    setHiddenCards([]);
    localStorage.removeItem('dashboardOrder');
    localStorage.removeItem('dashboardHidden');
  };

  if (!mounted) {
    return <div className="text-center py-8 text-gray-400">Loading dashboard...</div>;
  }

  const visibleCards = cardOrder
    .map(id => allCards.find(c => c.id === id))
    .filter(c => c && !hiddenCards.includes(c.id));

  return (
    <div>
      {/* Edit Mode Toggle */}
      <div className="flex items-center justify-end gap-3 mb-4 flex-wrap">
        {isEditing && (
          <>
            <button
              onClick={resetLayout}
              className="px-3 py-1.5 text-sm bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
            >
              🔄 Reset
            </button>
            <span className="text-xs text-gray-500">
              {hiddenCards.length} hidden
            </span>
          </>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            isEditing
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isEditing ? '✓ Done' : '✏️ Customize'}
        </button>
      </div>

      {isEditing && (
        <div className="glass-card p-4 mb-4">
          <div className="text-sm text-gray-400 mb-3">
            Use ↑↓ to reorder • 👁️ to show/hide cards
          </div>
          <div className="flex flex-wrap gap-2">
            {allCards.map(card => (
              <button
                key={card.id}
                onClick={() => toggleCardVisibility(card.id)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                  hiddenCards.includes(card.id)
                    ? 'bg-gray-700 text-gray-500 line-through'
                    : 'bg-fire-orange/20 text-fire-orange border border-fire-orange/30'
                }`}
              >
                {card.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {visibleCards.map((card, idx) => {
          const Component = card.component;
          return (
            <div key={card.id} className={`relative ${card.defaultWidth}`}>
              {isEditing && (
                <div className="absolute -top-2 -right-2 z-10 flex gap-1">
                  <button
                    onClick={() => moveCard(card.id, 'up')}
                    disabled={idx === 0}
                    className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-xs disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveCard(card.id, 'down')}
                    disabled={idx === visibleCards.length - 1}
                    className="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-xs disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => toggleCardVisibility(card.id)}
                    className="w-6 h-6 bg-red-500/50 hover:bg-red-500 rounded text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              <div className={isEditing ? 'ring-2 ring-fire-orange/30 ring-dashed rounded-xl' : ''}>
                <Component />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
