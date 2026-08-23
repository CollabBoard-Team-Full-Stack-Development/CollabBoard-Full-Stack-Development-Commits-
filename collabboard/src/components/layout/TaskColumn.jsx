import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import TaskCard from './TaskCard';
import { useApp } from '../../context/AppContext';

export const TaskColumn = ({ title, tasks, count, statusColor }) => {
  const { setIsNewTaskModalOpen } = useApp();

  return (
    <div className="flex flex-col rounded-2xl bg-sidebar/60 border border-border/80 p-4 min-h-[600px]">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          <h3 className="text-base font-bold text-text-primary">{title}</h3>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-card text-text-secondary border border-border">
            {count}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors"
            aria-label={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-cardHover transition-colors"
            aria-label="Column options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-border/60 rounded-2xl flex items-center justify-center text-xs text-text-muted">
            No tasks in {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;