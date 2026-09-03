import api from './api';

export const reviewService = {
  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getFoodReviews: async (foodId) => {
    const response = await api.get(`/reviews/${foodId}`);
    return response.data;
  },
};
