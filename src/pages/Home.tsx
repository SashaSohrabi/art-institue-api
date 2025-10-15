import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ArtworkCard from "@/components/ArtworkCard";
import { useArtworkSearch } from "@/hooks/useArtworkSearch";
import { useGallery } from "@/hooks/useGallery";
import type { SavedArtwork } from "@/types";

const DEFAULT_QUERY = "painting";

export default function HomePage() {
  const { q, setQ, items, loading, hasMore, loadMore } = useArtworkSearch(DEFAULT_QUERY);
  const { add, remove, has } = useGallery();
  const [input, setInput] = useState<string>(q);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMore();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleSearch = () => {
    const trimmed = input.trim();
    setQ(trimmed || DEFAULT_QUERY);
    if (!trimmed) setInput("");
    else if (trimmed !== input) setInput(trimmed);
  };

  const handleClear = () => {
    setInput("");
    setQ(DEFAULT_QUERY);
  };

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <section className="mb-8">
        <div className="mb-6 max-w-3xl mx-auto">
          <SearchBar
            value={input}
            onChange={setInput}
            onClear={handleClear}
            onSubmit={handleSearch}
            submitting={loading}
          />
        </div>

        <h2 className="text-lg font-semibold mb-3">Results</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((art: SavedArtwork) => {
            const saved = has(art.id);
            return (
              <li key={art.id}>
                <ArtworkCard
                  art={art}
                  isSaved={saved}
                  showNoteEditor={false}
                  onAdd={add}
                  onRemove={remove}
                />
              </li>
            );
          })}
        </ul>
        {loading && (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner" />
          </div>
        )}
        {!loading && !items.length && <p className="opacity-70">No results.</p>}
        <div ref={sentinelRef} className="h-10" />
        {!hasMore && items.length > 0 && (
          <p className="text-center py-6 opacity-70">You're all caught up.</p>
        )}
      </section>
    </main>
  );
}
