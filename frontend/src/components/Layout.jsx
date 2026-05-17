import { Link, useLocation } from 'react-router-dom';

export const Layout = ({ children, cartCount = 0 }) => {
  const location = useLocation();

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>Food Delivery</h1>
          <nav>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Menu</Link>
            {cartCount > 0 && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                <Link to="/checkout" className={location.pathname === '/checkout' ? 'active' : ''}>
                  Checkout {cartCount > 0 && `(${cartCount})`}
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="app-main">
        {children}
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>© 2026 Food Delivery. Order Management System.</p>
        </div>
      </footer>
    </div>
  );
};
