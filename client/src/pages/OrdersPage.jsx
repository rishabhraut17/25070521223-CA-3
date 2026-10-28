import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  MapPin,
  Ban,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      if (response.success) {
        setOrders(response.orders || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored immediately.')) {
      return;
    }

    try {
      setCancellingId(orderId);
      const response = await api.put(`/orders/${orderId}/cancel`);
      if (response.success && response.order) {
        showToast('Order cancelled successfully. Stock restored.', 'info');
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? response.order : o))
        );
      }
    } catch (err) {
      showToast(err.message || 'Could not cancel order', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p>Loading your THRUST order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="empty-state" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="empty-state-icon">
            <Package size={48} style={{ color: 'var(--watermelon)' }} />
          </div>
          <h2>No Orders Placed Yet</h2>
          <p>You haven't placed any orders yet. Discover our latest minimal drops and check out with Cash on Delivery.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '80vh', maxWidth: '960px' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>My Orders</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Review purchase history, courier status, and manage cancellations.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map((order) => {
          const isExpanded = expandedId === order._id;
          const canCancel = order.status === 'Placed' || order.status === 'Processing';

          return (
            <div
              key={order._id}
              style={{
                backgroundColor: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {/* Order Card Header */}
              <div style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Order Placed
                    </span>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Total
                    </span>
                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--watermelon)' }}>
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Ship To
                    </span>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {order.shippingAddress?.fullName}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order._id)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem 0.65rem' }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        style={{
                          width: '56px',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-bg-alt)'
                        }}
                      />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                          Size: {item.size} • Colour: {item.colour} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div style={{
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border-light)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.5rem',
                    backgroundColor: 'var(--color-bg-alt)',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Shipping Address
                      </h5>
                      <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {order.shippingAddress?.fullName}<br />
                        {order.shippingAddress?.street}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                        Phone: {order.shippingAddress?.phone}
                      </p>
                    </div>

                    <div>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Payment Details
                      </h5>
                      <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        Method: <strong>{order.paymentMethod}</strong><br />
                        Status: Pay on delivery<br />
                        Tracking ID: {order._id}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer Actions */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border-light)'
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Order ID: #{order._id}
                  </span>

                  {canCancel ? (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={cancellingId === order._id}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--watermelon)', borderColor: 'rgba(237, 37, 78, 0.4)' }}
                    >
                      <Ban size={14} />
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  ) : order.status === 'Cancelled' ? (
                    <span style={{ fontSize: '0.8rem', color: 'var(--watermelon)', fontStyle: 'italic', fontWeight: 600 }}>
                      Order Cancelled (Stock Restored)
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
                      Dispatched with Courier
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
