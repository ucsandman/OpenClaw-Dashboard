'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RelationshipsDashboard() {
  const [contacts, setContacts] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [stats, setStats] = useState({ total: 0, hot: 0, warm: 0, cold: 0, followUpsDue: 0 });
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/relationships');
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
      if (data.interactions) setInteractions(data.interactions);
      if (data.stats) setStats(data.stats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch relationships:', error);
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

  const getTempBorderColor = (temp) => {
    switch (temp) {
      case 'HOT': return 'border-l-red-500';
      case 'WARM': return 'border-l-yellow-500';
      case 'COLD': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const getDirectionIcon = (dir) => dir === 'outbound' ? '📤' : '📥';

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date('2026-02-04');
    const target = new Date(dateStr);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDaysColor = (days) => {
    if (days === null) return '';
    if (days <= 0) return 'text-red-400';
    if (days <= 2) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen p-6">
      {/* Navigation */}
      <nav className="mb-6">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-2xl">
              👥
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Relationship Tracker</h1>
              <p className="text-gray-400">CRM & Follow-up Management {lastUpdated && `• Updated ${lastUpdated}`}</p>
            </div>
          </div>
          <button onClick={fetchData} className="px-3 py-2 glass-card hover:bg-opacity-20 transition-all rounded-lg">
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-gray-400">Total Contacts</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-red-400">{stats.hot}</div>
          <div className="text-sm text-gray-400">Hot Leads</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.warm}</div>
          <div className="text-sm text-gray-400">Warm</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.cold}</div>
          <div className="text-sm text-gray-400">Cold</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-orange-400">{stats.followUpsDue}</div>
          <div className="text-sm text-gray-400">Follow-ups Due</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📇</span>
            Contacts
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {contacts.map((contact) => {
              const daysUntil = getDaysUntil(contact.followUpDate);
              return (
                <div key={contact.id} className={`glass-card p-4 border-l-4 ${getTempBorderColor(contact.temperature)} hover:bg-opacity-20 transition-all`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-white">@{contact.name}</div>
                        <div className="text-xs text-gray-400">{contact.platform}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getTempColor(contact.temperature)}`}>
                      {contact.temperature}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-3">{contact.context}</div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-gray-400">
                      Last contact: {contact.lastContact} • {contact.interactions} interactions
                    </div>
                    {contact.followUpDate && (
                      <div className={`font-semibold ${getDaysColor(daysUntil)}`}>
                        Follow-up: {daysUntil <= 0 ? 'OVERDUE' : `${daysUntil} days`}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Interactions */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">💬</span>
            Recent Activity
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span>{getDirectionIcon(interaction.direction)}</span>
                    <span className="font-semibold text-white">@{interaction.contactName}</span>
                  </div>
                  <span className="text-xs text-gray-400">{interaction.date}</span>
                </div>
                <div className="text-sm text-gray-300">{interaction.summary}</div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-gray-400">{interaction.type}</span>
                  <span className="text-gray-400">{interaction.platform}</span>
                </div>
              </div>
            ))}
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
              navigator.clipboard.writeText('cd tools/relationship-tracker && python tracker.py list --hot');
              alert('Command copied! Paste in terminal.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-red-400 font-semibold">🔥 View Hot Leads</div>
            <div className="text-xs text-gray-400">Filter by temperature</div>
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/relationship-tracker && python tracker.py due');
              alert('Command copied! Paste in terminal.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-yellow-400 font-semibold">📅 Due Follow-ups</div>
            <div className="text-xs text-gray-400">Check what needs attention</div>
          </button>
          <button 
            onClick={() => {
              navigator.clipboard.writeText('cd tools/relationship-tracker && python tracker.py search ""');
              alert('Command copied! Add your search term and paste in terminal.');
            }}
            className="glass-card p-4 hover:bg-opacity-20 transition-all text-left"
          >
            <div className="text-blue-400 font-semibold">🔍 Search Contacts</div>
            <div className="text-xs text-gray-400">Find specific people</div>
          </button>
        </div>
      </div>
    </div>
  );
}