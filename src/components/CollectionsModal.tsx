import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Check,
  ChevronRight,
  Edit2,
  FolderOpen,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import { BookmarkedScreen, useBookmarks } from "@/hooks/useBookmarks";

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectionsModal: React.FC<CollectionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    bookmarks,
    allFolders,
    allTags,
    byFolder,
    removeBookmark,
  } = useBookmarks();

  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let items = activeFolder ? (byFolder.get(activeFolder) ?? []) : bookmarks;
    if (activeTag) items = items.filter((b) => b.tags.includes(activeTag));
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.appName.toLowerCase().includes(q) ||
          b.note.toLowerCase().includes(q) ||
          b.tags.some((t) => t.includes(q))
      );
    }
    return [...items].sort((a, b) => b.savedAt - a.savedAt);
  }, [bookmarks, byFolder, activeFolder, activeTag, search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
            className="w-full max-w-[1100px] bg-[#0f0f0f] border border-white/[0.09] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            style={{ height: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Modal Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600/20 border border-purple-500/20 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-purple-400 fill-purple-400" />
                </div>
                <div>
                  <h2 className="font-secondary font-bold text-[16px] text-white leading-none">
                    My Collections
                  </h2>
                  <p className="font-secondary text-[11px] text-white/30 mt-0.5">
                    {bookmarks.length}{" "}
                    {bookmarks.length === 1 ? "screen" : "screens"} saved
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
              {/* Sidebar */}
              <div className="w-[200px] shrink-0 border-r border-white/[0.06] flex flex-col py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {/* All */}
                <button
                  onClick={() => setActiveFolder(null)}
                  className={clsx(
                    "flex items-center justify-between px-4 py-2 mx-2 rounded-[10px] text-left transition-colors text-[13px] font-secondary",
                    !activeFolder
                      ? "bg-white/[0.08] text-white font-semibold"
                      : "text-white/40 hover:text-white/70"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Bookmark className="w-3.5 h-3.5 shrink-0" />
                    All Saves
                  </span>
                  <span
                    className={clsx(
                      "text-[11px] px-1.5 py-0.5 rounded-full font-bold",
                      !activeFolder
                        ? "bg-white/[0.12] text-white"
                        : "text-white/30"
                    )}
                  >
                    {bookmarks.length}
                  </span>
                </button>

                {allFolders.length > 0 && (
                  <p className="mt-5 mb-2 px-6 font-secondary text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                    Folders
                  </p>
                )}

                {allFolders.map((f) => {
                  const count = byFolder.get(f)?.length ?? 0;
                  const active = activeFolder === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setActiveFolder(active ? null : f)}
                      className={clsx(
                        "flex items-center justify-between px-4 py-2 mx-2 rounded-[10px] text-left transition-colors text-[13px] font-secondary",
                        active
                          ? "bg-white/[0.08] text-white font-semibold"
                          : "text-white/40 hover:text-white/70"
                      )}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{f}</span>
                      </span>
                      <span
                        className={clsx(
                          "shrink-0 text-[11px] px-1.5 py-0.5 rounded-full font-bold",
                          active
                            ? "bg-white/[0.12] text-white"
                            : "text-white/30"
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}

                {allTags.length > 0 && (
                  <>
                    <p className="mt-5 mb-2 px-6 font-secondary text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
                      Tags
                    </p>
                    <div className="px-4 flex flex-wrap gap-1.5">
                      {allTags.map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            setActiveTag(activeTag === t ? null : t)
                          }
                          className={clsx(
                            "h-6 px-2.5 rounded-full text-[11px] font-secondary font-medium transition-all border",
                            activeTag === t
                              ? "bg-purple-600 border-purple-600 text-white"
                              : "border-white/10 text-white/30 hover:border-purple-400/30 hover:text-purple-300/70"
                          )}
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0">
                {/* Search + active filters */}
                <div className="px-5 py-3 border-b border-white/[0.05] shrink-0 flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search screens, notes, tags…"
                      className="w-full h-9 pl-9 pr-9 rounded-full bg-white/[0.05] border border-white/[0.08] text-white text-[13px] font-secondary outline-none focus:border-purple-400/40 transition-colors placeholder:text-white/20"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Active filter badges */}
                  {(activeFolder || activeTag) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {activeFolder && (
                        <span className="flex items-center gap-1 h-7 px-2.5 rounded-full bg-white/[0.06] border border-white/10 text-[12px] font-secondary text-white/50">
                          <FolderOpen className="w-3 h-3" />
                          {activeFolder}
                          <button
                            onClick={() => setActiveFolder(null)}
                            className="hover:text-white/80 transition-colors ml-0.5"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      )}
                      {activeTag && (
                        <span className="flex items-center gap-1 h-7 px-2.5 rounded-full bg-purple-500/15 border border-purple-400/20 text-[12px] font-secondary text-purple-300">
                          <Tag className="w-3 h-3" />#{activeTag}
                          <button
                            onClick={() => setActiveTag(null)}
                            className="hover:text-white/80 transition-colors ml-0.5"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      )}
                    </div>
                  )}

                  <span className="text-[12px] font-secondary text-white/20 shrink-0 ml-auto">
                    {filtered.length}{" "}
                    {filtered.length === 1 ? "screen" : "screens"}
                  </span>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                        <Bookmark className="w-7 h-7 text-white/20" />
                      </div>
                      <div>
                        <p className="font-secondary font-semibold text-[16px] text-white/40">
                          {bookmarks.length === 0
                            ? "No saves yet"
                            : "Nothing matches"}
                        </p>
                        <p className="font-secondary text-[13px] text-white/20 mt-1">
                          {bookmarks.length === 0
                            ? "Save screens from any app or module to start building your collection"
                            : "Try adjusting your filters or search term"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {filtered.map((b) => (
                        <BookmarkCard
                          key={b.id}
                          bookmark={b}
                          onRemove={() => removeBookmark(b.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── BookmarkCard ── */
const BookmarkCard: React.FC<{
  bookmark: BookmarkedScreen;
  onRemove: () => void;
}> = ({ bookmark, onRemove }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative rounded-[14px] overflow-hidden border border-white/[0.07] bg-white/[0.03]">
        {/* TODO: [BACKEND TEAM] If image is stored as a relative path, wrap with getImageUrl() here */}
        <img
          src={bookmark.image}
          alt={bookmark.name}
          className="w-full aspect-[9/19.5] object-cover"
          loading="lazy"
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/65 flex flex-col justify-end p-3"
            >
              {bookmark.note && (
                <p className="font-secondary text-[11px] text-white/70 line-clamp-3 leading-[1.5]">
                  {bookmark.note}
                </p>
              )}
              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500/40 transition-colors"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card info */}
      <div className="flex flex-col gap-1 px-0.5">
        <p className="font-secondary text-[12px] text-white/60 truncate">
          {bookmark.name || bookmark.appName}
        </p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-[10px] font-secondary text-white/25">
            <FolderOpen className="w-2.5 h-2.5 shrink-0" />
            {bookmark.folder}
          </span>
          {bookmark.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[10px] font-secondary text-purple-400/50"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsModal;
