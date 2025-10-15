import type { SavedArtwork } from "@/types";

type Props = {
  art: SavedArtwork;
  rect: DOMRect;
  xRatio: number;
  yRatio: number;
};

const DIAMETER = 320;
const MARGIN = 16;
const ZOOM = 4;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function Previewer({ art, rect, xRatio, yRatio }: Props) {
  if (!art.imageUrl) return null;

  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : DIAMETER;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : DIAMETER;

  let left = rect.right + MARGIN;
  if (left + DIAMETER > viewportWidth - MARGIN) {
    left = Math.max(MARGIN, rect.left - DIAMETER - MARGIN);
  }

  let top = rect.top + rect.height / 2 - DIAMETER / 2;
  if (top + DIAMETER > viewportHeight - MARGIN) {
    top = Math.max(MARGIN, viewportHeight - DIAMETER - MARGIN);
  }
  if (top < MARGIN) top = MARGIN;

  const bgSize = DIAMETER * ZOOM;

  const offsetX = clamp(
    DIAMETER / 2 - xRatio * bgSize,
    DIAMETER - bgSize,
    0
  );
  const offsetY = clamp(
    DIAMETER / 2 - yRatio * bgSize,
    DIAMETER - bgSize,
    0
  );

  return (
    <div
      className="pointer-events-none fixed z-50 overflow-hidden rounded-full border-2 border-primary shadow-2xl preview-fade"
      style={{
        width: DIAMETER,
        height: DIAMETER,
        left,
        top,
        backgroundImage: `url(${art.imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${bgSize}px ${bgSize}px`,
        backgroundPosition: `${offsetX}px ${offsetY}px`,
      }}
    >
      {/* <div className="absolute inset-x-0 bottom-0 bg-base-100/80 backdrop-blur-sm px-3 py-2 text-xs rounded-b-full text-center">
        <p className="font-semibold line-clamp-1">{art.title}</p>
        <p className="opacity-70 line-clamp-1">
          {art.artist_title ?? "Unknown artist"}
        </p>
      </div> */}
    </div>
  );
}
