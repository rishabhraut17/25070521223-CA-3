import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, confirmPassword);
      showToast('Registration successful! Welcome to FLEXI.', 'success');
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      backgroundColor: 'var(--mint-cream)'
    }}>
      {/* High-Fashion Editorial Split Screen (Inspired by Image 1) */}
      <div style={{
        width: '100%',
        maxWidth: '1050px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(1, 25, 54, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        border: '1px solid rgba(70, 83, 98, 0.15)'
      }}>
        
        {/* Left Column: Form & Editorial Typography */}
        <div style={{
          padding: 'clamp(2rem, 5vw, 3.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'var(--watermelon)',
              display: 'block',
              marginBottom: '0.5rem'
            }}>
              Join the Collective
            </span>
            <h1 className="font-editorial" style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--prussian-blue)',
              lineHeight: 1.15
            }}>
              Create account
            </h1>
            <p style={{
              color: 'var(--charcoal-blue)',
              fontSize: '0.92rem',
              marginTop: '0.5rem',
              fontStyle: 'italic',
              fontFamily: 'var(--font-serif)'
            }}>
              The faster you fill up, the faster you get access to exclusive drops.
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid #fecaca',
              color: 'var(--watermelon)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="name" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1.5px solid var(--charcoal-blue)',
                    borderRadius: 0,
                    padding: '0.65rem 0',
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    color: 'var(--prussian-blue)'
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="email" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1.5px solid var(--charcoal-blue)',
                    borderRadius: 0,
                    padding: '0.65rem 0',
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    color: 'var(--prussian-blue)'
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="password" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Password (min 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1.5px solid var(--charcoal-blue)',
                    borderRadius: 0,
                    padding: '0.65rem 0',
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    color: 'var(--prussian-blue)'
                  }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="confirmPassword" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1.5px solid var(--charcoal-blue)',
                    borderRadius: 0,
                    padding: '0.65rem 0',
                    backgroundColor: 'transparent',
                    fontSize: '1rem',
                    color: 'var(--prussian-blue)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--charcoal-blue)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--prussian-blue)' }}
                />
                <span>Remember me</span>
              </label>
              <Link to="/login" style={{ color: 'var(--watermelon)', fontWeight: 600 }}>
                Already a member?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--prussian-blue)',
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginTop: '1rem'
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={{
            fontSize: '0.8rem',
            color: 'var(--color-text-subtle)',
            textAlign: 'center',
            marginTop: '2rem'
          }}>
            By signing up, you agree to our Terms of Service & Privacy Policy.
          </p>
        </div>

        {/* Right Column: Editorial Visual with Artistic Liquid Wave Aesthetic */}
        <div style={{
          position: 'relative',
          minHeight: '480px',
          backgroundColor: 'var(--prussian-blue)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem'
        }}>
          {/* Background Fashion Portrait */}
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
            alt="Editorial Campaign"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.05) brightness(0.9)'
            }}
          />

          {/* Liquid Glass Overlay Effect */}
          <div style={{
            position: 'absolute',
            top: '25%',
            left: 0,
            width: '100%',
            height: '140px',
            background: 'linear-gradient(90deg, rgba(237, 37, 78, 0.45), rgba(249, 220, 92, 0.4), rgba(244, 255, 253, 0.55))',
            backdropFilter: 'blur(8px) saturate(180%)',
            transform: 'skewY(-6deg) scale(1.1)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}></div>

          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(1, 25, 54, 0.85) 0%, rgba(1, 25, 54, 0.1) 60%)',
            pointerEvents: 'none'
          }}></div>

          {/* Top Brand Watermark */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontStyle: 'italic',
              color: 'var(--mint-cream)',
              opacity: 0.9,
              letterSpacing: '0.05em'
            }}>
              Flexi.
            </span>
          </div>

          {/* Bottom Caption & Badge */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              Spring 2026 Collection
            </span>
            <h2 className="font-editorial" style={{
              color: '#ffffff',
              fontSize: '2rem',
              fontWeight: 700,
              lineHeight: 1.15
            }}>
              Aura & Form
            </h2>
            <p style={{
              color: 'rgba(244, 255, 253, 0.8)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-serif)',
              marginTop: '0.25rem'
            }}>
              Curated everyday garments with architectural integrity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
