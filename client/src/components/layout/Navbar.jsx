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