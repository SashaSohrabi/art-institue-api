import type { SavedArtwork } from "@/types";

const KEY = "aic-gallery";

export function loadGallery(): SavedArtwork[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveGallery(items: SavedArtwork[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}
