import React, { useState } from 'react';
import { FolderKanban, Plus, Calendar, X, Check, Users, Settings, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Projects() {
  const { 
    projects, 
    selectedProjectId, 
    setSelectedProjectId, 
    addProject, 
    updateProject, 
    deleteProject, 
    members, 
    tasks, 
    isNewProjectModalOpen, 
    setIsNewProjectModalOpen 
  } = useApp();
  
  const { isAdmin, currentUser } = useAuth();
  
  // Create Project State
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('Active');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectColor, setProjectColor] = useState('#8B5CF6');

  // Edit / Manage Project State
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editStatus, setEditStatus] = useState('Active');
  const [editDueDate, setEditDueDate] = useState('');

  const colorPalette = ['#8B5CF6', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    addProject({
      name: projectName,
      description: projectDesc,
      category: category || 'General',
      status: status || 'Active',
      startDate: startDate || '2026-08-27',
      dueDate: dueDate || '2026-09-30',
      color: projectColor,
      teamMembers: [],
      managerName: currentUser?.name || 'Hello User',
      progress: 0,
    });

    setProjectName('');
    setProjectDesc('');
    setCategory('');
    setStartDate('');
    setDueDate('');
    setIsNewProjectModalOpen(false);
  };

  const openEditModal = (proj, e) => {
    e.stopPropagation();
    setEditingProject(proj);
    setEditName(proj.name || '');
    setEditDesc(proj.description || '');
    setEditCategory(proj.category || '');
    setEditStatus(proj.status || 'Active');
    setEditDueDate(proj.dueDate || '');
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;

    updateProject(editingProject.id || editingProject._id, {
      name: editName,
      description: editDesc,
      category: editCategory,
      status: editStatus,
      dueDate: editDueDate,
    });

    setEditingProject(null);
  };

  const handleDeleteProject = (projId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(projId);
      if (editingProject?.id === projId || editingProject?._id === projId) setEditingProject(null);
    }
  };

  return (
    <div className="flex flex-col w-full min-w-0 p-6 lg:p-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage all active and planned projects, team assignments, and deliverables.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple text-white font-medium text-sm shadow-purple-glow hover:bg-purple-hover transition-all w-fit cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Projects Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projId = proj.id || proj._id;
          const isSelected = selectedProjectId === projId;

          const projectTasks = tasks.filter((t) => t.projectId === projId);
          const completedTasks = projectTasks.filter((t) => t.status === 'Done' || t.status === 'Completed').length;
          const dynamicProgress = projectTasks.length > 0 
            ? Math.round((completedTasks / projectTasks.length) * 100) 
            : (proj.progress || 0);

          // Real-time team matching handling both populated objects and raw string IDs
          const assignedTeamMembers = members.filter(m => {
            const memberId = m.id || m._id;
            return proj.teamMembers?.some(tm => {
              const tmId = typeof tm === 'object' ? (tm.id || tm._id) : tm;
              return tmId?.toString() === memberId?.toString();
            });
          });

          return (
            <div
              key={projId}
              onClick={() => setSelectedProjectId(projId)}
              className={`glass-card rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-purple/50 shadow-purple-glow bg-cardHover/50'
                  : 'border-border hover:border-border/80 bg-card'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${proj.color || '#8B5CF6'}20`, color: proj.color || '#8B5CF6' }}
                    >
                      <FolderKanban className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-purple transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">{proj.category || 'Workspace Project'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border bg-purple/10 text-purple border-purple/30">
                      {proj.status || 'Active'}
                    </span>
                    {isAdmin && (
                      <button
                        onClick={(e) => openEditModal(proj, e)}
                        className="p-1.5 rounded-lg bg-card border border-border text-text-muted hover:text-text-primary hover:bg-cardHover transition-colors cursor-pointer"
                        title="Manage Project"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
                  {proj.description || 'No description provided.'}
                </p>

                <div className="space-y-3 mb-5 bg-cardHover/30 p-3 rounded-xl border border-border/40">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted font-medium">Project Manager:</span>
                    <span className="text-text-primary font-semibold">{proj.managerName || currentUser?.name || 'Hello User'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted font-medium">Assigned Team:</span>
                    <div className="flex items-center -space-x-1.5 overflow-hidden">
                      {assignedTeamMembers.length > 0 ? (
                        assignedTeamMembers.map(m => (
                          <img 
                            key={m.id || m._id} 
                            src={m.avatar || ''} 
                            alt={m.name} 
                            title={m.name}
                            className="w-5 h-5 rounded-full object-cover border border-card" 
                          />
                        ))
                      ) : (
                        <span className="text-[10px] text-text-muted italic">No members assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Due: {proj.dueDate ? proj.dueDate.split('T')[0] : '2026-09-30'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-text-muted">Progress</span>
                    <span className="text-text-primary">{dynamicProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-purple"
                      style={{ width: `${dynamicProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Project Modal */}
      {isAdmin && isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="glass-card rounded-2xl border border-border bg-[#111420] w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
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

      {/* Edit / Manage Project Modal */}
      {isAdmin && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="glass-card rounded-2xl border border-border bg-[#111420] w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="text-base font-bold text-text-primary">Manage Project: {editingProject.name}</h3>
              <button onClick={() => setEditingProject(null)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProject} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">PROJECT NAME *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">CATEGORY</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">STATUS</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="To Do">To Do</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">DUE DATE</label>
                <input
                  type="date"
                  value={editDueDate ? editDueDate.split('T')[0] : ''}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={(e) => handleDeleteProject(editingProject.id || editingProject._id, e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/20 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete Project
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-cardHover cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple text-white text-xs font-semibold shadow-purple-glow hover:bg-purple-hover cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}