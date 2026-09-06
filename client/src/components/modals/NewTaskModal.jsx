import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, AlertCircle } from 'lucide-react';
import Button from '../layout/Button';
import { useApp } from '../../context/AppContext';

export const NewTaskModal = ({ isOpen, onClose }) => {
  const { addTask, members } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [tag, setTag] = useState('Frontend');
  const [dueDate, setDueDate] = useState('Aug 15');
  const [selectedAssignees, setSelectedAssignees] = useState([members[0]?.id || 'usr-1']);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      status,
      tag,
      dueDate,
      assignees: selectedAssignees,
    });

    // Reset & Close
    setTitle('');
    setDescription('');
    onClose();
  };

  const toggleAssignee = (memberId) => {
    setSelectedAssignees((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg glass-card rounded-2xl p-6 border border-border shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
            <h3 className="text-lg font-bold text-text-primary tracking-tight">
              Create New Task
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-cardHover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Design Homepage Wireframes"
                className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-purple"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe key acceptance criteria..."
                className="w-full px-3.5 py-2 text-sm bg-card border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-purple resize-none"
              />
            </div>

            {/* Row: Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:border-purple"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:border-purple"
                >
                  <option value="To Do">To Do</option>
                  <option value="Doing">Doing</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>

            {/* Row: Tag & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                  Tag / Label
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="UI/UX, Frontend, API"
                  className="w-full px-3 py-2 text-sm bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                  Due Date
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="e.g. Aug 18"
                  className="w-full px-3 py-2 text-sm bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:border-purple"
                />
              </div>
            </div>

            {/* Assign Members */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
                Assign Members
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {members.map((member) => {
                  const isSelected = selectedAssignees.includes(member.id);
                  return (
                    <button
                      type="button"
                      key={member.id}
                      onClick={() => toggleAssignee(member.id)}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-purple/20 text-purple border-purple'
                          : 'bg-card text-text-secondary border-border hover:border-text-muted'
                      }`}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{member.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Task
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NewTaskModal;