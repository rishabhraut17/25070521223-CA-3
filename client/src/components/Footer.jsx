import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer style={{
      backgroundColor: 'var(--color-footer-bg)',
      borderTop: '1px solid var(--color-border)',
      paddingTop: '4rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 900,
                color: 'var(--color-text)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginBottom: '1rem',
                textTransform: 'uppercase'
              }}
            >
              <span>THRUST</span>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--watermelon)'
              }}></span>
            </Link>
            <p style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
              marginBottom: '1.25rem'
            }}>
              Contemporary architectural apparel engineered with heavyweight natural textiles, refined silhouettes, and transparent Cash on Delivery fulfillment.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <span>280–440 GSM</span> • <span>Zero Plastic</span> • <span>Pan-India COD</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Collections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/shop?category=Men" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Men's Streetwear
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Women" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Women's Tailoring
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Kids" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Kids' Essentials
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Accessories" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Everyday Gear
                </Link>
              </li>
              <li>
                <Link to="/shop" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Complete Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Customer Care</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/orders" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Track Order Status
                </Link>
              </li>
              <li>
                <Link to="/#faq" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  FAQ & Policies
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  Cash On Delivery Guarantee
                </Link>
              </li>
              <li>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  7-Day Doorstep Returns
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem' }}>Stay Connected</h4>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Subscribe for exclusive capsule drops, seasonal previews, and member-only pricing.
            </p>
            {subscribed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10b981',
                fontSize: '0.875rem',
                fontWeight: 600
              }}>
                <CheckCircle2 size={18} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{ flex: 1, fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm" aria-label="Subscribe">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.825rem'
        }}>
          <p>© {new Date().getFullYear()} THRUST Clothing Co. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>MongoDB Local</span>
            <span>Express REST API</span>
            <span>React 18 + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
