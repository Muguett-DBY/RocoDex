"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CREATURE_COLLECTION_STORAGE_KEY,
  parseCreatureCollection,
  serializeCreatureCollection,
  toggleCreatureCollectionId,
} from "@/lib/creature-collection";

const COLLECTION_CHANGE_EVENT = "rocodex:creature-collection-change";

function readCollection() {
  try {
    return parseCreatureCollection(window.localStorage.getItem(CREATURE_COLLECTION_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function useCreatureCollection() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIds(readCollection());
      setHydrated(true);
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(COLLECTION_CHANGE_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(COLLECTION_CHANGE_EVENT, sync);
    };
  }, []);

  const write = useCallback((nextIds: string[]) => {
    let persisted = false;
    try {
      window.localStorage.setItem(CREATURE_COLLECTION_STORAGE_KEY, serializeCreatureCollection(nextIds));
      persisted = true;
    } catch {
      // Keep the current page usable when storage is unavailable.
    }
    setIds(nextIds);
    if (persisted) {
      window.dispatchEvent(new Event(COLLECTION_CHANGE_EVENT));
    }
  }, []);

  const toggle = useCallback((id: string) => {
    write(toggleCreatureCollectionId(ids, id));
  }, [ids, write]);

  const remove = useCallback((id: string) => {
    write(ids.filter((item) => item !== id));
  }, [ids, write]);

  const clear = useCallback(() => write([]), [write]);

  return {
    ids,
    hydrated,
    toggle,
    remove,
    clear,
    isSaved: (id: string) => ids.includes(id),
  };
}
