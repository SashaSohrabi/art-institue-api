import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import ArtworkCard from "@/components/ArtworkCard";
import Previewer from "@/components/Previewer";
import { useArtworkSearch } from "@/hooks/useArtworkSearch";
import { useGallery } from "@/hooks/useGallery";
import type { SavedArtwork } from "@/types";

const DEFAULT_QUERY = "painting";

export default function HomePage() {
  const { q, setQ, items, loading, hasMore, hasLoaded, loadMore } = useArtworkSearch(DEFAULT_QUERY);
  const { add, remove, has } = useGallery();
  const [input, setInput] = useState<string>(q);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<{
    art: SavedArtwork;
    rect: DOMRect;
    xRatio: number;
    yRatio: number;
  } | null>(null);

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

  useEffect(() => {
    setSelectedId(null);
    setPreviewData(null);
  }, [q]);

  useEffect(() => {
    if (selectedId == null) return;
    if (!items.some((item) => item.id === selectedId)) {
      setSelectedId(null);
      setPreviewData(null);
    }
  }, [items, selectedId]);

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

  const handleSelectCard = (art: SavedArtwork) => {
    setSelectedId((prev) => (prev === art.id ? prev : art.id));
    setPreviewData(null);
  };

  const handleImageHover = (event: {
    art: SavedArtwork;
    hovering: boolean;
    rect: DOMRect;
    xRatio: number;
    yRatio: number;
  }) => {
    if (selectedId !== event.art.id) {
      if (previewData) setPreviewData(null);
      return;
    }
    if (!event.hovering) {
      setPreviewData(null);
      return;
    }
    setPreviewData({
      art: event.art,
      rect: event.rect,
      xRatio: event.xRatio,
      yRatio: event.yRatio,
    });
  };

  return (
    <main className="container mx-auto p-4 py-8 max-w-6xl">
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
                  onSelect={handleSelectCard}
                  selected={selectedId === art.id}
                  onImageHover={handleImageHover}
                />
              </li>
            );
          })}
        </ul>
        {(loading || !hasLoaded) && (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner w-16 h-16 text-primary" />
          </div>
        )}
        {!loading && hasLoaded && !items.length && (
          <p className="opacity-70">No results.</p>
        )}
        <div ref={sentinelRef} className="h-10" />
        {!hasMore && items.length > 0 && (
          <p className="text-center py-6 opacity-70">You're all caught up.</p>
        )}
      </section>
      {previewData && (
        <Previewer
          art={previewData.art}
          rect={previewData.rect}
          xRatio={previewData.xRatio}
          yRatio={previewData.yRatio}
        />
      )}
    </main>
  );
}
