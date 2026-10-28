import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Variant selection states
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColour, setSelectedColour] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get(`/products/${id}`);
        if (response.success && response.product) {
          const p = response.product;
          setProduct(p);
          setSelectedImage(p.images?.[0] || '');
          setSelectedSize(p.sizes?.[0] || 'M');
          setSelectedColour(p.colours?.[0] || 'Default');
          setQuantity(1);
          setRelated(response.related || []);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load garment details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="container loading-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p>Loading THRUST garment specifications...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="empty-state">
          <AlertCircle size={48} style={{ color: 'var(--watermelon)', margin: '0 auto 1rem' }} />
          <h2>Garment Not Found</h2>
          <p>{error || 'The requested product could not be located in our catalog.'}</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setAddingToCart(true);
    await addToCart(product._id, selectedSize, selectedColour, quantity);
    setAddingToCart(false);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        <Link to="/" style={{ color: 'inherit' }}>Home</Link>
        <ChevronRight size={14} />
        <Link to="/shop" style={{ color: 'inherit' }}>Catalog</Link>
        <ChevronRight size={14} />
        <Link to={`/shop?category=${product.category}`} style={{ color: 'inherit' }}>{product.category}</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--watermelon)', fontWeight: 600 }}>{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem',
        alignItems: 'start'
      }}>
        
        {/* Left: Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '115%',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-alt)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)'
          }}>
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '2px solid',
                    borderColor: selectedImage === img ? 'var(--watermelon)' : 'transparent',
                    opacity: selectedImage === img ? 1 : 0.6,
                    padding: 0
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Variant Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          <div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--royal-gold)',
              display: 'block',
              marginBottom: '0.4rem'
            }}>
              {product.category} Collection
            </span>
            <h1 style={{ fontSize: '2.25rem', lineHeight: 1.2, marginBottom: '0.75rem' }}>
              {product.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-text)' }}>
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className={`badge ${isOutOfStock ? 'badge-cancelled' : product.stock < 5 ? 'badge-placed' : 'badge-delivered'}`}>
                {isOutOfStock ? 'Sold Out' : product.stock < 5 ? `Low Stock (${product.stock} left)` : `In Stock (${product.stock} units)`}
              </span>
            </div>
          </div>

          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>
            {product.description}
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Select Size: <strong style={{ color: 'var(--watermelon)' }}>{selectedSize}</strong></span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>True to streetwear fit</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      minWidth: '50px',
                      height: '44px',
                      padding: '0 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      border: '1.5px solid',
                      borderColor: selectedSize === s ? 'var(--watermelon)' : 'var(--color-border)',
                      backgroundColor: selectedSize === s ? 'var(--watermelon)' : 'var(--color-card-bg)',
                      color: selectedSize === s ? '#ffffff' : 'var(--color-text)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colour Selector */}
          {product.colours && product.colours.length > 0 && (
            <div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.65rem' }}>
                Select Colour: <strong style={{ color: 'var(--watermelon)' }}>{selectedColour}</strong>
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.colours.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColour(c)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: selectedColour === c ? 'var(--watermelon)' : 'var(--color-border)',
                      backgroundColor: selectedColour === c ? 'var(--color-accent-subtle)' : 'var(--color-card-bg)',
                      color: selectedColour === c ? 'var(--watermelon)' : 'var(--color-text)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {selectedColour === c && <Check size={14} />}
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Picker & Add to Bag / Wishlist Actions */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            {/* Quantity */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-card-bg)'
            }}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--color-text)' }}
                disabled={quantity <= 1 || isOutOfStock}
              >
                -
              </button>
              <span style={{ width: '38px', textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                style={{ padding: '0.75rem 1rem', fontWeight: 800, color: 'var(--color-text)' }}
                disabled={quantity >= product.stock || isOutOfStock}
              >
                +
              </button>
            </div>

            {/* Total Dynamic Price Multiplier Indicator */}
            {quantity > 1 && (
              <span style={{ fontSize: '0.9rem', color: 'var(--royal-gold)', fontWeight: 700 }}>
                Total: ₹{(product.price * quantity).toLocaleString('en-IN')}
              </span>
            )}

            {/* Add to Bag */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addingToCart}
              className="btn btn-primary btn-lg"
              style={{ flex: 1 }}
            >
              <ShoppingBag size={18} />
              {isOutOfStock ? 'Sold Out' : addingToCart ? 'Adding to Bag...' : `Add ${quantity > 1 ? `(${quantity})` : ''} to Bag`}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className="btn btn-outline btn-lg"
              style={{
                padding: '0.85rem',
                color: inWishlist ? 'var(--watermelon)' : 'var(--color-text)',
                borderColor: inWishlist ? 'var(--watermelon)' : 'var(--color-border)'
              }}
              title={inWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            >
              <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Value Propositions */}
          <div style={{
            backgroundColor: 'var(--color-bg-alt)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            border: '1px solid var(--color-border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
              <Truck size={18} style={{ color: 'var(--royal-gold)' }} />
              <span>Complimentary Cash on Delivery all across India</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
              <RotateCcw size={18} style={{ color: 'var(--watermelon)' }} />
              <span>7-day doorstep return and size exchange guarantee</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--royal-gold)' }} />
              <span>Heavyweight luxury combed natural yarn textile</span>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--watermelon)' }}>
              More from {product.category}
            </span>
            <h2 style={{ fontSize: '1.75rem', marginTop: '0.25rem' }}>Related Silhouettes</h2>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailPage;
