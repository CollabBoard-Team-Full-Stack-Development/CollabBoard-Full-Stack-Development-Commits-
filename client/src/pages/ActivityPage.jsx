import React, { useState } from 'react';
import { Activity, Clock, FolderPlus, CheckCircle, Edit3, Layers, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ActivityPage() {
  const { activities } = useApp();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'tasks' | 'projects'

  // Helper to extract first two initials for the user fallback avatar
  const getInitials = (userName) => {
    if (!userName) return 'U';
    const parts = userName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  // Helper to format timestamps cleanly
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;

    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' mins ago';
    return 'Just now';
  };

  // Filter activities: strictly exclude logins, registrations, and profile updates
  const projectActivities = (activities || []).filter((act) => {
    const actionText = (act.action || '').toLowerCase();
    
    // Ignore logins, logouts, registrations, and profile setting changes
    if (
      actionText.includes('login') || 
      actionText.includes('register') || 
      actionText.includes('profile') || 
      actionText.includes('logged')
    ) {
      return false;
    }

    // Apply category tabs filter
    if (filterType === 'tasks') {
      return actionText.includes('task');
    }
    if (filterType === 'projects') {
      return actionText.includes('project');
    }

    return true; // 'all' project/task related actions
  });

  return (
    <div className="flex flex-col w-full min-w-0 p-6 lg:p-8 space-y-6 max-w-4xl">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Workspace Activity</h1>
          <p className="text-sm text-text-secondary mt-1">Organized timeline of project rollouts, milestones, and task progression.</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-card border border-border rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-purple text-white shadow-purple-glow' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            All Actions
          </button>
          <button
            onClick={() => setFilterType('tasks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'tasks' ? 'bg-purple text-white shadow-purple-glow' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setFilterType('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'projects' ? 'bg-purple text-white shadow-purple-glow' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Projects
          </button>
        </div>
      </div>

      {/* Timeline Card Container */}
      <div className="glass-card rounded-2xl border border-border bg-card p-6 shadow-sm">
        {projectActivities.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border/60">
            {projectActivities.map((act) => {
              const userName = act.user?.name || 'Workspace User';
              const userAvatar = act.user?.avatar;
              const actionName = act.action || 'updated';
              const targetName = act.target || 'Item';
              const timeString = formatTimeAgo(act.createdAt || act.timestamp);
              const isProjectAction = actionName.toLowerCase().includes('project');

              return (
                <div key={act.id || act._id} className="relative flex items-start gap-4 group">
                  {/* Timeline Node Icon / Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-card border-2 border-purple flex items-center justify-center shadow-purple-glow shrink-0 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple" />
                  </div>

                  {/* Activity Item Card */}
                  <div className="flex-1 flex items-start justify-between gap-4 p-4 rounded-xl bg-cardHover/40 border border-border/50 hover:border-purple/30 transition-all">
                    <div className="flex items-start gap-3">
                      {userAvatar && userAvatar.trim() !== '' ? (
                        <img 
                          src={userAvatar} 
                          alt={userName} 
                          className="w-9 h-9 rounded-full object-cover border border-border shrink-0 mt-0.5" 
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-purple/20 text-purple border border-purple/40 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {getInitials(userName)}
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-xs text-text-primary leading-relaxed">
                          <span className="font-bold text-text-primary">{userName}</span>{' '}
                          <span className="text-text-secondary">{actionName}</span>{' '}
                          <span className="font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-md border border-purple/20">
                            {targetName}
                          </span>
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                          <Clock className="w-3 h-3" />
                          <span>{timeString}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-card border border-border/50 hidden sm:flex items-center justify-center shrink-0">
                      {isProjectAction ? (
                        <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-text-secondary space-y-2">
            <Activity className="w-10 h-10 mx-auto opacity-30 text-purple" />
            <p className="text-sm font-semibold text-text-primary">No project activities found</p>
            <p className="text-xs text-text-muted">Project creations and task updates will appear here cleanly.</p>
          </div>
        )}
      </div>
    </div>
  );
}