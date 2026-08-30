import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockProjects } from '../data/projects';
import { mockTasks } from '../data/tasks';
import { mockActivities } from '../data/activities';
import { mockUsers } from '../data/users';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // LocalStorage state persistence
  const [selectedProjectId, setSelectedProjectId] = useLocalStorage('collabboard_project', 'proj-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('collabboard_sidebar_collapsed', false);
  const [theme, setTheme] = useLocalStorage('collabboard_theme', 'dark');

  // In-memory application state
  const [projects] = useState(mockProjects);
  const [tasks, setTasks] = useState(mockTasks);
  const [activities, setActivities] = useState(mockActivities);
  const [members] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  // Active user representation
  const currentUser = members[0] || {
    id: 'user-1',
    name: 'Alex Morgan',
    avatar: 'https://i.pravatar.cc/150?u=alex'
  };

  // Helper getters
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Filter tasks based on selected project & search term (defensive checks)
  const filteredTasks = tasks.filter((task) => {
    const matchesProject = task.projectId === selectedProjectId;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.title?.toLowerCase().includes(query) ||
      (task.tag || task.category || '').toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query);
    return matchesProject && matchesSearch;
  });

  // Action handlers
  const addTask = (newTaskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      projectId: selectedProjectId,
      ...newTaskData,
      assignees: newTaskData.assignees || [currentUser.id],
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);

    // Append activity log entry
    const newActivity = {
      id: `act-${Date.now()}`,
      user: {
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      action: 'created task',
      target: newTask.title,
      timestamp: 'Just now',
    };

    setActivities((prev) => [newActivity, ...prev]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const oldStatus = task.status;
          if (oldStatus !== newStatus) {
            // Log state movement
            const updatedActivity = {
              id: `act-${Date.now()}`,
              user: {
                name: currentUser.name,
                avatar: currentUser.avatar,
              },
              action: 'moved task',
              target: task.title,
              from: oldStatus,
              to: newStatus,
              timestamp: 'Just now',
            };
            setActivities((prev) => [updatedActivity, ...prev]);
          }
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        // State
        projects,
        tasks: filteredTasks,
        allTasks: tasks,
        selectedProjectId,
        currentProject,
        searchQuery,
        isSidebarCollapsed,
        theme,
        activities,
        members,
        currentUser,
        isNewTaskModalOpen,

        // Actions
        setSelectedProjectId,
        setSearchQuery,
        toggleSidebar,
        toggleTheme,
        addTask,
        updateTaskStatus,
        deleteTask,
        setIsNewTaskModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};