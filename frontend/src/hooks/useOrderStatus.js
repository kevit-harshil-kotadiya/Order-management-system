import { useState, useEffect } from 'react';
import { api, connectToOrderEvents } from '../services/api';

export const useOrderStatus = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    let disconnect;

    // Fetch initial order data
    const fetchInitialOrder = async () => {
      try {
        const data = await api.getOrder(orderId);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchInitialOrder();

    // Connect to Socket.IO for real-time updates
    disconnect = connectToOrderEvents(
      orderId,
      (data) => {
        setOrder(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      if (disconnect) {
        disconnect();
      }
    };
  }, [orderId]);

  return { order, loading, error };
};
