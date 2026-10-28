import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveToCart = async (product) => {
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColour = product.colours?.[0] || 'Default';

    const success = await addToCart(product._id, defaultSize, defaultColour, 1);
    if (success) {
      await removeFromWishlist(product._id);
      showToast(`Moved "${product.name}" to your shopping bag`, 'success');
    }
  };

  if (loading) {
    return (
      <div className="container loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p>Loading your saved wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="empty-state" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="empty-state-icon">
            <Heart size={48} style={{ color: 'var(--watermelon)' }} />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>
            Save garments you love to keep track of seasonal availability, price updates, and quick bag addition.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Explore Catalog <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Saved Wishlist</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {wishlist.length} {wishlist.length === 1 ? 'garment' : 'garments'} saved for later
        </p>
      </div>

      <div className="product-grid">
        {wishlist.map((product) => {
          if (!product || !product._id) return null;
          const mainImg = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';
          const isOutOfStock = product.stock <= 0;

          return (
            <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', paddingTop: '115%', backgroundColor: 'var(--color-bg-alt)' }}>
                <Link to={`/product/${product._id}`}>
                  <img
                    src={mainImg}
                    alt={product.name}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>

                <button
                  onClick={() => removeFromWishlist(product._id)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-card-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--watermelon)',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                  title="Remove from wishlist"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--royal-gold)', marginBottom: '0.35rem' }}>
                  {product.category}
                </span>

                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                </Link>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: isOutOfStock ? 'var(--watermelon)' : '#10b981', fontWeight: 700 }}>
                    {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                  </span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={isOutOfStock}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <ShoppingBag size={14} /> Move to Bag
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    className="btn btn-outline btn-sm"
                    title="View Garment Details"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default WishlistPage;
