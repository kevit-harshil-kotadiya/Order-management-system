import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MenuList } from './components/MenuList';
import { Cart } from './components/Cart';
import { CheckoutForm } from './components/CheckoutForm';
import { OrderStatus } from './components/OrderStatus';
import { api } from './services/api';

function AppContent() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) return;
    setCart(prev =>
      prev.map(item => (item._id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item._id !== itemId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    setError(null);
    navigate('/checkout');
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      const order = await api.createOrder(orderData);
      setCart([]);
      navigate(`/order/${order._id}`);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <Layout cartCount={cart.length}>
      {error && (
        <div className="error-banner" onClick={() => setError(null)}>
          {error} ×
        </div>
      )}

      <Routes>
        <Route path="/" element={
          <div className="menu-page">
            <MenuList onAddToCart={addToCart} />
            {cart.length > 0 && (
              <div className="cart-section">
                <Cart
                  items={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </div>
        } />
        <Route path="/checkout" element={
          cart.length > 0 ? (
            <CheckoutForm
              cartItems={cart}
              onSubmit={handlePlaceOrder}
              onCancel={() => navigate('/')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="/order/:orderId" element={<OrderStatus />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return <AppContent />;
}
