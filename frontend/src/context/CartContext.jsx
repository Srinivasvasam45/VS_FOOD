import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({
    items: [],
    restaurant: null,
    subtotal: 0,
    deliveryFee: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Single-restaurant conflict modal state
  const [conflictModal, setConflictModal] = useState({
    isOpen: false,
    foodId: null,
    quantity: 1,
    currentRestaurant: '',
    newRestaurant: '',
  });

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({
        items: [],
        restaurant: null,
        subtotal: 0,
        deliveryFee: 0,
        totalAmount: 0,
      });
      return;
    }

    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (foodId, quantity = 1, forceReset = false) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true };
    }

    try {
      setLoading(true);
      const res = await cartService.addToCart(foodId, quantity, forceReset);
      if (res.success && res.data) {
        setCart(res.data);
        return { success: true, data: res.data };
      }
      return { success: false, message: res.message };
    } catch (error) {
      // Check for 409 conflict
      if (error.response && error.response.status === 409 && error.response.data?.conflict) {
        const conflictData = error.response.data;
        setConflictModal({
          isOpen: true,
          foodId,
          quantity,
          currentRestaurant: conflictData.currentRestaurant,
          newRestaurant: conflictData.newRestaurant,
        });
        return { success: false, conflict: true };
      }
      const message = error.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const resolveConflict = async (shouldClearAndAdd) => {
    const { foodId, quantity } = conflictModal;
    setConflictModal({
      isOpen: false,
      foodId: null,
      quantity: 1,
      currentRestaurant: '',
      newRestaurant: '',
    });

    if (shouldClearAndAdd && foodId) {
      return await addToCart(foodId, quantity, true);
    }
    return { success: false, cancelled: true };
  };

  const updateQuantity = async (foodId, quantity) => {
    try {
      const res = await cartService.updateCartItem(foodId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      return { success: false };
    }
  };

  const removeItem = async (foodId) => {
    try {
      const res = await cartService.removeCartItem(foodId);
      if (res.success && res.data) {
        setCart(res.data);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to remove item:', error);
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartService.clearCart();
      if (res.success && res.data) {
        setCart(res.data);
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false };
    }
  };

  const itemCount = cart.items ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items || [],
        restaurant: cart.restaurant,
        subtotal: cart.subtotal || 0,
        deliveryFee: cart.deliveryFee || 0,
        totalAmount: cart.totalAmount || 0,
        itemCount,
        loading,
        isDrawerOpen,
        setIsDrawerOpen,
        conflictModal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        resolveConflict,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
