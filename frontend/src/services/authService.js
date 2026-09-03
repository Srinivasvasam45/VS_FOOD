import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors on logout
    }
  },

  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateUserProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};
