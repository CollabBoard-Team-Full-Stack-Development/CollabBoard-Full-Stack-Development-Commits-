import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MoreVertical, Trash2, ArrowRight } from 'lucide-react';
import Avatar from './Avatar';
import { useApp } from '../../context/AppContext';

export const TaskCard = ({ task }) => {
  const { members, updateTaskStatus, deleteTask } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  // Map assignee IDs to member objects
  const assignedMembers = members.filter((m) => task.assignees?.includes(m.id));

  // Priority badge styling
  const priorityColors = {
    High: 'bg-danger/10 text-danger border-danger/30',
    Medium: 'bg-warning/10 text-warning border-warning/30',
    Low: 'bg-success/10 text-success border-success/30',
  };

  const statuses = ['To Do', 'Doing', 'Done'];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-4 border border-border/80 hover:border-purple/50 transition-all duration-200 shadow-card-glow relative group"
    >
      {/* Top Tag & Menu */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-card/90 text-text-secondary border border-border/60">
          {task.tag}
        </span>

        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
              priorityColors[task.priority] || priorityColors.Low
            }`}
          >
            {task.priority}
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-text-muted hover:text-text-primary rounded-lg hover:bg-cardHover transition-colors"
              aria-label="Task options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-sidebar border border-border shadow-2xl py-1.5 z-20"
                onMouseLeave={() => setShowMenu(false)}
              >
                <p className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase">
                  Move To
                </p>
                {statuses
                  .filter((s) => s !== task.status)
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        updateTaskStatus(task.id, status);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-cardHover flex items-center justify-between"
                    >
                      <span>{status}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                <div className="h-px bg-border my-1" />
                <button
                  onClick={() => {
                    deleteTask(task.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-danger hover:bg-danger/10 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Title & Description */}
      <h4 className="text-sm font-semibold text-text-primary tracking-tight mb-1 line-clamp-1">
        {task.title}
      </h4>
      <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
        {task.description}
      </p>

      {/* Card Footer: Due Date & Assigned Members */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-text-muted">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-purple" />
          <span>{task.dueDate}</span>
        </div>

        {/* Member Avatars Overlap */}
        <div className="flex items-center -space-x-2 overflow-hidden">
          {assignedMembers.map((member) => (
            <Avatar
              key={member.id}
              src={member.avatar}
              name={member.name}
              size="xs"
              showTooltip
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;