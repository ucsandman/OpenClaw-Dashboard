'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function GoalsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch goals data
    const fetchGoals = async () => {
      try {
        const res = await fetch('/api/goals');
        const result = await res.json();
        
        if (result.goals && result.goals.length > 0) {
          const chartData = result.goals.map(goal => ({
            name: goal.title?.substring(0, 20) || 'Goal',
            progress: goal.progress || 0,
            target: 100
          }));
          setData(chartData);
        } else {
          // Fallback sample data
          setData([
            { name: 'Get Wes a job', progress: 25, target: 100 },
            { name: 'Generate income', progress: 15, target: 100 },
            { name: 'Build PS pipeline', progress: 30, target: 100 },
          ]);
        }
      } catch (error) {
        // Fallback sample data
        setData([
          { name: 'Get Wes a job', progress: 25, target: 100 },
          { name: 'Generate income', progress: 15, target: 100 },
          { name: 'Build PS pipeline', progress: 30, target: 100 },
        ]);
      }
    };

    fetchGoals();
  }, []);

  const getBarColor = (progress) => {
    if (progress >= 75) return '#22c55e';
    if (progress >= 50) return '#eab308';
    if (progress >= 25) return '#f97316';
    return '#ef4444';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, progress } = payload[0].payload;
      return (
        <div className="glass-card p-3 text-sm">
          <p className="text-white font-semibold">{name}</p>
          <p className="text-cyan-400">Progress: {progress}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        Goal Progress
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.progress)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
