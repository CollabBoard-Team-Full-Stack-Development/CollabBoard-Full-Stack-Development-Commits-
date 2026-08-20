import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  Calendar,
  Activity,
  FolderKanban,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import Logo from './Logo';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    theme,
    toggleTheme,
    currentUser,
    projects,
    selectedProjectId,
    setSelectedProjectId,
  } = useApp();

  const mainNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Tasks', icon: CheckSquare, path: '/tasks' },
    { name: 'Boards', icon: Kanban, path: '/boards' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Activity', icon: Activity, path: '/activity' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-border transition-all duration-300 flex flex-col justify-between ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding & Collapse Button */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <Logo collapsed={isSidebarCollapsed} />
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-card text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors border border-border"
            aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="p-3 space-y-1">
          {!isSidebarCollapsed && (
            <p className="px-3 text-[11px] font-semibold tracking-wider text-text-muted uppercase mb-2">
              Menu
            </p>
          )}
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-purple/15 text-purple border border-purple/30 shadow-purple-glow'
                      : 'text-text-secondary hover:text-text-primary hover:bg-cardHover'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Projects Workspace Section */}
        <div className="p-3 mt-4 border-t border-border/50">
          {!isSidebarCollapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold tracking-wider text-text-muted uppercase">
                Projects
              </span>
              <FolderKanban className="w-3.5 h-3.5 text-text-muted" />
            </div>
          )}
          <div className="space-y-1">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedProjectId === proj.id
                    ? 'bg-card text-text-primary border border-border'
                    : 'text-text-secondary hover:text-text-primary hover:bg-cardHover'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: proj.color }}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate text-left">{proj.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Profile & Theme Switch */}
      <div className="p-3 border-t border-border/50 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors border border-transparent hover:border-border"
        >
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-purple shrink-0" />
            ) : (
              <Sun className="w-5 h-5 text-warning shrink-0" />
            )}
            {!isSidebarCollapsed && <span>Theme</span>}
          </div>
          {!isSidebarCollapsed && (
            <span className="text-xs px-2 py-0.5 rounded bg-card text-text-muted uppercase font-semibold">
              {theme}
            </span>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              status={currentUser.status}
              size="sm"
            />
            {!isSidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-text-muted truncate">
                  {currentUser.role}
                </span>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <NavLink
              to="/"
              className="p-1.5 text-text-muted hover:text-danger rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;