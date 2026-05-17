import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Create Socket.IO client
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

export const api = {
  // Menu endpoints
  getMenu: async () => {
    const response = await fetch(`${API_BASE}/menu`);
    if (!response.ok) throw new Error('Failed to fetch menu');
    return response.json();
  },

  getMenuItem: async (id) => {
    const response = await fetch(`${API_BASE}/menu/${id}`);
    if (!response.ok) throw new Error('Failed to fetch menu item');
    return response.json();
  },

  // Order endpoints
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return response.json();
  },

  getOrder: async (id) => {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  getOrderStatus: async (id) => {
    const response = await fetch(`${API_BASE}/orders/${id}/status`);
    if (!response.ok) throw new Error('Failed to fetch order status');
    return response.json();
  }
};

// Socket.IO for real-time order status updates
export const connectToOrderEvents = (orderId, onMessage, onError) => {
  // Connect socket if not already connected
  if (!socket.connected) {
    socket.connect();
  }

  // Join the order room
  socket.emit('join-order', orderId);

  // Listen for order updates
  const handleOrderUpdate = (data) => {
    onMessage(data);
  };

  socket.on('order-update', handleOrderUpdate);

  // Handle connection errors
  const handleError = (error) => {
    console.error('Socket.IO error:', error);
    if (onError) onError(error);
  };

  socket.on('connect_error', handleError);

  // Return cleanup function
  return () => {
    socket.emit('leave-order', orderId);
    socket.off('order-update', handleOrderUpdate);
    socket.off('connect_error', handleError);
  };
};
