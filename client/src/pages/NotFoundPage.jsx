import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="container" style={{
      minHeight: '65vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '4rem 1.5rem'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-bg-alt)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-accent)',
        marginBottom: '1.5rem'
      }}>
        <Compass size={32} />
      </div>

      <span style={{
        fontSize: '0.85rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--color-accent)',
        marginBottom: '0.5rem'
      }}>
        404 Error
      </span>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '2rem' }}>
        The garment collection or URL you are trying to visit does not exist or has been shifted in our catalog.
      </p>

      <Link to="/" className="btn btn-primary btn-lg">
        <ArrowLeft size={18} /> Return to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
