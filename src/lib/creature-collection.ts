export const CREATURE_COLLECTION_STORAGE_KEY = "rocodex.creature-collection.v1";

const CREATURE_ID_PATTERN = /^\d{3}$/;

export function normalizeCreatureCollectionIds(values: unknown[]) {
  const seen = new Set<string>();

  return values.flatMap((value) => {
    if (typeof value !== "string" || !CREATURE_ID_PATTERN.test(value) || seen.has(value)) {
      return [];
    }
    seen.add(value);
    return [value];
  });
}

export function parseCreatureCollection(raw: string | null) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as { version?: unknown; ids?: unknown };
    if (parsed.version !== 1 || !Array.isArray(parsed.ids)) return [];
    return normalizeCreatureCollectionIds(parsed.ids);
  } catch {
    return [];
  }
}

export function serializeCreatureCollection(ids: string[]) {
  return JSON.stringify({ version: 1, ids: normalizeCreatureCollectionIds(ids) });
}

export function toggleCreatureCollectionId(ids: string[], id: string) {
  const normalized = normalizeCreatureCollectionIds(ids);
  if (!CREATURE_ID_PATTERN.test(id)) return normalized;
  return normalized.includes(id) ? normalized.filter((item) => item !== id) : [...normalized, id];
}

export function buildCollectionCompareHref(ids: string[]) {
  const normalized = normalizeCreatureCollectionIds(ids).slice(0, 4);
  if (normalized.length < 2) return null;
  return `/compare?ids=${encodeURIComponent(normalized.join(","))}`;
}
