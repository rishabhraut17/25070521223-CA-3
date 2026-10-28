import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('details');

  // Personal details state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    isDefault: false
  });

  // Password state
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPass, setUpdatingPass] = useState(false);
  const [passError, setPassError] = useState('');

  // Handle personal details submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      await updateProfile({ name, phone });
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Handle add address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.street || !newAddr.city || !newAddr.postalCode) {
      showToast('Please fill all required address fields', 'error');
      return;
    }

    try {
      const updatedList = [...addresses, newAddr];
      await updateProfile({ addresses: updatedList });
      setAddresses(updatedList);
      setShowAddressForm(false);
      setNewAddr({ fullName: user?.name || '', phone: user?.phone || '', street: '', city: '', state: '', postalCode: '', isDefault: false });
      showToast('New shipping address saved', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save address', 'error');
    }
  };

  // Handle delete address
  const handleDeleteAddress = async (index) => {
    try {
      const updatedList = addresses.filter((_, idx) => idx !== index);
      await updateProfile({ addresses: updatedList });
      setAddresses(updatedList);
      showToast('Address removed', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove address', 'error');
    }
  };

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');

    if (passData.newPassword.length < 6) {
      setPassError('New password must be at least 6 characters');
      return;
    }
    if (passData.newPassword !== passData.confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }

    try {
      setUpdatingPass(true);
      await updatePassword(passData);
      showToast('Password changed successfully', 'success');
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.message || 'Failed to change password');
    } finally {
      setUpdatingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '80vh', maxWidth: '880px' }}>
      
      {/* Profile Header */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)'
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.5rem' }}>{user?.name}</h1>
              {user?.role === 'admin' && (
                <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} /> Administrator
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
          style={{ color: 'var(--color-danger)', borderColor: '#fca5a5' }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '2rem',
        gap: '1.5rem'
      }}>
        {[
          { id: 'details', label: 'Personal Information', icon: User },
          { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
          { id: 'security', label: 'Security & Password', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 0.5rem',
                fontSize: '0.92rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginBottom: '-1px'
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Personal Details */}
      {activeTab === 'details' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Edit Personal Details</h2>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address (Unique identifier)</label>
              <input
                id="profile-email"
                type="email"
                className="form-control"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-phone">Primary Contact Phone</label>
              <input
                id="profile-phone"
                type="tel"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {updatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Addresses */}
      {activeTab === 'addresses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Delivery Addresses</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="btn btn-outline btn-sm"
            >
              <Plus size={16} /> Add Address
            </button>
          </div>

          {showAddressForm && (
            <form
              onSubmit={handleAddAddress}
              style={{
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}
            >
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Street and house number"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal Code *</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="btn btn-outline btn-sm">Cancel</button>
              </div>
            </form>
          )}

          {addresses.length === 0 && !showAddressForm ? (
            <div className="empty-state">
              <MapPin size={40} style={{ color: 'var(--color-text-subtle)', margin: '0 auto 0.5rem' }} />
              <p>No delivery addresses saved yet. Add an address for instant checkout.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    position: 'relative'
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                    {addr.fullName}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.postalCode}<br />
                    Phone: {addr.phone}
                  </p>
                  <button
                    onClick={() => handleDeleteAddress(idx)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--color-danger)' }}
                    title="Delete address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Security & Password */}
      {activeTab === 'security' && (
        <div style={{
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Change Account Password</h2>

          {passError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} />
              <span>{passError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current Password</label>
              <input
                id="currentPassword"
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={passData.currentPassword}
                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password (min 6 characters)</label>
              <input
                id="newPassword"
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={passData.newPassword}
                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={passData.confirmPassword}
                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={updatingPass}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              {updatingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
