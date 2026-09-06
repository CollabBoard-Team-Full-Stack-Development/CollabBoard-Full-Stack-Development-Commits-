import apiClient from './apiClient';

export const calendarApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/calendar');
      return response.data;
    } catch (error) {
      console.error('[Calendar API Error] GET /calendar failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  create: async (eventData) => {
    try {
      console.log('[Calendar API] Sending POST /calendar payload:', eventData);
      const response = await apiClient.post('/calendar', eventData);
      console.log('[Calendar API] Successfully created event:', response.data);
      return response.data;
    } catch (error) {
      console.error('[Calendar API Error] POST /calendar failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`[Calendar API] Sending DELETE /calendar/${id}`);
      const response = await apiClient.delete(`/calendar/${id}`);
      return response.data;
    } catch (error) {
      console.error(`[Calendar API Error] DELETE /calendar/${id} failed:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }
};

export default calendarApi;