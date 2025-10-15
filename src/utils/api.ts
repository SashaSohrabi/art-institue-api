import { API, PAGE_SIZE, BASE_FIELDS } from "./constants";
import type { SavedArtwork } from "@/types";
import { ApiListSchema } from "@/schemas/artwork";

const iiif = (base: string, image_id?: string | null) =>
  image_id ? `${base}/${image_id}/full/843,/0/default.jpg` : null;

export async function searchPublicArtworks(
  q: string,
  page = 1,
  signal?: AbortSignal
): Promise<{
  items: SavedArtwork[];
  hasMore: boolean;
  totalPages: number | null;
  total: number | null;
}> {
  const from = (page - 1) * PAGE_SIZE;
  const url = new URL(`${API}/artworks/search`);
  url.searchParams.set("q", q);
  url.searchParams.set("query[term][is_public_domain]", "true");
  url.searchParams.set("fields", BASE_FIELDS);
  url.searchParams.set("size", String(PAGE_SIZE));
  url.searchParams.set("from", String(from));

  const res = await fetch(url.toString(), {
    signal,
    headers: { "AIC-User-Agent": "aic-explorer (student demo)" },
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

  const parsed = ApiListSchema.parse(await res.json());
  const iiifBase = parsed.config.iiif_url;

  const items: SavedArtwork[] = parsed.data.map((a) => ({
    ...a,
    imageUrl: iiif(iiifBase, a.image_id),
    description: a.thumbnail?.alt_text ?? "",
  }));

  const totalRaw = parsed.pagination?.total;
  const total =
    typeof totalRaw === "number" && Number.isFinite(totalRaw) ? totalRaw : null;
  const totalPages = total != null ? Math.ceil(total / PAGE_SIZE) : null;

  const hasMore =
    totalPages != null ? page < totalPages : Boolean(parsed.pagination?.next_url);

  return { items, hasMore, totalPages, total };
}
