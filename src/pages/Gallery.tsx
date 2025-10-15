import ArtworkCard from "@/components/ArtworkCard";
import { useGallery } from "@/hooks/useGallery";

export default function GalleryPage() {
  const { items, remove, updateNote } = useGallery();

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <section>
        <h2 className="text-lg font-semibold mb-3">Your Gallery</h2>
        {items.length === 0 ? (
          <p className="opacity-70">No saved artworks yet.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((art) => (
              <li key={art.id}>
                <ArtworkCard art={art} isSaved onRemove={remove} onSaveNote={updateNote} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
