import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import OfflineIndicator from './OfflineIndicator';
import { useApp } from '../../context/AppContext';
import { X, Check } from 'lucide-react';

export default function MainLayout() {
  const app = useApp();

  // Guard against uninitialized context during early route mounting
  if (!app) {
    return (
      <div className="min-h-screen bg-[#090B13] flex items-center justify-center text-white text-sm">
        Loading workspace...
      </div>
    );
  }

  const { isSidebarCollapsed, isNewProjectModalOpen, setIsNewProjectModalOpen, addProject, members } = app;
  
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Active');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectColor, setProjectColor] = useState('#8B5CF6');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const colorPalette = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

  const toggleMember = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      await addProject({
        name: projectName,
        description: projectDesc,
        category: category || 'General',
        status,
        startDate: startDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        color: projectColor,
        teamMembers: selectedMembers,
        progress: 0,
      });

      setProjectName('');
      setProjectDesc('');
      setCategory('');
      setStartDate('');
      setDueDate('');
      setSelectedMembers([]);
      setIsNewProjectModalOpen(false);
    } catch (err) {
      console.error('Failed to create project from layout modal:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex relative">
      <OfflineIndicator />
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 min-w-0 flex flex-col ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <Navbar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="glass-card rounded-2xl border border-border bg-[#111420] w-full max-w-lg p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="text-base font-bold text-text-primary">Create Project</h3>
              <button onClick={() => setIsNewProjectModalOpen(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">PROJECT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Website Redesign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="What is this project about?"
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">CATEGORY</label>
                  <input
                    type="text"
                    placeholder="e.g. Engineering"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="To Do">To Do</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">START DATE</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">DUE DATE</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-2">COLOR</label>
                <div className="flex items-center gap-2.5">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setProjectColor(color)}
                      className={`w-8 h-8 rounded-xl border-2 transition-transform flex items-center justify-center cursor-pointer ${projectColor === color ? 'scale-110 border-white shadow-md' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    >
                      {projectColor === color && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-2">TEAM MEMBERS</label>
                <div className="flex flex-wrap gap-2">
                  {members && members.map((member) => {
                    const memberId = member.id || member._id;
                    const isSelected = selectedMembers.includes(memberId);
                    return (
                      <button
                        key={memberId}
                        type="button"
                        onClick={() => toggleMember(memberId)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple/20 text-purple border-purple/50 shadow-purple-glow'
                            : 'bg-card border-border text-text-muted hover:text-text-primary'
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-purple text-[9px] flex items-center justify-center text-white font-bold">
                          {member.name?.[0] || 'U'}
                        </span>
                        <span>{member.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-cardHover cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple text-white text-xs font-semibold shadow-purple-glow hover:bg-purple-hover cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}