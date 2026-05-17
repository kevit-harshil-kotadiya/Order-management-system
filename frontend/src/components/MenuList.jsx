import { useEffect, useState } from 'react';
import { MenuItem } from './MenuItem';
import { api } from '../services/api';

export const MenuList = ({ onAddToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await api.getMenu();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="menu-list">
      <h2>Our Menu</h2>
      <div className="menu-items-grid">
        {items.map(item => (
          <MenuItem key={item._id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};
