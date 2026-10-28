import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Package,
  Layers,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navCategories = [
    { label: 'Catalog', path: '/shop' },
    { label: 'Men', path: '/shop?category=Men' },
    { label: 'Women', path: '/shop?category=Women' },
    { label: 'Kids', path: '/shop?category=Kids' },
    { label: 'Accessories', path: '/shop?category=Accessories' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'var(--color-header-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--color-border)',
      transition: 'all 200ms ease'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1.25rem' }}>
        
        {/* Brand Logo & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle-btn"
            style={{ display: 'none', color: 'var(--color-text)' }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link
            to={isAuthenticated ? '/home' : '/'}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              textTransform: 'uppercase'
            }}
          >
            <span>THRUST</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--watermelon)'
            }}></span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navCategories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: location.pathname + location.search === cat.path ? 'var(--watermelon)' : 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)'
              }}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* Prominent Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="navbar-search-form"
          style={{
            flex: '1',
            maxWidth: '340px',
            position: 'relative'
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search streetwear, tees, pants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.4rem',
              paddingRight: '1rem',
              paddingTop: '0.55rem',
              paddingBottom: '0.55rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-alt)',
              fontSize: '0.875rem'
            }}
          />
        </form>

        {/* Right Controls: Dark/Light Mode, Wishlist, Bag, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-alt)',
              color: isDark ? 'var(--royal-gold)' : 'var(--watermelon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Wishlist Icon */}
          <Link
            to={isAuthenticated ? '/wishlist' : '/login'}
            style={{ position: 'relative', color: 'var(--color-text)', padding: '0.4rem' }}
            title="My Wishlist"
          >
            <Heart size={21} />
            {isAuthenticated && wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--watermelon)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link
            to={isAuthenticated ? '/cart' : '/login'}
            style={{ position: 'relative', color: 'var(--color-text)', padding: '0.4rem' }}
            title="Shopping Bag"
          >
            <ShoppingBag size={21} />
            {isAuthenticated && cartItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'var(--royal-gold)',
                color: '#011936',
                fontSize: '0.65rem',
                fontWeight: 900,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* Admin Pill if Admin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="btn btn-sm btn-gold"
              style={{
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={14} /> Admin
            </Link>
          )}

          {/* User Account Menu / Auth Buttons */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)'
                }}
              >
                <User size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name?.split(' ')[0] || 'Member'}
                </span>
              </button>

              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  width: '210px',
                  padding: '0.5rem 0',
                  zIndex: 2000
                }}>
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--color-border-light)' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-text)'
                    }}
                  >
                    <User size={16} /> Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-text)'
                    }}
                  >
                    <Package size={16} /> Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.875rem',
                        color: 'var(--royal-gold)'
                      }}
                    >
                      <Layers size={16} /> Control Center
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.6rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--watermelon)',
                      borderTop: '1px solid var(--color-border-light)',
                      marginTop: '0.25rem',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Join
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          borderBottom: '1px solid var(--color-border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {navCategories.map((cat) => (
            <Link
              key={cat.label}
              to={cat.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                padding: '0.4rem 0'
              }}
            >
              {cat.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                Sign In
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                Join THRUST
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 868px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle-btn {
            display: block !important;
          }
          .navbar-search-form {
            max-width: 180px !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
