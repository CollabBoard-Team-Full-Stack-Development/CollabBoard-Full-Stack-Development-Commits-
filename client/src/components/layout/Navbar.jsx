import React, { useState, useEffect, useRef } from 'react';
import { Bell, Plus, ChevronDown, Menu, FolderPlus, Clock } from 'lucide-react';
import SearchBar from './SearchBar';
import Button from './Button';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { calendarApi } from '../../api/calendarApi';

export const Navbar = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
    setSearchQuery,
    currentUser,
    tasks,
    setIsNewTaskModalOpen,
    toggleSidebar,
    setIsNewProjectModalOpen,
  } = useApp();

  const { isAdmin } = useAuth();
  const { onlineUserIds } = useSocket();

  const isOnline = onlineUserIds.includes(currentUser?.id) || true;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live notifications with decreasing day countdowns (<= 5 days remaining)
  useEffect(() => {
    const loadNotifications = async () => {
      const generatedAlerts = [];
      const currentDate = new Date('2026-08-28'); // Current system reference date

      // Helper to calculate remaining days cleanly
      const getDaysRemaining = (dateStr) => {
        const targetDate = new Date(dateStr);
        const diffTime = targetDate - currentDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };

      // 1. Check Projects (<= 5 days remaining)
      if (Array.isArray(projects)) {
        projects.forEach((proj) => {
          if (proj.dueDate && proj.status !== 'Completed') {
            const daysLeft = getDaysRemaining(proj.dueDate);
            if (daysLeft >= 0 && daysLeft <= 5) {
              generatedAlerts.push({
                id: `proj-${proj.id || proj._id}`,
                title: `Project Deadline: ${proj.name}`,
                badge: 'PROJECT',
                message: daysLeft === 0 ? 'Due Today!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`,
              });
            }
          }
        });
      }

      // 2. Check Tasks (<= 5 days remaining)
      if (Array.isArray(tasks)) {
        tasks.forEach((task) => {
          if (task.dueDate && task.status !== 'Done' && task.status !== 'Completed') {
            const daysLeft = getDaysRemaining(task.dueDate);
            if (daysLeft >= 0 && daysLeft <= 5) {
              generatedAlerts.push({
                id: `task-${task.id || task._id}`,
                title: `Task Due: ${task.title}`,
                badge: 'TASK',
                message: daysLeft === 0 ? 'Due Today!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`,
              });
            }
          }
        });
      }

      // 3. Check Calendar Reminders (<= 5 days remaining)
      try {
        const calendarEvents = await calendarApi.getAll();
        if (Array.isArray(calendarEvents)) {
          calendarEvents.forEach((ev) => {
            if (ev.date) {
              const daysLeft = getDaysRemaining(ev.date);
              if (daysLeft >= 0 && daysLeft <= 5) {
                generatedAlerts.push({
                  id: `cal-${ev.id || ev._id}`,
                  title: `Reminder: ${ev.title}`,
                  badge: ev.type ? ev.type.toUpperCase() : 'REMINDER',
                  message: daysLeft === 0 ? 'Today!' : `${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining`,
                });
              }
            }
          });
        }
      } catch (error) {
        console.warn('Calendar notifications skipped due to network/server status.');
      }

      setNotifications(generatedAlerts);
    };

    loadNotifications();
  }, [tasks, projects]);

  return (
    <header className="sticky top-0 z-30 w-full glass-nav px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Sidebar Toggle & Project Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors cursor-pointer"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative group">
          <select
            value={selectedProjectId || ''}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-card hover:bg-cardHover text-text-primary text-sm font-semibold pl-4 pr-10 py-2 rounded-xl border border-border cursor-pointer focus:outline-none focus:border-purple transition-all duration-200"
          >
            {Array.isArray(projects) && projects.map((project) => (
              <option key={project.id || project._id} value={project.id || project._id} className="bg-sidebar text-text-primary py-2">
                {project.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-text-primary transition-colors" />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md mx-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            icon={FolderPlus}
            onClick={() => setIsNewProjectModalOpen(true)}
            className="hidden md:flex border-purple/40 text-purple-PRIMARY hover:bg-purple/10 cursor-pointer"
          >
            <span>New Project</span>
          </Button>
        )}

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsNewTaskModalOpen(true)}
          className="shadow-purple-glow cursor-pointer"
        >
          <span className="hidden sm:inline">New Task</span>
        </Button>

        {/* Active Notifications Button & Clean Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-purple animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-card rounded-2xl border border-border bg-[#111420] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-cardHover/30">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-purple" />
                  <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Notifications</h3>
                </div>
                <span className="text-[10px] font-semibold bg-purple/10 text-purple px-2 py-0.5 rounded-full border border-purple/30">
                  {notifications.length} Active
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-border/40 p-2 space-y-1">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-text-muted text-xs">
                    No deadlines or reminders due within the next 5 days.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl hover:bg-cardHover/50 transition-colors flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold text-purple px-2 py-0.5 rounded bg-purple/10 border border-purple/20">
                          {item.badge}
                        </span>
                        <span className="text-[10px] font-semibold text-warning flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {item.message}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-text-primary mt-0.5">{item.title}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Profile Avatar */}
        <div className="hidden sm:flex items-center gap-3 cursor-pointer">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-text-primary">{currentUser?.name || 'User'}</span>
            <span className="text-[10px] text-purple-PRIMARY capitalize font-medium">
              {currentUser?.role || (isAdmin ? 'Admin' : 'Employee')}
            </span>
          </div>
          
          <div className="relative">
            <Avatar
              src={currentUser?.avatar}
              name={currentUser?.name}
              size="sm"
            />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${
              isOnline ? 'bg-success shadow-success-glow' : 'bg-text-muted'
            }`} />
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { Bell, Plus, ChevronDown, Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import Button from './Button';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export const Navbar = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
    setSearchQuery,
    currentUser,
    setIsNewTaskModalOpen,
    toggleSidebar,
  } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full glass-nav px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Sidebar Toggle & Project Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Project Selector Dropdown */}
        <div className="relative group">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="appearance-none bg-card hover:bg-cardHover text-text-primary text-sm font-semibold pl-4 pr-10 py-2 rounded-xl border border-border cursor-pointer focus:outline-none focus:border-purple transition-all duration-200"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id} className="bg-sidebar text-text-primary py-2">
                {project.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-text-primary transition-colors" />
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md mx-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Right: Actions & User Avatar */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setIsNewTaskModalOpen(true)}
          className="shadow-purple-glow"
        >
          <span className="hidden sm:inline">New Task</span>
        </Button>

        {/* Notifications Button */}
        <button
          type="button"
          className="relative p-2 rounded-xl bg-card border border-border text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple animate-pulse" />
        </button>

        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />

        {/* Profile Avatar */}
        <div className="hidden sm:flex items-center gap-3 cursor-pointer">
          <Avatar
            src={currentUser.avatar}
            name={currentUser.name}
            status={currentUser.status}
            size="sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;