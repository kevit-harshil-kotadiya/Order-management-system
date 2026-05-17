import { useState } from 'react';
import PropTypes from 'prop-types';

export const CheckoutForm = ({ cartItems, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Address must be at least 5 characters';
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const orderData = {
      customerName: formData.customerName.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      items: cartItems.map(item => ({
        menuItem: item._id,
        quantity: item.quantity
      }))
    };

    try {
      await onSubmit(orderData);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="checkout-form-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="customerName">Full Name *</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={errors.customerName ? 'error' : ''}
          />
          {errors.customerName && <span className="error-message">{errors.customerName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Delivery Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., 123-456-7890"
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Back to Menu
          </button>
          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

CheckoutForm.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};
