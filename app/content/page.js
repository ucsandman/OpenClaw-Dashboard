'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContentDashboard() {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ totalImpressions: 0, totalEngagement: 0, engagementRate: 0, businessValue: 0 });
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
      if (data.stats) setStats(data.stats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch content data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const getEngagementColor = (rate) => {
    if (rate >= 2) return 'text-green-400';
    if (rate >= 1) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'LinkedIn': return 'bg-blue-600';
      case 'Moltbook': return 'bg-purple-600';
      case 'Twitter': return 'bg-sky-500';
      default: return 'bg-gray-600';
    }
  };

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Content Performance</h1>
              <p className="text-gray-400">Analytics & ROI Tracking {lastUpdated && `• Updated ${lastUpdated}`}</p>
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
          <div className="text-3xl font-bold text-blue-400">{formatNumber(stats.totalImpressions)}</div>
          <div className="text-sm text-gray-400">Total Impressions</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.totalEngagement}</div>
          <div className="text-sm text-gray-400">Total Engagement</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.engagementRate}%</div>
          <div className="text-sm text-gray-400">Avg Engagement Rate</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">${formatNumber(stats.businessValue)}</div>
          <div className="text-sm text-gray-400">Business Value</div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Key Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 border-l-4 border-l-green-500">
            <div className="text-sm font-semibold text-green-400 mb-1">Best Performing</div>
            <div className="text-white">Services posts</div>
            <div className="text-xs text-gray-400">2.4% engagement rate</div>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-yellow-500">
            <div className="text-sm font-semibold text-yellow-400 mb-1">Key Finding</div>
            <div className="text-white">Viral ≠ Engagement</div>
            <div className="text-xs text-gray-400">High reach, low rate</div>
          </div>
          <div className="glass-card p-4 border-l-4 border-l-purple-500">
            <div className="text-sm font-semibold text-purple-400 mb-1">Top ROI</div>
            <div className="text-white">Partnership stories</div>
            <div className="text-xs text-gray-400">$15K from one post</div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">📝</span>
          Content Performance
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                <th className="pb-3">Post</th>
                <th className="pb-3">Platform</th>
                <th className="pb-3">Impressions</th>
                <th className="pb-3">Engagement</th>
                <th className="pb-3">Rate</th>
                <th className="pb-3">Business Outcome</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-gray-800 hover:bg-white hover:bg-opacity-5">
                  <td className="py-4">
                    <div className="font-semibold text-white">{post.title}</div>
                    <div className="text-xs text-gray-400">{post.date}</div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getPlatformColor(post.platform)}`}>
                      {post.platform}
                    </span>
                  </td>
                  <td className="py-4 text-white">{formatNumber(post.impressions)}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-red-400">❤️ {post.likes}</span>
                      <span className="text-blue-400">💬 {post.comments}</span>
                      <span className="text-green-400">🔄 {post.shares}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`font-bold ${getEngagementColor(post.engagementRate)}`}>
                      {post.engagementRate}%
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="text-white text-sm">{post.businessOutcome}</div>
                    {post.outcomeValue > 0 && (
                      <div className="text-green-400 text-xs font-bold">${formatNumber(post.outcomeValue)}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Strategy */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">🎯</span>
          Content Strategy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <div className="text-sm font-semibold text-green-400 mb-2">✅ What Works</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Service-focused posts (highest conversion)</li>
              <li>• Strong technical opinions</li>
              <li>• Business storytelling with outcomes</li>
              <li>• Specific ROI numbers and examples</li>
            </ul>
          </div>
          <div className="glass-card p-4">
            <div className="text-sm font-semibold text-red-400 mb-2">❌ Avoid</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Chasing viral reach over engagement</li>
              <li>• Generic AI hype content</li>
              <li>• Posts without clear value prop</li>
              <li>• Too much self-promotion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}