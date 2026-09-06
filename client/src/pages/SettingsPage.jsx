import React, { useState } from 'react';
import { Settings, User, ShieldAlert, Briefcase, Upload, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { userApi } from '../api/userApi';

export default function SettingsPage() {
  const { currentUser, setCurrentUser } = useAuth();
  const { tasks } = useApp();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [bio, setBio] = useState(currentUser?.bio || 'Experienced professional collaborating on CollabBoard workflows.');
  const [department, setDepartment] = useState(currentUser?.department || 'Engineering');
  const [jobTitle, setJobTitle] = useState(currentUser?.jobTitle || 'Team Member');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to extract first two initials for the fallback avatar
  const getInitials = (userName) => {
    if (!userName) return 'U';
    const parts = userName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return userName.slice(0, 2).toUpperCase();
  };

  // Handle local image file upload and convert to base64 preview string
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send changes to backend database
      const response = await userApi.updateProfile({
        name,
        avatar,
        bio,
        department,
        jobTitle
      });

      const updatedUser = response.user || response;

      // Update global auth context & local storage with database-confirmed data
      setCurrentUser(updatedUser);

      setSuccessMsg('Profile preferences successfully saved to database!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert(err?.response?.data?.message || 'Failed to save profile changes.');
    } finally {
      setLoading(false);
    }
  };

  // Compute real-time task metrics from the global task list
  const userId = currentUser?.id || currentUser?._id;
  const userTasks = Array.isArray(tasks) ? tasks.filter((task) => {
    if (!task?.assignees) return false;
    return task.assignees.some((assignee) => 
      assignee === userId || assignee?._id === userId || assignee?.id === userId || assignee?.name === currentUser?.name
    );
  }) : [];

  const completedCount = userTasks.filter((task) => 
    task.status?.toLowerCase() === 'completed' || task.status?.toLowerCase() === 'done'
  ).length;

  const activeCount = userTasks.filter((task) => 
    task.status?.toLowerCase() !== 'completed' && task.status?.toLowerCase() !== 'done'
  ).length;

  return (
    <div className="flex flex-col w-full min-w-0 p-6 lg:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account preferences and application settings.</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* User Overview Summary Card */}
      <div className="glass-card rounded-2xl p-6 border border-border bg-card flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          {avatar && avatar.trim() !== '' ? (
            <img 
              src={avatar} 
              alt={name || 'User'} 
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple/50 shadow-purple-glow"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-purple/20 text-purple border-2 border-purple/50 font-bold text-xl flex items-center justify-center shadow-purple-glow">
              {getInitials(name)}
            </div>
          )}
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-success border-2 border-card shadow-success-glow" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <h2 className="text-lg font-bold text-text-primary">{name || 'User'}</h2>
          <p className="text-xs text-text-secondary">{currentUser?.email || 'user@collabboard.com'}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple/15 text-purple border border-purple/30 uppercase">
              {currentUser?.role || 'Employee'}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-cardHover text-text-secondary border border-border">
              {department}
            </span>
          </div>
        </div>

        {/* Real-time User Metrics */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
          <div className="bg-cardHover/50 p-3 rounded-xl border border-border/60 text-center">
            <p className="text-[10px] font-semibold text-text-muted uppercase">Completed</p>
            <p className="text-base font-bold text-success mt-0.5">{completedCount}</p>
          </div>
          <div className="bg-cardHover/50 p-3 rounded-xl border border-border/60 text-center">
            <p className="text-[10px] font-semibold text-text-muted uppercase">Active Tasks</p>
            <p className="text-base font-bold text-purple mt-0.5">{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 border border-border bg-card space-y-6">
        <h3 className="text-base font-bold text-text-primary border-b border-border/50 pb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-purple" /> Personal & Professional Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Display Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-cardHover border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              defaultValue={currentUser?.email || 'admin@collabboard.com'} 
              disabled 
              className="w-full bg-cardHover/50 border border-border/60 rounded-xl px-4 py-2.5 text-xs text-text-muted cursor-not-allowed" 
            />
          </div>
        </div>

        {/* Profile Picture File Upload */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Profile Picture Upload</label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-cardHover border border-border rounded-xl text-xs font-medium text-text-primary hover:border-purple transition-all cursor-pointer w-full">
              <Upload className="w-4 h-4 text-purple shrink-0" />
              <span className="truncate">{avatar ? 'Change profile picture...' : 'Choose image from computer...'}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
              />
            </label>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar('')}
                className="px-3 py-2.5 bg-danger/10 text-danger border border-danger/30 rounded-xl text-xs font-semibold hover:bg-danger/20 transition-all cursor-pointer shrink-0"
              >
                Remove
              </button>
            )}
          </div>
          <p className="text-[10px] text-text-muted mt-1">Upload a clean PNG, JPG, or GIF file from your device.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Department</label>
            <input 
              type="text" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)} 
              className="w-full bg-cardHover border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Job Title</label>
            <input 
              type="text" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)} 
              className="w-full bg-cardHover border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Bio / Professional Summary</label>
          <textarea 
            rows={3} 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className="w-full bg-cardHover border border-border rounded-xl px-4 py-2.5 text-xs text-text-primary outline-none focus:border-purple" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-purple text-white text-xs font-semibold shadow-purple-glow hover:bg-purple-hover cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Saving to Database...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-6 border border-danger/30 bg-card space-y-4">
        <h3 className="text-sm font-bold text-danger flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Resetting data will restore all mock tasks, projects, and users to their original default states.
        </p>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="px-4 py-2 rounded-xl bg-danger/10 text-danger border border-danger/30 text-xs font-semibold hover:bg-danger hover:text-white transition-all cursor-pointer">
          Reset All Mock Data
        </button>
      </div>
    </div>
  );
}