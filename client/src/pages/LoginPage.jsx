import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email.trim(), password);
      showToast('Logged in successfully', 'success');
      if (res.user?.role === 'admin' && from === '/home') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: '#0a0f1d'
    }}>
      {/* Browser Window Frame (Inspired by Image 3 - Openartistic.io aesthetic) */}
      <div style={{
        width: '100%',
        maxWidth: '1100px',
        backgroundColor: 'var(--prussian-blue)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(37, 99, 235, 0.15)',
        border: '1px solid rgba(244, 255, 253, 0.12)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Top Browser Window Header */}
        <div style={{
          backgroundColor: '#031024',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderBottom: '1px solid rgba(244, 255, 253, 0.08)'
        }}>
          {/* macOS window dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ff5f56', display: 'inline-block' }}></span>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ffbd2e', display: 'inline-block' }}></span>
            <span style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#27c93f', display: 'inline-block' }}></span>
          </div>

          {/* Browser URL pill */}
          <div style={{
            flex: 1,
            maxWidth: '380px',
            margin: '0 auto',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(244, 255, 253, 0.1)',
            borderRadius: 'var(--radius-full)',
            padding: '0.25rem 0.85rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'rgba(244, 255, 253, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.35rem'
          }}>
            <Lock size={11} style={{ color: 'var(--royal-gold)' }} />
            <span>flexi.store/auth/login</span>
          </div>
        </div>

        {/* Split Screen Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          minHeight: '560px'
        }}>
          
          {/* Left Column: Artistic Visual with Atmospheric Lighting */}
          <div style={{
            position: 'relative',
            backgroundColor: '#020b18',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '3rem 2.5rem',
            borderRight: '1px solid rgba(244, 255, 253, 0.08)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=1000&auto=format&fit=crop&q=80"
              alt="Artistic Backdrop"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.65,
                filter: 'brightness(0.85) contrast(1.1)'
              }}
            />
            {/* Atmospheric Blue / Watermelon gradient wash */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(1, 25, 54, 0.95) 0%, rgba(1, 25, 54, 0.3) 50%, rgba(237, 37, 78, 0.2) 100%)',
              pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <span style={{
                color: 'var(--royal-gold)',
                fontSize: '0.9rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                Contemporary Minimalist Apparel
              </span>
              <h2 style={{
                color: 'var(--mint-cream)',
                fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem'
              }}>
                Anything you can Imagine.
              </h2>
              <p style={{ color: 'rgba(244, 255, 253, 0.75)', fontSize: '0.95rem' }}>
                Seamless styling, natural textiles, and instant Cash on Delivery fulfillment.
              </p>
            </div>
          </div>

          {/* Right Column: Deep Dark Form with Glowing Focus Borders */}
          <div style={{
            backgroundColor: 'var(--prussian-blue)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: 'var(--mint-cream)'
          }}>
            
            <div style={{ marginBottom: '2rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'rgba(244, 255, 253, 0.65)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
                marginBottom: '0.35rem'
              }}>
                Login your account
              </span>
              <h1 style={{
                color: 'var(--mint-cream)',
                fontSize: '2.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '0.4rem'
              }}>
                Welcome Back!
              </h1>
              <p style={{ color: 'rgba(244, 255, 253, 0.6)', fontSize: '0.9rem' }}>
                Enter your email and password to proceed
              </p>
            </div>

            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(237, 37, 78, 0.15)',
                border: '1px solid var(--watermelon)',
                color: 'var(--watermelon)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="login-email" style={{ color: 'rgba(244, 255, 253, 0.85)', fontSize: '0.85rem' }}>
                  Email address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(244, 255, 253, 0.45)'
                    }}
                  />
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="Hello@flexi.store"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.8rem',
                      backgroundColor: 'rgba(255, 255, 253, 0.06)',
                      border: '1px solid rgba(244, 255, 253, 0.15)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--mint-cream)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="login-pass" style={{ color: 'rgba(244, 255, 253, 0.85)', fontSize: '0.85rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(244, 255, 253, 0.45)'
                    }}
                  />
                  <input
                    id="login-pass"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '2.8rem',
                      backgroundColor: 'rgba(255, 255, 253, 0.06)',
                      border: '1px solid rgba(244, 255, 253, 0.15)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--mint-cream)',
                      fontSize: '0.95rem',
                      boxShadow: '0 0 15px rgba(37, 99, 235, 0.15)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.85rem' }}>
                <span style={{ color: 'rgba(244, 255, 253, 0.65)', cursor: 'pointer' }}>
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)'
                }}
              >
                {loading ? 'Authenticating...' : 'Sign in'}
              </button>
            </form>

            {/* Quick One-Click Demo Credentials */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(244, 255, 253, 0.1)'
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--royal-gold)',
                marginBottom: '0.75rem',
                textAlign: 'center'
              }}>
                Instant Demo Credentials
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => fillCredentials('customer@flexi.com', 'CustomerPass123!')}
                  className="btn btn-glass btn-sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  <User size={14} /> Customer
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@flexi.com', 'AdminPass123!')}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: 'rgba(237, 37, 78, 0.25)',
                    border: '1px solid var(--watermelon)',
                    color: 'var(--mint-cream)',
                    fontSize: '0.8rem'
                  }}
                >
                  <ShieldCheck size={14} /> Admin
                </button>
              </div>
            </div>

            <p style={{
              textAlign: 'center',
              marginTop: '1.75rem',
              fontSize: '0.875rem',
              color: 'rgba(244, 255, 253, 0.65)'
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--watermelon)', fontWeight: 600 }}>
                Register here
              </Link>
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
