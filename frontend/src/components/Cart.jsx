import PropTypes from 'prop-types';

export const Cart = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      <ul className="cart-items">
        {items.map(item => (
          <li key={item._id} className="cart-item">
            <div className="cart-item-info">
              <h4>{item.name}</h4>
              <p className="cart-item-price">${item.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item-controls">
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              >
                +
              </button>
              <button
                className="btn-remove"
                onClick={() => onRemove(item._id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total: ${total.toFixed(2)}</strong>
        </div>
        <button className="btn-checkout" onClick={onCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

Cart.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired
    })
  ).isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired
};
