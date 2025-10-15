import type { SavedArtwork } from '@/types';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

type Props = {
  art: SavedArtwork;
  isSaved?: boolean;
  showNoteEditor?: boolean;
  onAdd?: (art: SavedArtwork) => void;
  onRemove?: (id: number) => void;
  onSaveNote?: (id: number, text: string) => void;
  onSelect?: (art: SavedArtwork) => void;
  selected?: boolean;
  onImageHover?: (event: {
    art: SavedArtwork;
    hovering: boolean;
    rect: DOMRect;
    xRatio: number;
    yRatio: number;
  }) => void;
};

export default function ArtworkCard({
  art,
  isSaved,
  showNoteEditor = true,
  onAdd,
  onRemove,
  onSaveNote,
  onSelect,
  selected = false,
  onImageHover,
}: Props) {
  const [note, setNote] = useState<string>(art.note ?? '');
  const noteDetailsRef = useRef<HTMLDetailsElement | null>(null);
  const imageWrapperRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setNote(art.note ?? '');
  }, [art.note]);

  const handleSelect = () => {
    onSelect?.(art);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  const emitHover = (hovering: boolean, event?: MouseEvent<HTMLElement>) => {
    if (!onImageHover || !imageWrapperRef.current || !art.imageUrl) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();

    let xRatio = 0.5;
    let yRatio = 0.5;
    if (hovering && event) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      xRatio = rect.width > 0 ? Math.min(Math.max(x / rect.width, 0), 1) : 0.5;
      yRatio =
        rect.height > 0 ? Math.min(Math.max(y / rect.height, 0), 1) : 0.5;
    }

    onImageHover({ art, hovering, rect, xRatio, yRatio });
  };

  return (
    <div
      className={`card bg-base-100 h-[26.25rem] shadow border transition-colors cursor-pointer ${
        selected ? 'border-primary' : 'border-black hover:border-base-300'
      }`}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      {art.imageUrl ? (
        <figure
          ref={imageWrapperRef}
          className="group aspect-[4/3] overflow-hidden cursor-zoom-in"
          onMouseEnter={(event) => emitHover(true, event)}
          onMouseMove={(event) => emitHover(true, event)}
          onMouseLeave={() => emitHover(false)}
          aria-pressed={selected}
        >
          <img
            src={art.imageUrl}
            alt={art.title}
            loading="lazy"
            className="w-full h-full scale-[1.05] object-cover transform transition duration-300 group-hover:scale-[1]"
          />
        </figure>
      ) : (
        <div className="aspect-[4/3] bg-base-200 grid place-items-center text-xs">
          No image
        </div>
      )}
      <div className="card-body p-4">
        <h3 className="card-title text-bas line-clamp-2">{art.title}</h3>
        <p className="text-sm opacity-70">
          {art.artist_title ?? 'Unknown artist'}
        </p>

        {!isSaved ? (
          <div className="card-actions justify-end">
            <button
              className="btn btn-sm btn-outline"
              onClick={(event) => {
                event.stopPropagation();
                onAdd?.(art);
              }}
            >
              Add to Gallery
            </button>
          </div>
        ) : showNoteEditor ? (
          <>
            <div className="card-actions justify-end">
              <button
                className="btn btn-sm btn-outline btn-error"
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove?.(art.id);
                }}
              >
                Remove from Gallery
              </button>
            </div>
            <details ref={noteDetailsRef} className="mt-3 note-dropdown">
              <summary
                className="btn btn-sm btn-outline w-full justify-between"
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                <span>{note ? 'Edit note' : 'Add note'}</span>
                <span className="opacity-70">
                  {/* chevron handled via CSS */}
                </span>
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
                    onClick={(event) => {
                      event.stopPropagation();
                      onSaveNote?.(art.id, note);
                      if (noteDetailsRef.current)
                        noteDetailsRef.current.open = false;
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
              onClick={(event) => {
                event.stopPropagation();
                onRemove?.(art.id);
              }}
            >
              Remove from Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
