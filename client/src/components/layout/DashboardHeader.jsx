import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Filter, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardHeader = () => {
  const { currentProject, currentUser, tasks } = useApp();

  // Real-time date and time
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between gap-6">
      {/* Left Section */}
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
          <Layers className="w-4 h-4" />
          <span>{currentProject.category}</span>
        </div>

        <h1 className="text-2xl font-bold text-text-primary">
          Welcome back, {currentUser.name.split(' ')[0]}
        </h1>

        <p className="text-sm text-text-secondary mt-1">
          {currentProject.description}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Real-time Date & Time */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text-secondary font-medium">
          <CalendarIcon className="w-4 h-4 text-purple" />

          <span>
            {currentDate.toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </span>

          <span className="text-text-secondary/50">•</span>

          <span className="tabular-nums">
            {currentDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </span>
        </div>

        {/* Filter Button */}
        <button
          type="button"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors font-medium"
        >
          <Filter className="w-4 h-4 text-text-muted" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;