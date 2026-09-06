import apiClient from './apiClient';

export const activityApi = {
    getAll: async () => {
        const response = await apiClient.get('/activities');
        return response.data;
    }
};