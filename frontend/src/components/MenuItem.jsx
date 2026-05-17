import PropTypes from 'prop-types';

export const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item">
      <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
      <div className="menu-item-content">
        <h3 className="menu-item-name">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-price">${item.price.toFixed(2)}</span>
          <button
            className="btn-add-cart"
            onClick={() => onAddToCart(item)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};
