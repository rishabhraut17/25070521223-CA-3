import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColour = product.colours?.[0] || 'Default';
    addToCart(product._id, defaultSize, defaultColour, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-card-img-wrapper">
          <img
            src={mainImage}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />

          {product.featured && (
            <span className="badge badge-gold product-card-badge">
              Featured
            </span>
          )}

          <button
            onClick={handleWishlistClick}
            className={`product-card-wishlist-btn ${inWishlist ? 'active' : ''}`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="product-card-content">
          <span className="product-card-category">{product.category}</span>
          <h3 className="product-card-title">{product.name}</h3>

          <div className="product-card-price-row">
            <span className="product-card-price">₹{Number(product.price).toLocaleString('en-IN')}</span>
            <button
              onClick={handleQuickAdd}
              className="btn btn-outline btn-sm"
              title="Add to Shopping Bag"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <ShoppingBag size={14} /> Add
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
