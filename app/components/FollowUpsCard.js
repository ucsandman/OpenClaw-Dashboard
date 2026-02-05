'use client';

import { useState, useEffect } from 'react';

export default function FollowUpsCard() {
  const [followUps, setFollowUps] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/relationships');
      const data = await res.json();
      if (data.contacts && Array.isArray(data.contacts)) {
        const withFollowUps = data.contacts
          .filter(c => c.next_followup)
          .map(c => {
            const dueDate = new Date(c.next_followup);
            const today = new Date();
            const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return {
              id: c.id || 0,
              name: c.name || 'Unknown',
              type: c.opportunity_type || c.notes || 'Contact',
              temperature: (c.temperature || 'warm').toUpperCase(),
              dueDate: c.next_followup,
              daysLeft
            };
          })
          .sort((a, b) => a.daysLeft - b.daysLeft)
          .slice(0, 5);
        setFollowUps(withFollowUps);
      }
    } catch (error) {
      console.error('Failed to fetch follow-ups:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTempColor = (temp) => {
    switch (temp) {
      case 'HOT': return 'bg-red-500 text-white';
      case 'WARM': return 'bg-yellow-500 text-black';
      case 'COLD': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDaysColor = (days) => {
    if (days <= 1) return 'text-red-400';
    if (days <= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">👥</span>
          Follow-ups
        </h2>
        <span className="bg-fire-orange text-white px-2 py-1 rounded-full text-sm font-semibold">
          {followUps.length}
        </span>
      </div>

      <div className="space-y-3">
        {followUps.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">✅</div>
            <div>All caught up!</div>
          </div>
        ) : (
          followUps.map((followUp) => (
            <div key={followUp.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-white">{followUp.name}</div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${getTempColor(followUp.temperature)}`}>
                  {followUp.temperature}
                </span>
              </div>
              <div className="text-sm text-gray-300 mb-2">{followUp.type}</div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Due: {followUp.dueDate}</span>
                <span className={`font-semibold ${getDaysColor(followUp.daysLeft)}`}>
                  {followUp.daysLeft} days left
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
