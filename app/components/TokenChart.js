'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function TokenChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate sample trend data (in real implementation, this would come from logged history)
    const generateTrendData = () => {
      const now = new Date();
      const points = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Simulated daily token usage with some variance
        const baseUsage = 15000;
        const variance = Math.floor(Math.random() * 20000);
        const usage = baseUsage + variance;
        
        points.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tokens: usage,
          limit: 18000
        });
      }
      
      // Today's actual usage (from API if available)
      points[points.length - 1].tokens = 53000; // Current overspend
      
      return points;
    };

    setData(generateTrendData());
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const tokens = payload[0]?.value || 0;
      const limit = payload[1]?.value || 18000;
      const status = tokens > limit ? '🔴 Over' : '🟢 OK';
      
      return (
        <div className="glass-card p-3 text-sm">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-cyan-400">Tokens: {tokens.toLocaleString()}</p>
          <p className="text-gray-400">Limit: {limit.toLocaleString()}</p>
          <p>{status}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <span className="mr-2">📈</span>
        Token Usage Trend (7 Days)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `${(val/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="tokens" 
              stroke="#06b6d4" 
              strokeWidth={2}
              fill="url(#tokenGradient)" 
            />
            <Line 
              type="monotone" 
              dataKey="limit" 
              stroke="#ef4444" 
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-6 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-cyan-500 rounded mr-2"></div>
          <span className="text-gray-400">Daily Usage</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-red-500 mr-2" style={{borderTop: '2px dashed #ef4444'}}></div>
          <span className="text-gray-400">Daily Limit</span>
        </div>
      </div>
    </div>
  );
}
