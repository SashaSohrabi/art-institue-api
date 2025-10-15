import { useCallback, useEffect, useRef, useState } from "react";
import { searchPublicArtworks } from "@/utils/api";
import type { SavedArtwork } from "@/types";

export function useArtworkSearch(initialQuery = "painting") {
  const [q, setQ] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SavedArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    setItems([]);
    setPage(1);
    setHasMore(true);
    setTotalPages(null);
    setLoading(true);
  }, [q]);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);

    (async () => {
      try {
        const {
          items: chunk,
          hasMore: nextHasMore,
          totalPages: pagesTotal,
        } = await searchPublicArtworks(q, page, ctrl.signal);

        setItems((prev) => (page === 1 ? chunk : [...prev, ...chunk]));
        setTotalPages(pagesTotal);
        setHasMore(pagesTotal != null ? page < pagesTotal : nextHasMore);
      } catch (error: any) {
        if (error?.name !== "AbortError") console.error(error);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [q, page]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [loading, hasMore]);

  return {
    q,
    setQ,
    items,
    loading,
    hasMore,
    totalPages,
    loadMore,
  };
}
