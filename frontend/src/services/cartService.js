import api from './api';

export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (foodId, quantity = 1, forceReset = false) => {
    const response = await api.post('/cart', {
      foodId,
      quantity,
      forceReset,
    });
    return response.data;
  },

  updateCartItem: async (foodId, quantity) => {
    const response = await api.put(`/cart/${foodId}`, { quantity });
    return response.data;
  },

  removeCartItem: async (foodId) => {
    const response = await api.delete(`/cart/${foodId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
