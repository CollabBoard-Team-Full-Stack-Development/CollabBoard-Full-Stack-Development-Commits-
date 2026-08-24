import React from 'react';
import { KanbanSquare } from 'lucide-react';

export const Logo = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple to-purple-hover shadow-purple-glow transition-all duration-300 group-hover:scale-105">
        <KanbanSquare className="w-5 h-5 text-white" />
        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {!collapsed && (
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-text-primary leading-none">
            Collab<span className="text-purple">Board</span>
          </span>
          <span className="text-[10px] font-medium tracking-wider uppercase text-text-secondary mt-1">
            Workspace v1.0
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;