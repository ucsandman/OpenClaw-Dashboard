'use client';

import { useState, useEffect } from 'react';

export default function ProjectsCard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Mock data representing current active projects
    const mockProjects = [
      {
        name: 'Token Efficiency Toolkit',
        status: 'active',
        progress: 100,
        type: 'tool',
        lastUpdate: '2026-02-04',
        priority: 'high'
      },
      {
        name: 'Bounty Hunter Assistant',
        status: 'active',
        progress: 95,
        type: 'income',
        lastUpdate: '2026-02-04',
        priority: 'high'
      },
      {
        name: 'Content Performance Tracker',
        status: 'active',
        progress: 90,
        type: 'analytics',
        lastUpdate: '2026-02-04',
        priority: 'medium'
      },
      {
        name: 'HumanConnect',
        status: 'active',
        progress: 70,
        type: 'research',
        lastUpdate: '2026-02-03',
        priority: 'medium'
      },
      {
        name: 'Dashboard Web',
        status: 'building',
        progress: 60,
        type: 'tool',
        lastUpdate: '2026-02-04',
        priority: 'high'
      },
      {
        name: 'Practical Systems CRM',
        status: 'maintaining',
        progress: 85,
        type: 'business',
        lastUpdate: '2026-02-02',
        priority: 'medium'
      }
    ];
    setProjects(mockProjects);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'building': return 'bg-yellow-500';
      case 'maintaining': return 'bg-blue-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'tool': return '🔧';
      case 'income': return '💰';
      case 'analytics': return '📊';
      case 'research': return '🔍';
      case 'business': return '💼';
      default: return '📁';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🚀</span>
          Active Projects
        </h2>
        <span className="bg-fire-orange text-white px-2 py-1 rounded-full text-sm font-semibold">
          {projects.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {projects.map((project, index) => (
          <div key={index} className={`glass-card p-4 border-l-4 ${getPriorityColor(project.priority)} hover:bg-opacity-20 transition-all`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-2">{getTypeIcon(project.type)}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{project.name}</div>
                  <div className="text-xs text-gray-400">{project.type}</div>
                </div>
              </div>
              <span className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`}></span>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 fire-gradient rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Status and Last Update */}
            <div className="flex justify-between items-center text-xs">
              <span className={`px-2 py-1 rounded text-white ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              <span className="text-gray-400">{project.lastUpdate}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-green-400">{projects.filter(p => p.status === 'active').length}</div>
            <div className="text-gray-400">Active</div>
          </div>
          <div>
            <div className="font-semibold text-yellow-400">{projects.filter(p => p.status === 'building').length}</div>
            <div className="text-gray-400">Building</div>
          </div>
          <div>
            <div className="font-semibold text-blue-400">{projects.filter(p => p.status === 'maintaining').length}</div>
            <div className="text-gray-400">Maintaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}