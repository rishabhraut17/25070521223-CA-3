import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Sparkles,
  ShoppingBag,
  Truck,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Layers,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [heroSearch, setHeroSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const categories = [
    {
      title: 'Men',
      desc: 'Heavyweight tees, structured shirts, relaxed trousers & outerwear',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=Men',
      accent: 'var(--watermelon)'
    },
    {
      title: 'Women',
      desc: 'Linen midi dresses, merino knits, denim & relaxed tailoring',
      img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=Women',
      accent: 'var(--royal-gold)'
    },
    {
      title: 'Kids',
      desc: 'Organic cotton playwear, cozy fleece hoodies & rugged overalls',
      img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=Kids',
      accent: '#38bdf8'
    },
    {
      title: 'Accessories',
      desc: 'Cordura crossbody bags, full-grain leather belts & merino beanies',
      img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
      link: '/shop?category=Accessories',
      accent: 'var(--watermelon)'
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Curated Catalog',
      desc: 'Explore meticulously designed essentials across four core clothing categories, with real-time stock and precise sizing.'
    },
    {
      num: '02',
      title: 'Pick Size & Colour',
      desc: 'Select your preferred fit and curated colorway, then save to your personal wishlist or bag in one click.'
    },
    {
      num: '03',
      title: 'Cash On Delivery',
      desc: 'Fill your shipping address and check out securely. Pay with cash directly upon arrival at your doorstep.'
    },
    {
      num: '04',
      title: 'Live Order Tracking',
      desc: 'Follow your garment from Placed to Processing, Shipped, and Delivered with transparent status updates.'
    }
  ];

  const faqs = [
    {
      q: 'What is the philosophy behind FLEXI?',
      a: 'FLEXI was founded on the principle of intentional wardrobe building. We produce durable, clean-lined clothing made with premium natural textiles, verified mills, and sustainable finishes.'
    },
    {
      q: 'How does payment work?',
      a: 'We operate exclusively with Cash on Delivery (COD) for maximum trust and convenience. You only pay when your parcel is physically handed to you at your doorstep.'
    },
    {
      q: 'Can I cancel an order after placing it?',
      a: 'Yes. As long as your order status is Placed or Processing, you can cancel it with one click from your My Orders dashboard. The inventory is automatically restored in real time.'
    },
    {
      q: 'Do you offer returns or size exchanges?',
      a: 'Yes, we provide a 7-day hassle-free return and exchange window on all unworn garments with original tags intact.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '3rem' }}>
      
      {/* 1. HERO SECTION (INSPIRED BY IMAGE 2 - SMARTLENS GLOWING PERSPECTIVE) */}
      <section style={{
        backgroundColor: 'var(--prussian-blue)',
        background: 'radial-gradient(ellipse at 50% 15%, rgba(237, 37, 78, 0.28) 0%, rgba(1, 25, 54, 0.95) 60%), #011936',
        color: 'var(--mint-cream)',
        padding: '5rem 0 6.5rem 0',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(244, 255, 253, 0.1)'
      }}>
        {/* Glow ambient background effects */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(249, 220, 92, 0.18) 0%, rgba(237, 37, 78, 0.22) 50%, transparent 80%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '920px' }}>
          
          {/* Floating Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.15rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(244, 255, 253, 0.08)',
            border: '1px solid rgba(244, 255, 253, 0.2)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--royal-gold)',
            marginBottom: '2rem'
          }}>
            <Sparkles size={16} style={{ color: 'var(--watermelon)' }} />
            <span>Spring / Summer 2026 Minimalist Capsule</span>
          </div>

          {/* Hero Headline with Gradient Fill */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            color: 'var(--mint-cream)'
          }}>
            Shape Your Identity with<br />
            <span style={{
              background: 'linear-gradient(90deg, #f4fffd 20%, #f9dc5c 60%, #ed254e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Architectural Essentials
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'rgba(244, 255, 253, 0.8)',
            lineHeight: 1.7,
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto'
          }}>
            FLEXI combines high-density combed cotton, sculpted tailoring, and functional silhouettes across Men, Women, Kids, and Accessories.
          </p>

          {/* Prominent Search Bar with Glass Glow */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 0.6rem 0.5rem 1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(244, 255, 253, 0.2)',
              maxWidth: '580px',
              margin: '0 auto 2.5rem auto'
            }}
          >
            <Search size={20} style={{ color: 'var(--royal-gold)', marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search heavyweight tees, linen dresses, hoodies, bags..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                padding: 0,
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: '#ffffff'
              }}
            />
            <button
              type="submit"
              className="btn btn-accent"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.65rem 1.4rem' }}
            >
              Explore
            </button>
          </form>

          {/* Dual Rounded Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-accent btn-lg">
              Explore Catalog <ArrowRight size={18} />
            </Link>
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-glass btn-lg">
                Create Account
              </Link>
            ) : (
              <Link to="/home" className="btn btn-glass btn-lg">
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* 3D Isometric Floating Preview Badges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginTop: '4rem',
            textAlign: 'left'
          }}>
            {[
              { title: 'Verified Textiles', desc: '100% GOTS Organic Cotton', tag: 'Pure Origin' },
              { title: 'Doorstep COD', desc: 'Zero advance payment required', tag: '100% Safe' },
              { title: 'Live Inventory', desc: 'Real-time MongoDB stock locking', tag: 'Instant' },
              { title: 'Hassle-Free Return', desc: '7-day easy exchange window', tag: 'Fair Policy' }
            ].map((card, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(244, 255, 253, 0.05)',
                  border: '1px solid rgba(244, 255, 253, 0.12)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--royal-gold)', textTransform: 'uppercase' }}>
                  {card.tag}
                </span>
                <h4 style={{ color: 'var(--mint-cream)', fontSize: '1rem', marginTop: '0.35rem', marginBottom: '0.25rem' }}>
                  {card.title}
                </h4>
                <p style={{ color: 'rgba(244, 255, 253, 0.65)', fontSize: '0.8rem' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. CATEGORY HIGHLIGHTS */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--watermelon)'
          }}>
            Four Tailored Lines
          </span>
          <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem' }}>Explore By Category</h2>
          <p style={{ color: 'var(--charcoal-blue)', marginTop: '0.5rem' }}>
            Built specifically for everyday versatility, architectural drape, and enduring comfort.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.75rem'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.link}
              className="card"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                position: 'relative',
                paddingTop: '110%',
                overflow: 'hidden',
                backgroundColor: 'var(--color-bg-alt)'
              }}>
                <img
                  src={cat.img}
                  alt={cat.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-blue)', marginBottom: '1.25rem', flex: 1 }}>
                  {cat.desc}
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--watermelon)'
                }}>
                  Browse {cat.title} <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" style={{
        backgroundColor: 'var(--prussian-blue)',
        color: 'var(--mint-cream)',
        padding: '5rem 0',
        borderTop: '1px solid rgba(244, 255, 253, 0.1)',
        borderBottom: '1px solid rgba(244, 255, 253, 0.1)'
      }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--royal-gold)'
            }}>
              Seamless Experience
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', color: 'var(--mint-cream)' }}>How FLEXI Works</h2>
            <p style={{ color: 'rgba(244, 255, 253, 0.7)', marginTop: '0.5rem' }}>
              From choosing your exact cut to inspecting the parcel at your door.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem'
          }}>
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  backgroundColor: 'rgba(244, 255, 253, 0.05)',
                  backdropFilter: 'blur(10px)',
                  padding: '2rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(244, 255, 253, 0.12)',
                  position: 'relative'
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--watermelon)',
                  opacity: 0.8,
                  display: 'block',
                  marginBottom: '0.5rem'
                }}>
                  {step.num}
                </span>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem', color: 'var(--mint-cream)' }}>{step.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(244, 255, 253, 0.7)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          <div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--watermelon)'
            }}>
              Uncompromising Standards
            </span>
            <h2 style={{ fontSize: '2.35rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              Designed For Longevity, Crafted Without Compromise.
            </h2>
            <p style={{ color: 'var(--charcoal-blue)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Every garment in our catalog is engineered to endure wash after wash. We partner directly with ethical textile mills to source long-staple combed cotton and European linen.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--watermelon)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>100% Cash On Delivery</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-blue)' }}>
                    No upfront risk. Pay when you inspect the parcel.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--watermelon)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Live MongoDB Inventory Sync</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-blue)' }}>
                    Atomic stock deduction prevents disappointing out-of-stock backorders.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <CheckCircle size={20} style={{ color: 'var(--watermelon)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Effortless Order Cancellation</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--charcoal-blue)' }}>
                    Need to change your mind? One-click cancellation with instant inventory recovery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop&q=80"
              alt="FLEXI Workshop"
              style={{ width: '100%', height: '480px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section id="faq" className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--charcoal-blue)', marginTop: '0.5rem' }}>
            Everything you need to know about our ordering process and policies.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--color-primary)'
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  style={{
                    transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                    color: 'var(--charcoal-blue)'
                  }}
                />
              </button>
              {openFaq === idx && (
                <div style={{
                  padding: '0 1.5rem 1.25rem 1.5rem',
                  color: 'var(--charcoal-blue)',
                  fontSize: '0.92rem',
                  lineHeight: 1.6
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--prussian-blue)',
          backgroundImage: 'radial-gradient(circle at top right, rgba(237, 37, 78, 0.3), transparent 60%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ color: 'var(--mint-cream)', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to upgrade your everyday wardrobe?
          </h2>
          <p style={{ color: 'rgba(244, 255, 253, 0.75)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2rem auto' }}>
            Join thousands of shoppers who value clean silhouettes, sustainable fabrics, and reliable Cash on Delivery.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn-accent btn-lg">
              Start Shopping Now <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-glass btn-lg">
                Sign In to Your Account
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
