import api from './api';

export const partnerService = {
  getAllPartners: async (params = {}) => {
    const response = await api.get('/partners', { params });
    return response.data;
  },

  getPartnerById: async (id, params = {}) => {
    const response = await api.get(`/partners/${id}`, { params });
    return response.data;
  },

  getCurrentPartnerProfile: async () => {
    const response = await api.get('/partners/profile/me');
    return response.data;
  },

  updatePartnerProfile: async (data) => {
    const response = await api.put('/partners/profile', data);
    return response.data;
  },
};
