'use client';

import { useState, useEffect } from 'react';

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [permission, setPermission] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        addNotification('success', 'Notifications enabled! You\'ll get alerts for important events.');
      }
    }
  };

  const addNotification = (type, message, title = 'MoltFire') => {
    const newNotif = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    
    // Send browser notification if permitted
    if (permission === 'granted' && type !== 'info') {
      new Notification(title, {
        body: message,
        icon: '/icon-192.png',
        badge: '/icon-192.png'
      });
    }
  };

  // Check for alerts periodically
  useEffect(() => {
    const checkAlerts = async () => {
      try {
        // Check token budget
        const tokenRes = await fetch('/api/tokens');
        const tokenData = await tokenRes.json();
        
        if (tokenData.dailyPct > 100) {
          addNotification('error', `Token budget exceeded! ${tokenData.dailyPct.toFixed(0)}% of daily limit used.`, '🚨 Token Alert');
        } else if (tokenData.dailyPct > 75) {
          addNotification('warning', `Token budget at ${tokenData.dailyPct.toFixed(0)}%. Consider conservation mode.`, '⚠️ Token Warning');
        }

        // Check follow-ups
        const relRes = await fetch('/api/relationships');
        const relData = await relRes.json();
        
        if (relData.stats?.followUpsDue > 0) {
          addNotification('info', `You have ${relData.stats.followUpsDue} follow-up(s) due!`, '📅 Follow-up Reminder');
        }
      } catch (error) {
        // Silently fail - APIs might not be available
      }
    };

    // Check immediately on load
    checkAlerts();
    
    // Then check every 5 minutes
    const interval = setInterval(checkAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [permission]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeStyles = (type) => {
    switch (type) {
      case 'error': return 'border-l-red-500 bg-red-900 bg-opacity-20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-900 bg-opacity-20';
      case 'success': return 'border-l-green-500 bg-green-900 bg-opacity-20';
      default: return 'border-l-blue-500 bg-blue-900 bg-opacity-20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 glass-card rounded-lg hover:bg-opacity-20 transition-all"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 glass-card rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-white">Notifications</h3>
            <div className="flex space-x-2">
              {permission !== 'granted' && (
                <button
                  onClick={requestPermission}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Enable
                </button>
              )}
              <button
                onClick={markAllRead}
                className="text-xs text-gray-400 hover:text-white"
              >
                Mark read
              </button>
              <button
                onClick={clearAll}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <div className="text-3xl mb-2">🔕</div>
                <div>No notifications</div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 border-l-4 ${getTypeStyles(notif.type)} ${!notif.read ? 'bg-opacity-30' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      <span>{getTypeIcon(notif.type)}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">{notif.title}</div>
                        <div className="text-xs text-gray-300">{notif.message}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{notif.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {permission !== 'granted' && (
            <div className="p-3 bg-gray-800 text-center">
              <button
                onClick={requestPermission}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                🔔 Enable browser notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
