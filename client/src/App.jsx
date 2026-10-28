import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      {/* Public Pages */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />

                      {/* Protected Customer Routes */}
                      <Route
                        path="/home"
                        element={
                          <ProtectedRoute>
                            <HomePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute>
                            <CartPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/orders"
                        element={
                          <ProtectedRoute>
                            <OrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/wishlist"
                        element={
                          <ProtectedRoute>
                            <WishlistPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protected Admin Route */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute adminOnly={true}>
                            <AdminDashboardPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 Fallback */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
