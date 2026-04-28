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

const BOOKMARKS_KEY = "uxboard:bookmarks_v3";

// ── Dummy seed data — remove once backend is integrated ──────────────────────
// DEMO SCENARIO:
//   - App "BXC App" has 3 screens (Screen 1, 2, 3) → all start in "Folder A"
//   - Moving Screen 2 to "Folder B" causes BXC App to auto-appear in Folder B
//     (because groupedByApp() re-derives from the updated bookmarks list)
const DUMMY_SEED: BookmarkedScreen[] = [
  // ── BXC App — 3 screens all in Folder A (the key demo scenario) ──────────
  {
    id: "bxc-screen-1",
    image: "https://placehold.co/220x480/18103a/a855f7?text=BXC+Screen+1",
    name: "Screen 1 — Home",
    appId: "bxc-app",
    appName: "BXC App",
    folder: "Folder A",
    note: "Nice hero layout",
    tags: ["home"],
    savedAt: Date.now() - 86400000 * 6,
  },
  {
    id: "bxc-screen-2",
    image: "https://placehold.co/220x480/18103a/7c3aed?text=BXC+Screen+2",
    name: "Screen 2 — Checkout",
    appId: "bxc-app",
    appName: "BXC App",
    folder: "Folder A",
    note: "Move me to Folder B to test cross-folder grouping!",
    tags: ["checkout"],
    savedAt: Date.now() - 86400000 * 5,
  },
  {
    id: "bxc-screen-3",
    image: "https://placehold.co/220x480/18103a/c084fc?text=BXC+Screen+3",
    name: "Screen 3 — Profile",
    appId: "bxc-app",
    appName: "BXC App",
    folder: "Folder A",
    note: "",
    tags: ["profile"],
    savedAt: Date.now() - 86400000 * 4,
  },
  // ── Folder B — initially empty of BXC, to receive Screen 2 ───────────────
  {
    id: "shopee-login",
    image: "https://placehold.co/220x480/1a0a2e/ec4899?text=Login",
    name: "Login",
    appId: "seed-app-2",
    appName: "Shopee",
    folder: "Folder B",
    note: "Nice gradient auth screen",
    tags: ["auth"],
    savedAt: Date.now() - 86400000 * 3,
  },
  // ── Other folders ──────────────────────────────────────────────────────────
  {
    id: "seed-1",
    image: "https://placehold.co/220x480/111827/a855f7?text=Home",
    name: "Home",
    appId: "seed-app-1",
    appName: "Tokopedia",
    folder: "Saved",
    note: "Clean home layout",
    tags: ["home", "ecommerce"],
    savedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "seed-2",
    image: "https://placehold.co/220x480/0f172a/3b82f6?text=Product",
    name: "Product Detail",
    appId: "seed-app-1",
    appName: "Tokopedia",
    folder: "Saved",
    note: "",
    tags: ["product"],
    savedAt: Date.now() - 86400000,
  },
];

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
      const stored = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "null");
      if (stored === null) {
        // Seed dummy data on first load
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(DUMMY_SEED));
        return DUMMY_SEED;
      }
      return stored;
    } catch {
      return DUMMY_SEED;
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

  /**
   * Rename a folder across all bookmarks that belong to it.
   * TODO: [BACKEND TEAM] PATCH /api/v1/bookmarks/folders/:oldName { newName }
   */
  const renameFolder = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;
    persist(bookmarks.map((b) => (b.folder === oldName ? { ...b, folder: trimmed } : b)));
  };

  /**
   * Delete a folder.
   * If deleteScreens=true  → remove all bookmarks in that folder.
   * If deleteScreens=false → move them to "Saved".
   * TODO: [BACKEND TEAM] DELETE /api/v1/bookmarks/folders/:name?deleteScreens=true|false
   */
  const deleteFolder = (name: string, deleteScreens: boolean) => {
    if (deleteScreens) {
      persist(bookmarks.filter((b) => b.folder !== name));
    } else {
      persist(bookmarks.map((b) => (b.folder === name ? { ...b, folder: "Saved" } : b)));
    }
  };

  /**
   * Move a single bookmark to a different folder.
   * TODO: [BACKEND TEAM] PATCH /api/v1/bookmarks/:screenId { folder }
   */
  const moveToFolder = (screenId: string, folder: string) => {
    const trimmed = folder.trim() || "Saved";
    persist(bookmarks.map((b) => (b.id === screenId ? { ...b, folder: trimmed } : b)));
  };

  /**
   * Update the note for a single bookmarked screen.
   * TODO: [BACKEND TEAM] PATCH /api/v1/bookmarks/:screenId { note }
   */
  const updateNote = (screenId: string, note: string) => {
    persist(bookmarks.map((b) => (b.id === screenId ? { ...b, note } : b)));
  };

  return {
    bookmarks,
    isBookmarked,
    getBookmark,
    saveBookmark,
    removeBookmark,
    updateNote,
    allFolders,
    allTags,
    byFolder,
    renameFolder,
    deleteFolder,
    moveToFolder,
  };
}
