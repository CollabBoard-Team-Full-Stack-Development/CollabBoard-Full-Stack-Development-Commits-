import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useAuth } from './AuthContext';

// API services
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/userApi';
import { activityApi } from '../api/activityApi';
import { calendarApi } from '../api/calendarApi';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const auth = useAuth();
  const isOnline = useOnlineStatus();

  const isAuthenticated = auth?.isAuthenticated ?? !!auth?.currentUser;

  // ============================================
  // CURRENT USER
  // ============================================

  const currentUser = auth?.currentUser || null;
  const isAdmin = auth?.isAdmin || currentUser?.role === 'admin' || false;

  // Generate user-specific cache suffix to separate data per user account
  const userId = currentUser?.id || currentUser?._id;
  const cacheSuffix = userId ? `_${userId}` : '';

  // ============================================
  // LOCAL STORAGE STATE (User-scoped caching)
  // ============================================

  const [selectedProjectId, setSelectedProjectId] =
    useLocalStorage(
      `collabboard_project${cacheSuffix}`,
      null
    );

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useLocalStorage(
      'collabboard_sidebar_collapsed',
      false
    );

  const [theme, setTheme] =
    useLocalStorage(
      'collabboard_theme',
      'dark'
    );

  // ============================================
  // APPLICATION DATA CACHES
  // ============================================

  const [projectsCache, setProjectsCache] =
    useLocalStorage(
      `collabboard_projects_cache${cacheSuffix}`,
      { data: [], cachedAt: null }
    );

  const [tasksCache, setTasksCache] =
    useLocalStorage(
      `collabboard_tasks_cache${cacheSuffix}`,
      { data: [], cachedAt: null }
    );

  const [activitiesCache, setActivitiesCache] =
    useLocalStorage(
      `collabboard_activities_cache${cacheSuffix}`,
      { data: [], cachedAt: null }
    );

  const [calendarCache, setCalendarCache] =
    useLocalStorage(
      `collabboard_calendar_cache${cacheSuffix}`,
      { data: [], cachedAt: null }
    );

  const [projects, setProjects] = useState(projectsCache?.data || []);
  const [tasks, setTasks] = useState(tasksCache?.data || []);
  const [activities, setActivities] = useState(activitiesCache?.data || []);
  const [calendarEvents, setCalendarEvents] = useState(calendarCache?.data || []);
  const [members, setMembers] = useState([]);

  // ============================================
  // API STATE
  // ============================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // UI STATE
  // ============================================

  const [searchQuery, setSearchQuery] = useState('');

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] =
    useState(false);

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] =
    useState(false);

  // ============================================
  // APPLY THEME
  // ============================================

  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // ============================================
  // LOAD DATA FROM API
  // ============================================

  const loadData = useCallback(async (isBackground = false) => {
    const token = localStorage.getItem('collabboard_token');
    if (!token || !isAuthenticated || !currentUser) {
      setProjects([]);
      setTasks([]);
      setActivities([]);
      setCalendarEvents([]);
      setMembers([]);
      setLoading(false);
      return;
    }

    // 1. Immediately hydrate UI from local storage cache if available
    if (!isBackground) {
      setProjects(projectsCache?.data || []);
      setTasks(tasksCache?.data || []);
      setActivities(activitiesCache?.data || []);
      setCalendarEvents(calendarCache?.data || []);
    }

    // If offline, rely strictly on cached state without clearing data
    if (!isOnline) {
      setLoading(false);
      return;
    }

    setError(null);

    try {
      const [
        projRes,
        taskRes,
        userRes,
        actRes,
        calRes,
      ] = await Promise.all([
        projectApi.getAll().catch(() => null),
        taskApi.getAll().catch(() => null),
        userApi.getAll().catch(() => null),
        activityApi.getAll().catch(() => null),
        calendarApi?.getAll ? calendarApi.getAll().catch(() => null) : Promise.resolve(null),
      ]);

      const timestamp = new Date().toISOString();

      // Update state and write successfully validated responses to cache
      if (Array.isArray(projRes)) {
        setProjects(projRes);
        setProjectsCache({ data: projRes, cachedAt: timestamp });
        
        // Auto-select first project if none is currently selected
        if (!selectedProjectId && projRes.length > 0) {
          setSelectedProjectId(projRes[0].id || projRes[0]._id);
        }
      }

      if (Array.isArray(taskRes)) {
        setTasks(taskRes);
        setTasksCache({ data: taskRes, cachedAt: timestamp });
      }

      if (Array.isArray(userRes)) {
        setMembers(userRes);
      }

      if (Array.isArray(actRes)) {
        setActivities(actRes);
        setActivitiesCache({ data: actRes, cachedAt: timestamp });
      }

      if (Array.isArray(calRes)) {
        setCalendarEvents(calRes);
        setCalendarCache({ data: calRes, cachedAt: timestamp });
      }

    } catch (err) {
      console.error(
        'Failed to fetch fresh MongoDB API data, preserving cache:',
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to communicate with CollabBoard API.'
      );
    } finally {
      setLoading(false);
    }
  }, [
    isAuthenticated,
    userId,
    isOnline,
    selectedProjectId
  ]);

  // ============================================
  // LOAD API DATA WHEN AUTHENTICATED OR RECONNECTED
  // ============================================

  useEffect(() => {
    loadData(false);
  }, [userId, loadData]);

  useEffect(() => {
    if (isOnline) {
      loadData(true);
    }
  }, [isOnline, loadData]);

  // ============================================
  // CURRENT PROJECT
  // ============================================

  const currentProject =
    projects.find(
      (project) =>
        (project.id || project._id) === selectedProjectId
    ) || projects[0] || null;

  // ============================================
  // FILTER TASKS
  // ============================================

  const filteredTasks = tasks.filter((task) => {
    const matchesProject =
      task.projectId === selectedProjectId;

    const query =
      searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      task.title
        ?.toLowerCase()
        .includes(query) ||
      (task.tag ||
        task.category ||
        '')
        .toLowerCase()
        .includes(query) ||
      task.description
        ?.toLowerCase()
        .includes(query);

    return matchesProject && matchesSearch;
  });

  // ============================================
  // ADD PROJECT
  // ============================================

  const addProject = async (projectData) => {
    if (!isOnline) {
      throw new Error('You are offline. Creating projects requires a network connection.');
    }

    try {
      const newProject = await projectApi.create(projectData);
      const newId = newProject.id || newProject._id;

      setProjects((prevProjects) => {
        const updated = [newProject, ...prevProjects];
        setProjectsCache({ data: updated, cachedAt: new Date().toISOString() });
        return updated;
      });

      if (newId) {
        setSelectedProjectId(newId);
      }

      setIsNewProjectModalOpen(false);
      await loadData(true);

      return newProject;
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create project.'
      );
      throw err;
    }
  };

  // ============================================
  // UPDATE PROJECT
  // ============================================

  const updateProject = async (id, projectData) => {
    if (!isOnline) {
      throw new Error('You are offline. Updating projects requires a network connection.');
    }

    try {
      const updated = await projectApi.update(id, projectData);

      setProjects((prevProjects) => {
        const updatedList = prevProjects.map((project) =>
          (project.id || project._id) === id ? updated : project
        );
        setProjectsCache({ data: updatedList, cachedAt: new Date().toISOString() });
        return updatedList;
      });

      await loadData(true);
      return updated;
    } catch (err) {
      console.error('Failed to update project:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update project.'
      );
      throw err;
    }
  };

  // ============================================
  // DELETE PROJECT
  // ============================================

  const deleteProject = async (id) => {
    if (!isOnline) {
      throw new Error('You are offline. Deleting projects requires a network connection.');
    }

    try {
      await projectApi.delete(id);

      setProjects((prevProjects) => {
        const filtered = prevProjects.filter((project) => (project.id || project._id) !== id);
        setProjectsCache({ data: filtered, cachedAt: new Date().toISOString() });
        return filtered;
      });

      if (selectedProjectId === id) {
        const remainingProjects = projects.filter((project) => (project.id || project._id) !== id);
        if (remainingProjects.length > 0) {
          setSelectedProjectId(remainingProjects[0].id || remainingProjects[0]._id);
        } else {
          setSelectedProjectId(null);
        }
      }

      await loadData(true);
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete project.'
      );
      throw err;
    }
  };

  // ============================================
  // ADD TASK
  // ============================================

  const addTask = async (taskData) => {
    if (!isOnline) {
      throw new Error('You are offline. Creating tasks requires a network connection.');
    }

    try {
      const newTask = await taskApi.create({
        ...taskData,
        projectId: taskData.projectId || selectedProjectId,
        assignees: taskData.assignees || [userId],
      });

      setTasks((prevTasks) => {
        const updated = [newTask, ...prevTasks];
        setTasksCache({ data: updated, cachedAt: new Date().toISOString() });
        return updated;
      });

      await loadData(true);
      return newTask;
    } catch (err) {
      console.error('Failed to create task:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create task.'
      );
      throw err;
    }
  };

  // ============================================
  // UPDATE TASK
  // ============================================

  const updateTask = async (id, taskData) => {
    if (!isOnline) {
      throw new Error('You are offline. Updating tasks requires a network connection.');
    }

    try {
      const updated = await taskApi.update(id, taskData);

      setTasks((prevTasks) => {
        const updatedList = prevTasks.map((task) =>
          (task.id || task._id) === id ? updated : task
        );
        setTasksCache({ data: updatedList, cachedAt: new Date().toISOString() });
        return updatedList;
      });

      await loadData(true);
      return updated;
    } catch (err) {
      console.error('Failed to update task:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update task.'
      );
      throw err;
    }
  };

  // ============================================
  // UPDATE TASK STATUS
  // ============================================

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!isOnline) {
      throw new Error('You are offline. Updating task status requires a network connection.');
    }

    try {
      const currentTask = tasks.find((task) => (task.id || task._id) === taskId);
      if (!currentTask) return;

      setTasks((prevTasks) => {
        const updatedList = prevTasks.map((task) =>
          (task.id || task._id) === taskId ? { ...task, status: newStatus } : task
        );
        setTasksCache({ data: updatedList, cachedAt: new Date().toISOString() });
        return updatedList;
      });

      await taskApi.update(taskId, { status: newStatus });
      await loadData(true);
    } catch (err) {
      console.error('Failed to update task status:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update task status.'
      );
      await loadData(true);
      throw err;
    }
  };

  // ============================================
  // DELETE TASK
  // ============================================

  const deleteTask = async (id) => {
    if (!isOnline) {
      throw new Error('You are offline. Deleting tasks requires a network connection.');
    }

    try {
      await taskApi.delete(id);

      setTasks((prevTasks) => {
        const filtered = prevTasks.filter((task) => (task.id || task._id) !== id);
        setTasksCache({ data: filtered, cachedAt: new Date().toISOString() });
        return filtered;
      });

      await loadData(true);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete task.'
      );
      throw err;
    }
  };

  // ============================================
  // CALENDAR REMINDER ACTIONS
  // ============================================

  const addCalendarEvent = async (eventData) => {
    if (!isOnline) {
      throw new Error('You are offline. Creating calendar events requires a network connection.');
    }

    try {
      const newEvent = await calendarApi.create(eventData);

      setCalendarEvents((prevEvents) => {
        const updated = [...prevEvents, newEvent];
        setCalendarCache({ data: updated, cachedAt: new Date().toISOString() });
        return updated;
      });

      await loadData(true);
      return newEvent;
    } catch (err) {
      console.error('Failed to create calendar event:', err);
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create calendar reminder.'
      );
      throw err;
    }
  };

  const deleteCalendarEvent = async (id) => {
    if (!isOnline) {
      throw new Error('You are offline. Deleting calendar events requires a network connection.');
    }

    try {
      await calendarApi.delete(id);

      setCalendarEvents((prevEvents) => {
        const filtered = prevEvents.filter((event) => (event.id || event._id) !== id);
        setCalendarCache({ data: filtered, cachedAt: new Date().toISOString() });
        return filtered;
      });

      await loadData(true);
    } catch (err) {
      console.error('Failed to delete calendar event:', err);
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete calendar reminder.'
      );
      throw err;
    }
  };

  // ============================================
  // TOGGLE SIDEBAR & THEME
  // ============================================

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // ============================================
  // CONTEXT PROVIDER
  // ============================================

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks: filteredTasks,
        allTasks: tasks,
        activities,
        calendarEvents,
        members,
        loading,
        error,
        isOnline,
        isOffline: !isOnline,
        refreshData: () => loadData(true),
        selectedProjectId,
        currentProject,
        setSelectedProjectId,
        addProject,
        updateProject,
        deleteProject,
        currentUser,
        isAdmin,
        searchQuery,
        setSearchQuery,
        isSidebarCollapsed,
        theme,
        isNewTaskModalOpen,
        isNewProjectModalOpen,
        setIsNewTaskModalOpen,
        setIsNewProjectModalOpen,
        toggleSidebar,
        toggleTheme,
        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        addCalendarEvent,
        deleteCalendarEvent,
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

export default AppContext;