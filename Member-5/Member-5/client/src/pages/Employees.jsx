import React, { useState } from 'react';
import { Users, X, Trash2, CheckCircle2, Circle, UserPlus, UserMinus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../api/projectApi';

export default function Employees() {
  const { members, projects, updateMember, deleteMember, refreshData } = useApp();
  const { onlineUserIds } = useSocket();
  const { isAdmin } = useAuth();

  // Manage Modal State
  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDepartment, setEditDepartment] = useState('');
  const [editRole, setEditRole] = useState('employee');
  const [successMsg, setSuccessMsg] = useState('');

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const openManageModal = (member) => {
    setEditingMember(member);
    setEditName(member.name || '');
    setEditDepartment(member.department || 'General');
    setEditRole(member.role || 'employee');
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember) return;

    if (updateMember) {
      await updateMember(editingMember.id || editingMember._id, {
        name: editName,
        department: editDepartment,
        role: editRole,
      });
    }
    setSuccessMsg('Employee details updated successfully!');
    await refreshData();
    setTimeout(() => setSuccessMsg(''), 3000);
    setEditingMember(null);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Are you sure you want to remove this employee from the team?')) {
      if (deleteMember) {
        deleteMember(memberId);
      }
      setEditingMember(null);
    }
  };

  const handleToggleProjectAssignment = async (projectId, isCurrentlyAssigned) => {
    if (!editingMember) return;
    const memberId = editingMember.id || editingMember._id;

    try {
      if (isCurrentlyAssigned) {
        await projectApi.removeMember(projectId, memberId);
        setSuccessMsg('Employee removed from project.');
      } else {
        await projectApi.addMember(projectId, memberId);
        setSuccessMsg('Employee assigned to project!');
      }
      await refreshData();
      
      // Update local editingMember object reference so modal UI reflects state instantly
      const updatedProjects = await projectApi.getAll();
      const currentProj = updatedProjects.find(p => (p.id || p._id) === projectId);
      // Trigger state refresh
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Failed to update project assignment:', err);
      alert(err?.response?.data?.message || 'Failed to modify project assignment.');
    }
  };

  return (
    <div className="flex flex-col w-full min-w-0 p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team Members</h1>
          <p className="text-sm text-text-secondary mt-1">Manage organization members and assign them to specific project workspaces.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      <div className="glass-card rounded-2xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 px-6 py-3.5 border-b border-border text-[11px] font-semibold text-text-muted uppercase tracking-wider gap-4">
          <span>Employee</span>
          <span>Department</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {members && members.length > 0 ? (
          <div className="divide-y divide-border/50">
            {members.map((member) => {
              const memberId = member.id || member._id;
              const isOnline = onlineUserIds.includes(memberId) || member.status?.toLowerCase() === 'online';

              return (
                <div key={memberId} className="grid grid-cols-1 md:grid-cols-4 px-6 py-4 items-center text-xs text-text-primary gap-4">
                  <div className="flex items-center gap-3">
                    {member.avatar && member.avatar.trim() !== '' ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full object-cover border border-border shrink-0" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-purple/20 text-purple border border-purple/40 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-[10px] text-text-muted">{member.email}</p>
                    </div>
                  </div>

                  <span className="text-text-secondary">{member.department || member.role || 'General'}</span>

                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      isOnline 
                        ? 'bg-success/10 text-success border-success/30' 
                        : 'bg-text-muted/10 text-text-muted border-border'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-success shadow-success-glow' : 'bg-text-muted'}`} />
                      {isOnline ? 'online' : 'offline'}
                    </span>
                  </div>

                  <div className="text-right">
                    {isAdmin ? (
                      <button 
                        onClick={() => openManageModal(member)}
                        className="px-3 py-1.5 rounded-xl bg-purple/15 text-purple hover:bg-purple hover:text-white transition-all text-xs font-semibold cursor-pointer"
                      >
                        Manage & Projects
                      </button>
                    ) : (
                      <span className="text-text-muted text-[11px] italic">View Only</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center text-text-secondary">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30 text-purple" />
            <p className="text-sm font-semibold">No employees found</p>
          </div>
        )}
      </div>

      {/* Manage Employee Modal with Project Assignments Overview */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl border border-border bg-[#111420] w-full max-w-lg p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div>
                <h3 className="text-sm font-bold text-text-primary">Manage Employee & Projects</h3>
                <p className="text-[11px] text-text-secondary mt-0.5">{editingMember.name} ({editingMember.email})</p>
              </div>
              <button onClick={() => setEditingMember(null)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleUpdateMember} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-text-secondary uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-text-secondary uppercase mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-secondary uppercase mb-1">Role / Access Level</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs text-text-primary outline-none focus:border-purple cursor-pointer"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin / Manager</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple text-white text-xs font-semibold shadow-purple-glow hover:bg-purple-hover cursor-pointer"
                >
                  Save Profile Details
                </button>
              </div>
            </form>

            {/* Project Assignments List */}
            <div className="pt-3 border-t border-border/50 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Project Workspaces Assignment</h4>
              <p className="text-[11px] text-text-secondary">Check which projects this employee currently belongs to or assign them instantly:</p>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {projects && projects.length > 0 ? (
                  projects.map((proj) => {
                    const projId = proj.id || proj._id;
                    const teamMembersList = proj.teamMembers || [];
                    const memberId = editingMember.id || editingMember._id;

                    // Check if member is assigned
                    const isAssigned = teamMembersList.some((m) => {
                      const mId = typeof m === 'object' ? (m.id || m._id) : m;
                      return mId?.toString() === memberId?.toString();
                    });

                    return (
                      <div key={projId} className="flex items-center justify-between p-3 bg-cardHover/50 border border-border/60 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${proj.color || 'bg-blue-500'}`} />
                          <div>
                            <p className="text-xs font-semibold text-text-primary">{proj.name}</p>
                            <p className="text-[10px] text-text-muted">{proj.category || 'General'}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleProjectAssignment(projId, isAssigned)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isAssigned 
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-danger/15 hover:text-danger hover:border-danger/30' 
                              : 'bg-purple/15 text-purple border border-purple/30 hover:bg-purple hover:text-white'
                          }`}
                        >
                          {isAssigned ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Assigned (Click to Remove)
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" /> Assign to Project
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-text-muted italic text-center py-4">No project workspaces created yet.</p>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <button
                type="button"
                onClick={() => handleDeleteMember(editingMember.id || editingMember._id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-danger bg-danger/10 hover:bg-danger/25 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Employee
              </button>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-medium text-text-secondary hover:bg-cardHover cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}