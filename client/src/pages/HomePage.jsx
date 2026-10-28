import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  Package,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const { user } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [recentOrder, setRecentOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const featRes = await api.get('/products?featured=true&limit=4');
        if (featRes.success) setFeaturedProducts(featRes.products || []);

        const newRes = await api.get('/products?sort=newest&limit=4');
        if (newRes.success) setNewArrivals(newRes.products || []);

        const ordersRes = await api.get('/orders');
        if (ordersRes.success && ordersRes.orders && ordersRes.orders.length > 0) {
          setRecentOrder(ordersRes.orders[0]);
        }
      } catch (err) {
        console.warn('Failed to load dashboard data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      {/* 1. WELCOME HERO & QUICK METRICS */}
      <div style={{
        backgroundColor: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--royal-gold)',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={14} style={{ color: 'var(--watermelon)' }} /> THRUST Member Portal
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Member'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '520px' }}>
            Your personal hub for streetwear drops, curated wishlist, order tracking, and shopping bag.
          </p>
        </div>

        {/* Metric Badges */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link
            to="/cart"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              minWidth: '160px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(249, 220, 92, 0.15)',
              color: 'var(--royal-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, display: 'block', lineHeight: 1, color: 'var(--color-text)' }}>{cartItemsCount}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Bag Pieces</span>
            </div>
          </Link>

          <Link
            to="/wishlist"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              minWidth: '160px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(237, 37, 78, 0.15)',
              color: 'var(--watermelon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={20} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, display: 'block', lineHeight: 1, color: 'var(--color-text)' }}>{wishlistCount}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Saved Wishlist</span>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. RECENT ORDER STATUS (IF ANY) */}
      {recentOrder && (
        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-bg-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--watermelon)'
            }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Order #{recentOrder._id.slice(-6).toUpperCase()}</span>
                <span className={`badge badge-${recentOrder.status.toLowerCase()}`}>
                  {recentOrder.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {recentOrder.items.length} garments • Total: ₹{recentOrder.totalAmount.toLocaleString('en-IN')} • Placed on {new Date(recentOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <Link to="/orders" className="btn btn-outline btn-sm">
            View All Orders <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* 3. QUICK ACCESS TILES */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Quick Navigation</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { label: 'Men\'s Collection', path: '/shop?category=Men', desc: 'Outerwear, tees & cargos' },
            { label: 'Women\'s Collection', path: '/shop?category=Women', desc: 'Dresses, knits & denim' },
            { label: 'Kids\' Essentials', path: '/shop?category=Kids', desc: 'Everyday playwear' },
            { label: 'Accessories', path: '/shop?category=Accessories', desc: 'Bags, beanies & belts' }
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{item.label}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--watermelon)', marginTop: '1rem' }}>
                Explore <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. FEATURED PRODUCTS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Flagship Highlights</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Handpicked customer favourites this week.
            </p>
          </div>
          <Link to="/shop?featured=true" className="btn btn-outline btn-sm">
            View All Featured <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* 5. NEW ARRIVALS */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem' }}>Fresh Drops</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              The latest silhouettes added to the catalog.
            </p>
          </div>
          <Link to="/shop?sort=newest" className="btn btn-outline btn-sm">
            Shop Newest <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="product-grid">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default HomePage;
