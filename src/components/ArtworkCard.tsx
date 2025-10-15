import type { SavedArtwork } from "@/types";
import { useEffect, useRef, useState } from "react";

type Props = {
  art: SavedArtwork;
  isSaved?: boolean;
  showNoteEditor?: boolean;
  onAdd?: (art: SavedArtwork) => void;
  onRemove?: (id: number) => void;
  onSaveNote?: (id: number, text: string) => void;
};

export default function ArtworkCard({
  art,
  isSaved,
  showNoteEditor = true,
  onAdd,
  onRemove,
  onSaveNote,
}: Props) {
  const [note, setNote] = useState<string>(art.note ?? "");
  const noteDetailsRef = useRef<HTMLDetailsElement | null>(null);

  useEffect(() => {
    setNote(art.note ?? "");
  }, [art.note]);

  return (
    <div className="card bg-base-100 shadow">
      {art.imageUrl ? (
        <figure className="aspect-[4/3] overflow-hidden">
          <img src={art.imageUrl} alt={art.title} loading="lazy" className="w-full object-cover" />
        </figure>
      ) : (
        <div className="aspect-[4/3] bg-base-200 grid place-items-center text-xs">No image</div>
      )}
      <div className="card-body p-4">
        <h3 className="card-title text-base">{art.title}</h3>
        <p className="text-sm opacity-70">{art.artist_title ?? "Unknown artist"}</p>

        {!isSaved ? (
          <div className="card-actions justify-end">
            <button className="btn btn-sm btn-outline" onClick={() => onAdd?.(art)}>
              Add to Gallery
            </button>
          </div>
        ) : showNoteEditor ? (
          <>
            <div className="card-actions justify-end">
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={() => onRemove?.(art.id)}
              >
                Remove from Gallery
              </button>
            </div>
            <details ref={noteDetailsRef} className="mt-3 note-dropdown">
              <summary className="btn btn-sm btn-outline w-full justify-between">
                <span>{note ? "Edit note" : "Add note"}</span>
                <span className="opacity-70">{/* chevron handled via CSS */}</span>
              </summary>
              <div className="mt-4 space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="textarea textarea-bordered text-sm w-full"
                  placeholder="Add a short note…"
                  rows={3}
                />
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      onSaveNote?.(art.id, note);
                      if (noteDetailsRef.current) noteDetailsRef.current.open = false;
                    }}
                  >
                    Save note
                  </button>
                </div>
              </div>
            </details>
          </>
        ) : (
          <div className="card-actions justify-end">
            <button
              className="btn btn-sm btn-outline btn-error"
              onClick={() => onRemove?.(art.id)}
            >
              Remove from Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
