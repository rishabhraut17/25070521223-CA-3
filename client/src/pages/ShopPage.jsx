import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL parameters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || '');
  const [selectedColour, setSelectedColour] = useState(searchParams.get('colour') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colours = ['Black', 'White', 'Navy', 'Gray', 'Olive', 'Brown', 'Blue', 'Beige'];

  // Synchronize state when URL params change (e.g. clicking Men in navbar)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    const urlSearch = searchParams.get('search') || '';
    const urlFeatured = searchParams.get('featured') || '';
    const urlSort = searchParams.get('sort') || 'newest';

    setCategory(urlCategory);
    setSearch(urlSearch);
    if (urlSort) setSort(urlSort);
    setPage(1);
  }, [searchParams]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (selectedSize) params.append('size', selectedSize);
      if (selectedColour) params.append('colour', selectedColour);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);
      if (searchParams.get('featured')) params.append('featured', searchParams.get('featured'));
      params.append('page', page.toString());
      params.append('limit', '12');

      const response = await api.get(`/products?${params.toString()}`);
      if (response.success) {
        setProducts(response.products || []);
        setTotal(response.total || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (err) {
      console.warn('Failed to fetch products:', err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, selectedSize, selectedColour, minPrice, maxPrice, sort, page, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSelectedSize('');
    setSelectedColour('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '80vh' }}>
      
      {/* Top Header & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
            {category === 'All' ? 'Complete Apparel Catalog' : `${category} Collection`}
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Showing {products.length} of {total} authentic pieces
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Search catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: '2.2rem', paddingRight: '0.75rem', fontSize: '0.85rem' }}
            />
          </form>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            style={{ fontSize: '0.85rem', padding: '0.65rem 0.85rem' }}
          >
            <option value="newest">Sort by: Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popularity">Most Popular</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-outline btn-sm mobile-filter-btn"
            style={{ display: 'none' }}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div style={{ display: 'flex', gap: '2.5rem' }}>
        
        {/* Desktop Filters Sidebar */}
        <aside className={`shop-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`} style={{
          width: '260px',
          flexShrink: 0
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem' }}>
                <Filter size={16} /> Filters
              </div>
              <button
                onClick={handleResetFilters}
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                Category
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    style={{
                      textAlign: 'left',
                      padding: '0.4rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      fontWeight: category === cat ? 600 : 400,
                      backgroundColor: category === cat ? 'var(--color-accent-subtle)' : 'transparent',
                      color: category === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                Size
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(selectedSize === s ? '' : s);
                      setPage(1);
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: selectedSize === s ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: selectedSize === s ? 'var(--color-primary)' : '#ffffff',
                      color: selectedSize === s ? '#ffffff' : 'var(--color-text)'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colour Filter */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                Colour
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {colours.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedColour(selectedColour === c ? '' : c);
                      setPage(1);
                    }}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: '1px solid',
                      borderColor: selectedColour === c ? 'var(--color-accent)' : 'var(--color-border)',
                      backgroundColor: selectedColour === c ? 'var(--color-accent-subtle)' : '#ffffff',
                      color: selectedColour === c ? 'var(--color-accent)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                Price Range ($)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                />
                <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%', fontSize: '0.8rem', padding: '0.4rem 0.5rem' }}
                />
              </div>
              <button
                onClick={() => { setPage(1); fetchProducts(); }}
                className="btn btn-primary btn-sm"
                style={{ width: '100%', marginTop: '0.75rem' }}
              >
                Apply Range
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main style={{ flex: 1 }}>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Fetching curated collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <SlidersHorizontal size={48} />
              </div>
              <h3>No garments match your filters</h3>
              <p>Try clearing your active filters or adjusting the price range to explore other items.</p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '3.5rem'
                }}>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline btn-sm"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: page === num ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: page === num ? 'var(--color-primary)' : '#ffffff',
                        color: page === num ? '#ffffff' : 'var(--color-text)'
                      }}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-outline btn-sm"
                    aria-label="Next Page"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 868px) {
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .shop-sidebar {
            display: none;
          }
          .shop-sidebar.mobile-open {
            display: block !important;
            position: fixed;
            top: 72px;
            left: 0;
            width: 100% !important;
            height: calc(100vh - 72px);
            background: #ffffff;
            z-index: 999;
            padding: 1rem;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;
