import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Banknote,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { cart, subtotal, fetchCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Shipping Address Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Pre-fill if user has a default saved address
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setFormData({
        fullName: defaultAddr.fullName || user.name || '',
        phone: defaultAddr.phone || user.phone || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        postalCode: defaultAddr.postalCode || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      setError('Please fill in all required shipping address fields');
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      setError('Your shopping bag is empty. Please add garments before checking out.');
      return;
    }

    try {
      setLoading(true);

      if (saveAddressToProfile && (!user?.addresses || user.addresses.length === 0)) {
        try {
          await api.put('/users/profile', {
            phone: formData.phone,
            addresses: [{ ...formData, isDefault: true }]
          });
        } catch (addrErr) {
          console.warn('Address saving skipped:', addrErr.message);
        }
      }

      // Format items for order
      const orderItems = cart.items.map((item) => ({
        product: item.product?._id || item.product,
        name: item.product?.name || 'Garment',
        price: Number(item.product?.price || 0),
        size: item.size,
        colour: item.colour,
        quantity: item.quantity,
        image: item.product?.images?.[0] || ''
      }));

      const response = await api.post('/orders', {
        items: orderItems,
        shippingAddress: formData,
        paymentMethod: 'Cash on Delivery'
      });

      if (response.success && response.order) {
        setOrderSuccess(response.order);
        showToast('Order confirmed! Inventory updated.', 'success');
        await fetchCart();
      } else {
        setError(response.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please review stock availability.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '560px',
          margin: '0 auto',
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '3rem 2rem',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            THRUST Order #{orderSuccess._id.slice(-6).toUpperCase()}
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Thank you, {formData.fullName}. Your order has been placed successfully in our system and stock has been securely allocated.
          </p>

          <div style={{
            backgroundColor: 'var(--color-bg-alt)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            fontSize: '0.9rem',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Payment Method:</span>
              <strong>Cash on Delivery (COD)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Delivery Address:</span>
              <strong style={{ textAlign: 'right' }}>{formData.street}, {formData.city}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Total Amount Due:</span>
              <strong style={{ color: 'var(--watermelon)', fontSize: '1.25rem' }}>
                ₹{orderSuccess.totalAmount.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary">
              View My Orders
            </Link>
            <Link to="/shop" className="btn btn-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
          <ChevronLeft size={16} /> Return to Shopping Bag
        </Link>
        <h1 style={{ fontSize: '2.25rem' }}>Checkout & Delivery</h1>
      </div>

      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.25rem',
          backgroundColor: 'rgba(237, 37, 78, 0.15)',
          border: '1px solid var(--watermelon)',
          color: 'var(--watermelon)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Shipping Address & Payment Method */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Step 1: Shipping Address Form */}
            <div style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <MapPin size={20} style={{ color: 'var(--watermelon)' }} />
                <h2 style={{ fontSize: '1.35rem' }}>1. Delivery Address</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="fullName">Full Recipient Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Rishabh Raut"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="phone">Phone Number (for courier SMS updates) *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="form-control"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="street">Street Address & Apartment / Landmark *</label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Flat 402, Skyline Towers, Fashion St"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">City *</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Pune"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="state">State</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="form-control"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="postalCode">Postal PIN Code *</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    className="form-control"
                    placeholder="411001"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={saveAddressToProfile}
                  onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                />
                <span>Save this address for upcoming THRUST orders</span>
              </label>
            </div>

            {/* Step 2: Payment Method (Cash on Delivery ONLY) */}
            <div style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Banknote size={20} style={{ color: '#10b981' }} />
                <h2 style={{ fontSize: '1.35rem' }}>2. Payment Method</h2>
              </div>

              <div style={{
                border: '2px solid var(--watermelon)',
                backgroundColor: 'var(--color-bg-alt)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  defaultChecked
                  style={{ marginTop: '4px', accentColor: 'var(--watermelon)' }}
                />
                <div>
                  <label htmlFor="cod" style={{ fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'block', color: 'var(--color-text)' }}>
                    Cash on Delivery (COD)
                  </label>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    Pay in cash directly to our delivery courier when your package arrives at your doorstep. No advance online payment or credit card is required.
                  </p>
                  <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--royal-gold)', textTransform: 'uppercase' }}>
                    ✓ 100% Risk-Free Delivery
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Review */}
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '90px'
          }}>
            <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Review Garments ({cart.items.reduce((acc, i) => acc + i.quantity, 0)})</h2>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '260px',
              overflowY: 'auto',
              marginBottom: '1.5rem',
              paddingRight: '0.5rem'
            }}>
              {cart.items.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  <img
                    src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                    alt=""
                    style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product?.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Size: {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                    ₹{((Number(item.product?.price) || 0) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-light)', marginBottom: '1rem' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>Doorstep Delivery</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                <span>COD Handling</span>
                <span>₹0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                <span>Total Payable</span>
                <span style={{ color: 'var(--watermelon)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.items.length === 0}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '0.95rem' }}
            >
              {loading ? 'Processing Order...' : 'Confirm & Place COD Order'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <Truck size={14} /> Delivered within 3-5 business days across India
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
