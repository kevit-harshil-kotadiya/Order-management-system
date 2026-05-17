import { useState, useCallback, useRef } from "react";
import { api } from "../services/api";

export const useInfiniteScroll = (pageSize = 6) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const pageRef = useRef(page);

  // Keep pageRef in sync with page state
  pageRef.current = page;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      // Use ref to get current page value, avoiding closure issues
      const currentPage = pageRef.current;
      const response = await api.getMenu(currentPage, pageSize);

      setItems((prev) => {
        // Avoid duplicates
        const newItems = response.items.filter(
          (newItem) =>
            !prev.some((existingItem) => existingItem._id === newItem._id),
        );
        return [...prev, ...newItems];
      });

      setHasMore(response.pagination?.hasMore ?? false);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [pageSize, loading, hasMore]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMore();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        },
      );

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, loadMore],
  );

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setLoading(false);
    setError(null);
    setHasMore(true);
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    lastElementRef,
    loadMore,
    reset,
  };
};
