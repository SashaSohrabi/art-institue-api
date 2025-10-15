import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loadGallery, saveGallery } from "@/utils/storage";
import type { SavedArtwork } from "@/types";
import { NoteSchema } from "@/schemas/note";

type GalleryContextValue = {
  items: SavedArtwork[];
  add: (art: SavedArtwork) => void;
  remove: (id: number) => void;
  updateNote: (id: number, text: string) => void;
  has: (id: number) => boolean;
};

const GalleryContext = createContext<GalleryContextValue | undefined>(undefined);

function useGalleryState(): GalleryContextValue {
  const [items, setItems] = useState<SavedArtwork[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadGallery();
    setItems(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveGallery(items);
  }, [items, hydrated]);

  const ids = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  function add(art: SavedArtwork) {
    if (!ids.has(art.id)) setItems((prev) => [art, ...prev]);
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateNote(id: number, text: string) {
    const parsed = NoteSchema.safeParse(text);
    if (!parsed.success) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note: parsed.data } : item))
    );
  }

  return {
    items,
    add,
    remove,
    updateNote,
    has: (id: number) => ids.has(id),
  };
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const value = useGalleryState();
  return <GalleryContext.Provider value={value}>{children}</GalleryContext.Provider>;
}

export function useGallery(): GalleryContextValue {
  const context = useContext(GalleryContext);
  if (!context) throw new Error("useGallery must be used within a GalleryProvider");
  return context;
}
