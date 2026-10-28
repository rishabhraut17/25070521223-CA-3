import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/wishlist');
      if (response.success) {
        setWishlist(response.wishlist || []);
      }
    } catch (err) {
      console.warn('Failed to load wishlist:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      showToast('Please log in to save items to your wishlist', 'info');
      return;
    }

    const productId = product._id || product;
    const exists = isInWishlist(productId);

    try {
      if (exists) {
        const response = await api.delete(`/wishlist/${productId}`);
        if (response.success) {
          setWishlist(response.wishlist || []);
          showToast('Removed from wishlist', 'info');
        }
      } else {
        const response = await api.post(`/wishlist/${productId}`);
        if (response.success) {
          setWishlist(response.wishlist || []);
          showToast('Saved to wishlist', 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Could not update wishlist', 'error');
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      if (response.success) {
        setWishlist(response.wishlist || []);
        showToast('Removed from wishlist', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Could not remove item from wishlist', 'error');
    }
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    loading,
    fetchWishlist,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
