import { useMemo, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TODO: [BACKEND TEAM] — Replace the localStorage implementation below with
// real API calls once the backend endpoints are available.
//
// Required endpoints:
//   POST   /api/v1/bookmarks                — create or update a bookmark
//     Body: { screenId, image, name, appId, appName, folder, note, tags, moduleId?, moduleName? }
//   DELETE /api/v1/bookmarks/:screenId      — remove a bookmark
//   GET    /api/v1/bookmarks               — list all bookmarks for current user (auth required)
//     Query: ?folder=&tag=&q=&page=&limit=
//   GET    /api/v1/bookmarks/folders       — list user folders with screen counts
//   GET    /api/v1/bookmarks/tags          — list all tags used by the user
//
// Auth: All endpoints must accept Firebase JWT as Bearer token.
//
// When implementing, replace the useState(load) initialisation with a
// useEffect that calls GET /api/v1/bookmarks on mount (with loading state).
// ─────────────────────────────────────────────────────────────────────────────

const BOOKMARKS_KEY = "uxboard:bookmarks_v2";

export type BookmarkedScreen = {
  /** screen._id — used as primary key */
  id: string;
  image: string;
  name: string;
  appId: string;
  appName: string;
  /** Optional — filled when bookmarked from a module detail page */
  moduleId?: string;
  moduleName?: string;
  /** Folder name chosen by the user — defaults to "Saved" */
  folder: string;
  note: string;
  tags: string[];
  savedAt: number;
};

export function useBookmarks() {
  const load = (): BookmarkedScreen[] => {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
    } catch {
      return [];
    }
  };

  const [bookmarks, setBookmarks] = useState<BookmarkedScreen[]>(load);

  const persist = (next: BookmarkedScreen[]) => {
    setBookmarks(next);
    // TODO: [BACKEND TEAM] Replace with optimistic API call
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  };

  /** Returns true if a screen with this id is already bookmarked */
  const isBookmarked = (screenId: string) =>
    bookmarks.some((b) => b.id === screenId);

  /** Returns the full bookmark record or null */
  const getBookmark = (screenId: string) =>
    bookmarks.find((b) => b.id === screenId) ?? null;

  /**
   * Create or update a bookmark.
   * TODO: [BACKEND TEAM] On create → POST /api/v1/bookmarks
   *                       On update → PUT  /api/v1/bookmarks/:screenId
   */
  const saveBookmark = (
    screen: { id: string; image: string; name: string },
    appId: string,
    appName: string,
    folder: string,
    note: string,
    tags: string[],
    moduleId?: string,
    moduleName?: string
  ) => {
    const existing = bookmarks.findIndex((b) => b.id === screen.id);
    const entry: BookmarkedScreen = {
      id: screen.id,
      image: screen.image,
      name: screen.name,
      appId,
      appName,
      moduleId,
      moduleName,
      folder: folder.trim() || "Saved",
      note,
      tags,
      savedAt: Date.now(),
    };
    if (existing >= 0) {
      const next = [...bookmarks];
      next[existing] = entry;
      persist(next);
    } else {
      persist([...bookmarks, entry]);
    }
  };

  /**
   * Remove a bookmark by screen id.
   * TODO: [BACKEND TEAM] Call DELETE /api/v1/bookmarks/:screenId
   */
  const removeBookmark = (screenId: string) =>
    persist(bookmarks.filter((b) => b.id !== screenId));

  /** All unique folder names across every bookmark (global, not per-app) */
  const allFolders = useMemo(
    () => Array.from(new Set(bookmarks.map((b) => b.folder))).sort(),
    [bookmarks]
  );

  /** All unique tags across every bookmark */
  const allTags = useMemo(
    () => Array.from(new Set(bookmarks.flatMap((b) => b.tags))).sort(),
    [bookmarks]
  );

  /** Bookmarks grouped by folder name */
  const byFolder = useMemo(() => {
    const map = new Map<string, BookmarkedScreen[]>();
    bookmarks.forEach((b) => {
      const arr = map.get(b.folder) ?? [];
      arr.push(b);
      map.set(b.folder, arr);
    });
    return map;
  }, [bookmarks]);

  return {
    bookmarks,
    isBookmarked,
    getBookmark,
    saveBookmark,
    removeBookmark,
    allFolders,
    allTags,
    byFolder,
  };
}
