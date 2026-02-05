'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorkflowsDashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState({ totalWorkflows: 0, enabled: 0, totalRuns: 0, recentExecutions: 0 });
  const [lastUpdated, setLastUpdated] = useState('');
  const [runningWorkflow, setRunningWorkflow] = useState(null);

  const fetchData = async () => {
    try {
      const [workflowsRes, schedulesRes] = await Promise.all([
        fetch('/api/workflows'),
        fetch('/api/schedules')
      ]);
      
      const workflowsData = await workflowsRes.json();
      const schedulesData = await schedulesRes.json();
      
      if (workflowsData.workflows && Array.isArray(workflowsData.workflows)) {
        setWorkflows(workflowsData.workflows);
      }
      if (workflowsData.executions && Array.isArray(workflowsData.executions)) {
        setExecutions(workflowsData.executions);
      }
      if (workflowsData.stats) {
        setStats({
          totalWorkflows: workflowsData.stats.totalWorkflows || 0,
          enabled: workflowsData.stats.enabled || 0,
          totalRuns: workflowsData.stats.totalRuns || 0,
          recentExecutions: workflowsData.stats.recentExecutions || 0
        });
      }
      if (schedulesData.schedules && Array.isArray(schedulesData.schedules)) {
        setSchedules(schedulesData.schedules);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const runWorkflow = async (name) => {
    setRunningWorkflow(name);
    const command = `python tools/workflow-orchestrator/orchestrator.py run ${name}`;
    navigator.clipboard.writeText(command);
    alert(`Command copied to clipboard!\n\n${command}\n\nPaste in terminal to run.`);
    setRunningWorkflow(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': case 'success': return 'bg-green-500';
      case 'failed': case 'error': return 'bg-red-500';
      case 'running': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': case 'success': return '✅';
      case 'failed': case 'error': return '❌';
      case 'running': return '⏳';
      default: return '❓';
    }
  };

  const parseSteps = (steps) => {
    if (!steps) return [];
    if (Array.isArray(steps)) return steps;
    if (typeof steps === 'string') {
      try {
        return JSON.parse(steps);
      } catch {
        return [];
      }
    }
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
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Workflow Orchestrator</h1>
              <p className="text-gray-400">Automated Tool Chains {lastUpdated && `• Updated ${lastUpdated}`}</p>
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
          <div className="text-3xl font-bold text-cyan-400">{stats.totalWorkflows}</div>
          <div className="text-sm text-gray-400">Total Workflows</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{stats.enabled}</div>
          <div className="text-sm text-gray-400">Enabled</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{stats.totalRuns}</div>
          <div className="text-sm text-gray-400">Total Runs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">{executions.length}</div>
          <div className="text-sm text-gray-400">Recent Executions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflows */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Available Workflows
          </h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {workflows.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📭</div>
                <div>No workflows defined yet</div>
              </div>
            ) : (
              workflows.map((workflow) => {
                const steps = parseSteps(workflow.steps);
                return (
                  <div key={workflow.id} className="glass-card p-4 hover:bg-opacity-20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${workflow.enabled === 1 ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                          <div className="font-semibold text-white">{workflow.name}</div>
                        </div>
                        {workflow.description && (
                          <div className="text-sm text-gray-400 mt-1 ml-4">{workflow.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => runWorkflow(workflow.name)}
                        disabled={runningWorkflow === workflow.name}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        {runningWorkflow === workflow.name ? '⏳' : '▶️'} Run
                      </button>
                    </div>

                    {steps.length > 0 && (
                      <div className="ml-4 mt-3">
                        <div className="text-xs text-gray-500 mb-1">Steps ({steps.length}):</div>
                        <div className="flex flex-wrap gap-1">
                          {steps.slice(0, 5).map((step, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                              {typeof step === 'string' ? step : (step.name || `Step ${idx + 1}`)}
                            </span>
                          ))}
                          {steps.length > 5 && (
                            <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                              +{steps.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-400 ml-4">
                      <span>Runs: {workflow.run_count || 0}</span>
                      <span>Last: {workflow.last_run ? new Date(workflow.last_run).toLocaleDateString() : 'Never'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Execution History */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📜</span>
            Execution History
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {executions.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">📭</div>
                <div>No executions yet</div>
              </div>
            ) : (
              executions.map((exec) => (
                <div key={exec.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span>{getStatusIcon(exec.status)}</span>
                      <span className="font-semibold text-white">{exec.workflow_name || `Workflow #${exec.workflow_id}`}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getStatusColor(exec.status)}`}>
                      {exec.status || 'unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Steps: {exec.steps_completed || 0}/{exec.total_steps || '?'}</span>
                    <span>{exec.started_at ? new Date(exec.started_at).toLocaleString() : 'Unknown'}</span>
                  </div>
                  {exec.error && (
                    <div className="mt-2 text-xs text-red-400 bg-red-900 bg-opacity-30 p-2 rounded">
                      {exec.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Scheduled Jobs */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">⏰</span>
          Scheduled Jobs
          <span className="ml-2 px-2 py-1 bg-cyan-500 rounded-full text-xs">{schedules.length}</span>
        </h2>
        {schedules.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No scheduled jobs yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${schedule.enabled === 1 ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                    <span className="font-semibold text-white">{schedule.workflow_name}</span>
                  </div>
                </div>
                <div className="text-sm text-cyan-400 mb-2">{schedule.schedule}</div>
                {schedule.description && (
                  <div className="text-xs text-gray-400 mb-2">{schedule.description}</div>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Next: {schedule.next_run ? new Date(schedule.next_run).toLocaleString() : 'N/A'}</span>
                  <span>Runs: {schedule.run_count || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
