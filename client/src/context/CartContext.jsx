import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState({ items: [] });
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch cart whenever user authentication changes
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      setSubtotal(0);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/cart');
      if (response.success && response.cart) {
        setCart(response.cart);
        setSubtotal(response.subtotal || 0);
      }
    } catch (err) {
      console.warn('Failed to load cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Calculate items count
  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = async (productId, size, colour, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please log in to add items to your cart', 'info');
      return false;
    }

    try {
      const response = await api.post('/cart', {
        productId,
        size,
        colour,
        quantity
      });
      if (response.success && response.cart) {
        setCart(response.cart);
        // Recalculate subtotal
        let newSubtotal = 0;
        response.cart.items.forEach(item => {
          if (item.product && item.product.price) {
            newSubtotal += item.product.price * item.quantity;
          }
        });
        setSubtotal(newSubtotal);
        showToast('Item added to bag', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Failed to add item to bag', 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      if (response.success && response.cart) {
        setCart(response.cart);
        let newSubtotal = 0;
        response.cart.items.forEach(item => {
          if (item.product && item.product.price) {
            newSubtotal += item.product.price * item.quantity;
          }
        });
        setSubtotal(newSubtotal);
      }
    } catch (err) {
      showToast(err.message || 'Could not update quantity', 'error');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      if (response.success && response.cart) {
        setCart(response.cart);
        let newSubtotal = 0;
        response.cart.items.forEach(item => {
          if (item.product && item.product.price) {
            newSubtotal += item.product.price * item.quantity;
          }
        });
        setSubtotal(newSubtotal);
        showToast('Item removed from bag', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCart({ items: [] });
      setSubtotal(0);
    } catch (err) {
      console.warn('Error clearing cart:', err.message);
    }
  };

  const value = {
    cart,
    cartItemsCount,
    subtotal,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
