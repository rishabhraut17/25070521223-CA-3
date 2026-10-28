import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const AdminDashboardPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('products');

  // Stats state
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products state
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Men',
    price: '',
    stock: '',
    sizes: 'S, M, L, XL',
    colours: 'Prussian Black, Chalk White',
    images: '',
    description: '',
    featured: false
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch admin stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/stats');
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.warn('Failed to load admin stats:', err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get(`/products?limit=100&search=${encodeURIComponent(productSearch)}`);
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch products', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const statusParam = orderStatusFilter !== 'All' ? `?status=${orderStatusFilter}` : '';
      const res = await api.get(`/orders/admin/all${statusParam}`);
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch orders', 'error');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get('/users');
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, orderStatusFilter]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Men',
      price: '',
      stock: '25',
      sizes: 'S, M, L, XL',
      colours: 'Prussian Black, Chalk White',
      images: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      description: '',
      featured: false
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      stock: p.stock.toString(),
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes,
      colours: Array.isArray(p.colours) ? p.colours.join(', ') : p.colours,
      images: Array.isArray(p.images) ? p.images.join(', ') : p.images,
      description: p.description,
      featured: p.featured || false
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name.trim(),
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock, 10),
        sizes: productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        colours: productForm.colours.split(',').map((c) => c.trim()).filter(Boolean),
        images: productForm.images.split(',').map((img) => img.trim()).filter(Boolean),
        description: productForm.description.trim(),
        featured: productForm.featured
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        showToast('Garment updated successfully', 'success');
      } else {
        await api.post('/products', payload);
        showToast('New garment added to catalog', 'success');
      }

      setShowProductModal(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this garment from the THRUST catalog?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted', 'info');
      fetchProducts();
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to ${newStatus}`, 'success');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      fetchStats();
    } catch (err) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '85vh' }}>
      
      {/* Admin Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--watermelon)',
          marginBottom: '0.5rem'
        }}>
          <Layers size={14} /> Store Management Portal
        </div>
        <h1 style={{ fontSize: '2.25rem' }}>THRUST Control Center</h1>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Revenue</span>
            <TrendingUp size={20} style={{ color: '#10b981' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 900, color: 'var(--watermelon)' }}>
            ₹{stats ? Number(stats.totalRevenue).toLocaleString('en-IN') : '0'}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            From non-cancelled deliveries
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Orders</span>
            <Package size={20} style={{ color: 'var(--royal-gold)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 900 }}>
            {stats ? stats.totalOrders : '0'}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Customer purchase records
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Catalog</span>
            <ShoppingBag size={20} style={{ color: 'var(--color-text)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 900 }}>
            {stats ? stats.totalProducts : '0'}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Across 4 apparel lines
          </p>
        </div>

        <div style={{
          backgroundColor: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Registered Users</span>
            <Users size={20} style={{ color: '#38bdf8' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 900 }}>
            {stats ? stats.totalUsers : '0'}
          </span>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Shopper and admin accounts
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '2rem',
        gap: '2rem'
      }}>
        {[
          { id: 'products', label: 'Products Management' },
          { id: 'orders', label: 'Order Fulfillment' },
          { id: 'users', label: 'Customer Directory' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.85rem 0.5rem',
              fontSize: '1rem',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? 'var(--watermelon)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--watermelon)' : '2px solid transparent',
              marginBottom: '-1px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                style={{ width: '100%', paddingLeft: '2.5rem', fontSize: '0.875rem' }}
              />
            </div>

            <button onClick={handleOpenCreateModal} className="btn btn-primary">
              <Plus size={16} /> Add Garment
            </button>
          </div>

          {loadingProducts ? (
            <div className="spinner"></div>
          ) : (
            <div style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Garment</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Stock</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Sizes</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Featured</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img
                            src={p.images?.[0] || ''}
                            alt=""
                            style={{ width: '40px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                          />
                          <span style={{ fontWeight: 700 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>{p.category}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          fontWeight: 700,
                          color: p.stock < 5 ? 'var(--watermelon)' : 'var(--color-text)'
                        }}>
                          {p.stock}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                        {p.sizes?.join(', ')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {p.featured ? (
                          <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>Featured</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-subtle)' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="btn btn-outline btn-sm"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="btn btn-outline btn-sm"
                            style={{ color: 'var(--watermelon)' }}
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Filter Status:</span>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {loadingOrders ? (
            <div className="spinner"></div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>No customer orders found under this status filter.</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Order ID</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Items</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Total</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Method</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Current Status</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700 }}>
                        #{o._id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div>
                          <strong style={{ display: 'block' }}>{o.user?.name || o.shippingAddress?.fullName}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{o.user?.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {o.items?.length} pcs
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--watermelon)' }}>
                        ₹{o.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{o.paymentMethod}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge badge-${o.status.toLowerCase()}`}>
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: USER LIST */}
      {activeTab === 'users' && (
        <div>
          {loadingUsers ? (
            <div className="spinner"></div>
          ) : (
            <div style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Email</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Phone</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{u.name}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-processing'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                        {u.phone || '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--color-text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.35rem' }}>
                {editingProduct ? 'Edit Garment Details' : 'Add New Garment to Catalog'}
              </h2>
              <button onClick={() => setShowProductModal(false)} style={{ color: 'var(--color-text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Garment Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price in ₹ (Rs) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    className="form-control"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productForm.sizes}
                    onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Colours (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={productForm.colours}
                  onChange={(e) => setProductForm({ ...productForm, colours: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL(s) (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Garment Description *</label>
                <textarea
                  rows="3"
                  required
                  className="form-control"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                ></textarea>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                />
                <span>Feature this product on flagship highlights</span>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Updates' : 'Create Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
