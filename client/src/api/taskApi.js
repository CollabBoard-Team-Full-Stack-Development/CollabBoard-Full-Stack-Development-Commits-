import apiClient from './apiClient';

export const taskApi = {
    getAll: async (projectId) => {
        const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
        const response = await apiClient.get(url);
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(`/tasks/${id}`);
        return response.data;
    },
    create: async (taskData) => {
        const response = await apiClient.post('/tasks', taskData);
        return response.data;
    },
    update: async (id, taskData) => {
        const response = await apiClient.patch(`/tasks/${id}`, taskData);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(`/tasks/${id}`);
        return response.data;
    }
};