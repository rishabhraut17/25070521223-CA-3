import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, subtotal, updateQuantity, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (loading) {
    return (
      <div className="container loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p>Retrieving your THRUST shopping bag...</p>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="empty-state" style={{ maxWidth: '540px', margin: '0 auto' }}>
          <div className="empty-state-icon">
            <ShoppingBag size={48} style={{ color: 'var(--watermelon)' }} />
          </div>
          <h2>Your Shopping Bag is Empty</h2>
          <p>
            You haven't added any pieces to your bag yet. Discover our curated streetwear catalog to find your fit.
          </p>
          <Link to="/shop" className="btn btn-primary btn-lg" style={{ marginTop: '1rem' }}>
            Explore Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Shopping Bag</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>
        {cart.items.reduce((acc, i) => acc + i.quantity, 0)} total pieces selected
      </p>

      {/* Free Shipping Progress in Rs */}
      <div style={{
        backgroundColor: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          <span>
            {isFreeShipping ? '🎉 Free Doorstep Delivery Unlocked!' : `Add ₹${(freeShippingThreshold - subtotal).toLocaleString('en-IN')} more for Free Express Delivery!`}
          </span>
          <span style={{ color: 'var(--royal-gold)', fontWeight: 700 }}>{progressPercent}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--color-border)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: isFreeShipping ? '#10b981' : 'var(--watermelon)',
            transition: 'width 0.4s ease'
          }}></div>
        </div>
      </div>

      {/* Grid: Items List + Order Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.items.map((item) => {
            const product = item.product || {};
            const itemPrice = Number(product.price || 0);
            const itemTotal = itemPrice * item.quantity;
            const mainImg = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

            return (
              <div
                key={item._id}
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Thumbnail */}
                <Link to={`/product/${product._id}`} style={{ flexShrink: 0 }}>
                  <img
                    src={mainImg}
                    alt={product.name || 'Garment'}
                    style={{
                      width: '90px',
                      height: '110px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-bg-alt)'
                    }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {product.name || 'Apparel Item'}
                    </h3>
                  </Link>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    <span>Size: <strong style={{ color: 'var(--color-text)' }}>{item.size}</strong></span>
                    <span>•</span>
                    <span>Colour: <strong style={{ color: 'var(--color-text)' }}>{item.colour}</strong></span>
                    <span>•</span>
                    <span>Unit: <strong>₹{itemPrice.toLocaleString('en-IN')}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {/* Quantity Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-alt)'
                    }}>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{ padding: '0.4rem 0.75rem', fontWeight: 800, color: 'var(--color-text)' }}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span style={{ width: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ padding: '0.4rem 0.75rem', fontWeight: 800, color: 'var(--color-text)' }}
                      >
                        +
                      </button>
                    </div>

                    {/* Price and Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text)' }}>
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeItem(item._id)}
                        style={{ color: 'var(--watermelon)', cursor: 'pointer', padding: '0.25rem' }}
                        title="Remove from bag"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary */}
        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          top: '90px'
        }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Order Summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
              <span>Subtotal ({cart.items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
              <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
              <span>Estimated Delivery</span>
              <span style={{ fontWeight: 700, color: isFreeShipping ? '#10b981' : 'var(--color-text)' }}>
                {isFreeShipping ? 'FREE' : '₹99'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
              <span>Payment Fee (COD)</span>
              <span style={{ fontWeight: 700, color: '#10b981' }}>₹0</span>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 700 }}>
              <span>Total Payable</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: 'var(--watermelon)' }}>
                ₹{(subtotal + (isFreeShipping ? 0 : 99)).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <Link
            to="/shop"
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)'
            }}
          >
            Continue Shopping
          </Link>

          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--royal-gold)' }} />
              <span>Cash on Delivery — pay only upon package receipt</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCcw size={16} style={{ color: 'var(--watermelon)' }} />
              <span>7-day risk-free exchange or doorstep return</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
