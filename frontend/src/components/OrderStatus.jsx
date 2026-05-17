import { useParams, useNavigate } from 'react-router-dom';
import { useOrderStatus } from '../hooks/useOrderStatus';

const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export const OrderStatus = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { order, loading, error } = useOrderStatus(orderId);

  if (loading) return <div className="loading">Loading order status...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!order) return null;

  const currentStatusIndex = statuses.indexOf(order.status);
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="order-status">
      <div className="order-status-header">
        <h2>Order Status</h2>
        <p className="order-id">Order #{orderId?.slice(-6)}</p>
      </div>

      <div className="status-progress">
        {statuses.map((status, index) => (
          <div
            key={status}
            className={`status-step ${index <= currentStatusIndex ? 'active' : ''} ${index === currentStatusIndex ? 'current' : ''} ${isDelivered && index === currentStatusIndex ? 'delivered' : ''}`}
          >
            <div className="status-dot"></div>
            <div className="status-label">{status}</div>
          </div>
        ))}
      </div>

      <div className="order-details">
        <h3>Order Details</h3>
        <p><strong>Customer:</strong> {order.customerName}</p>
        <p><strong>Delivery Address:</strong> {order.address}</p>
        <p><strong>Phone:</strong> {order.phone}</p>

        <h4>Items</h4>
        <ul>
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} × {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
        <p className="order-total"><strong>Total: ${order.totalAmount.toFixed(2)}</strong></p>
      </div>

      {isDelivered && (
        <div className="order-complete">
          <h3>Order Delivered!</h3>
          <p>Thank you for your order. Enjoy your meal!</p>
          <button onClick={() => navigate('/')} className="btn-new-order">
            Place New Order
          </button>
        </div>
      )}
    </div>
  );
};
