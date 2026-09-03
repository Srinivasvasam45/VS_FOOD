import api from './api';

export const foodService = {
  getFoods: async (params = {}) => {
    const response = await api.get('/foods', { params });
    return response.data;
  },

  getFoodById: async (id, params = {}) => {
    const response = await api.get(`/foods/${id}`, { params });
    return response.data;
  },

  createFood: async (formData) => {
    const response = await api.post('/foods', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateFood: async (id, formData) => {
    const response = await api.put(`/foods/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFood: async (id) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  },
};
