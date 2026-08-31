import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

// API services
import { projectApi } from '../api/projectApi';
import { taskApi } from '../api/taskApi';
import { userApi } from '../api/userApi';
import { activityApi } from '../api/activityApi';

// Mock data used as initial/local fallback
import { mockProjects } from '../data/projects';
import { mockTasks } from '../data/tasks';
import { mockActivities } from '../data/activities';
import { mockUsers } from '../data/users';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const auth = useAuth();

  const isAuthenticated = auth?.isAuthenticated ?? false;

  // ============================================
  // CURRENT USER
  // ============================================

  const currentUser = auth?.currentUser || {
    id: 'user-1',
    name: 'Alex Morgan',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=alex',
  };

  const isAdmin = auth?.isAdmin ?? true;

  // ============================================
  // LOCAL STORAGE STATE
  // ============================================

  const [selectedProjectId, setSelectedProjectId] =
    useLocalStorage(
      'collabboard_project',
      'proj-1'
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
  // APPLICATION DATA
  // ============================================

  const [projects, setProjects] =
    useLocalStorage(
      'collabboard_projects_cache',
      mockProjects
    );

  const [tasks, setTasks] =
    useLocalStorage(
      'collabboard_tasks_cache',
      mockTasks
    );

  const [activities, setActivities] =
    useLocalStorage(
      'collabboard_activities_cache',
      mockActivities
    );

  const [members, setMembers] =
    useState(mockUsers);

  // ============================================
  // API STATE
  // ============================================

  const [loading, setLoading] = useState(false);
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

  const loadData = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        projRes,
        taskRes,
        userRes,
        actRes,
      ] = await Promise.all([
        projectApi.getAll(),
        taskApi.getAll(),
        userApi.getAll(),
        activityApi.getAll(),
      ]);

      // Update application state with API data
      if (Array.isArray(projRes)) {
        setProjects(projRes);
      }

      if (Array.isArray(taskRes)) {
        setTasks(taskRes);
      }

      if (Array.isArray(userRes)) {
        setMembers(userRes);
      }

      if (Array.isArray(actRes)) {
        setActivities(actRes);
      }

    } catch (err) {
      console.error(
        'Failed to load application data from API:',
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to communicate with CollabBoard API.'
      );

      console.warn(
        'API unavailable. Using locally cached data.'
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // LOAD API DATA WHEN AUTHENTICATED
  // ============================================

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  // ============================================
  // CURRENT PROJECT
  // ============================================

  const currentProject =
    projects.find(
      (project) =>
        project.id === selectedProjectId
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
    try {
      const newProject =
        await projectApi.create(projectData);

      setProjects((prevProjects) => [
        newProject,
        ...prevProjects,
      ]);

      // Automatically select new project
      if (newProject?.id) {
        setSelectedProjectId(newProject.id);
      }

      setIsNewProjectModalOpen(false);

      // Refresh from backend
      await loadData();

      return newProject;

    } catch (err) {
      console.error(
        'Failed to create project:',
        err
      );

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

  const updateProject = async (
    id,
    projectData
  ) => {
    try {
      const updated =
        await projectApi.update(
          id,
          projectData
        );

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === id
            ? updated
            : project
        )
      );

      await loadData();

      return updated;

    } catch (err) {
      console.error(
        'Failed to update project:',
        err
      );

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
    try {
      await projectApi.delete(id);

      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) =>
            project.id !== id
        )
      );

      // If deleted project was selected,
      // select another project
      if (selectedProjectId === id) {
        const remainingProjects =
          projects.filter(
            (project) =>
              project.id !== id
          );

        if (remainingProjects.length > 0) {
          setSelectedProjectId(
            remainingProjects[0].id
          );
        } else {
          setSelectedProjectId(null);
        }
      }

      await loadData();

    } catch (err) {
      console.error(
        'Failed to delete project:',
        err
      );

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
    try {
      const newTask =
        await taskApi.create({
          ...taskData,
          projectId:
            taskData.projectId ||
            selectedProjectId,
          assignees:
            taskData.assignees ||
            [currentUser.id],
        });

      setTasks((prevTasks) => [
        newTask,
        ...prevTasks,
      ]);

      await loadData();

      return newTask;

    } catch (err) {
      console.error(
        'Failed to create task:',
        err
      );

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

  const updateTask = async (
    id,
    taskData
  ) => {
    try {
      const updated =
        await taskApi.update(
          id,
          taskData
        );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? updated
            : task
        )
      );

      await loadData();

      return updated;

    } catch (err) {
      console.error(
        'Failed to update task:',
        err
      );

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

  const updateTaskStatus = async (
    taskId,
    newStatus
  ) => {
    try {
      // Find current task
      const currentTask =
        tasks.find(
          (task) =>
            task.id === taskId
        );

      if (!currentTask) {
        return;
      }

      const oldStatus =
        currentTask.status;

      // Update local state immediately
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
              }
            : task
        )
      );

      // Create activity when status changes
      if (oldStatus !== newStatus) {
        const newActivity = {
          id: `act-${Date.now()}`,
          user: {
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
          action: 'moved task',
          target: currentTask.title,
          from: oldStatus,
          to: newStatus,
          timestamp: 'Just now',
        };

        setActivities((prev) => [
          newActivity,
          ...prev,
        ]);
      }

      // Update backend
      await taskApi.update(
        taskId,
        {
          status: newStatus,
        }
      );

    } catch (err) {
      console.error(
        'Failed to update task status:',
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update task status.'
      );

      // Reload backend state if update fails
      await loadData();

      throw err;
    }
  };

  // ============================================
  // DELETE TASK
  // ============================================

  const deleteTask = async (id) => {
    try {
      await taskApi.delete(id);

      setTasks((prevTasks) =>
        prevTasks.filter(
          (task) =>
            task.id !== id
        )
      );

      await loadData();

    } catch (err) {
      console.error(
        'Failed to delete task:',
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to delete task.'
      );

      throw err;
    }
  };

  // ============================================
  // TOGGLE SIDEBAR
  // ============================================

  const toggleSidebar = () => {
    setIsSidebarCollapsed(
      (prev) => !prev
    );
  };

  // ============================================
  // TOGGLE THEME
  // ============================================

  const toggleTheme = () => {
    setTheme(
      (prev) =>
        prev === 'dark'
          ? 'light'
          : 'dark'
    );
  };

  // ============================================
  // CONTEXT PROVIDER
  // ============================================

  return (
    <AppContext.Provider
      value={{
        // ========================================
        // DATA
        // ========================================

        projects,

        // Filtered tasks for current project
        tasks: filteredTasks,

        // All tasks without filtering
        allTasks: tasks,

        activities,

        // Users/members
        members,

        // ========================================
        // API STATE
        // ========================================

        loading,
        error,

        // Refresh all API data
        refreshData: loadData,

        // ========================================
        // PROJECT
        // ========================================

        selectedProjectId,
        currentProject,

        setSelectedProjectId,

        addProject,
        updateProject,
        deleteProject,

        // ========================================
        // USER
        // ========================================

        currentUser,
        isAdmin,

        // ========================================
        // SEARCH
        // ========================================

        searchQuery,
        setSearchQuery,

        // ========================================
        // UI
        // ========================================

        isSidebarCollapsed,
        theme,

        isNewTaskModalOpen,
        isNewProjectModalOpen,

        setIsNewTaskModalOpen,
        setIsNewProjectModalOpen,

        // ========================================
        // UI ACTIONS
        // ========================================

        toggleSidebar,
        toggleTheme,

        // ========================================
        // TASK ACTIONS
        // ========================================

        addTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// ============================================
// USE APP CONTEXT HOOK
// ============================================

export const useApp = () =>
  useContext(AppContext);
