import apiClient from './apiClient';

export const calendarApi = {
  getAll: async () => {
    const response = await apiClient.get('/calendar');
    return response.data;
  },
  create: async (eventData) => {
    const response = await apiClient.post('/calendar', eventData);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/calendar/${id}`);
    return response.data;
  }
};

export default calendarApi;