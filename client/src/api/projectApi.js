import apiClient from './apiClient';

export const projectApi = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  create: async (projectData) => {
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },
  update: async (id, projectData) => {
    const response = await apiClient.patch(`/projects/${id}`, projectData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  }
};