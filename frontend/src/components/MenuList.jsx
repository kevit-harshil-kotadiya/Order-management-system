import { useEffect, useRef } from 'react';
import { MenuItem } from './MenuItem';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

export const MenuList = ({ onAddToCart }) => {
  const { items, loading, error, hasMore, lastElementRef, loadMore } = useInfiniteScroll(6);
  const hasLoaded = useRef(false);

  // Load initial items on mount only once
  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      loadMore();
    }
  }, [loadMore]);

  if (error && items.length === 0) return <div className="error">Error: {error}</div>;
  if (items.length === 0 && loading) return <div className="loading">Loading menu...</div>;

  return (
    <div className="menu-list">
      <h2>Our Menu</h2>
      <div className="menu-items-container">
        <div className="menu-items-grid">
          {items.map((item, index) => {
            // Attach ref to the last item for intersection observer
            if (index === items.length - 1) {
              return (
                <MenuItem
                  key={item._id}
                  item={item}
                  onAddToCart={onAddToCart}
                  ref={lastElementRef}
                />
              );
            }
            return (
              <MenuItem
                key={item._id}
                item={item}
                onAddToCart={onAddToCart}
              />
            );
          })}
        </div>
        {loading && items.length > 0 && (
          <div className="loading-more">Loading more items...</div>
        )}
        {!hasMore && items.length > 0 && (
          <div className="no-more-items">No more items</div>
        )}
      </div>
    </div>
  );
};
