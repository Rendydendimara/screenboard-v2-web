import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookmarkX,
  Check,
  ChevronRight,
  FolderOpen,
  FolderPlus,
  LayoutGrid,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Header, Footer } from "@/components/molecules";
import { AuthModal } from "@/components/AuthModal";
import BookmarkFolderPickerModal, { ScreenToBookmark } from "@/components/BookmarkFolderPickerModal";
import BookmarkAppCard from "@/components/BookmarkAppCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import clsx from "clsx";

/* ── tiny modal wrapper ───────────────────────────────────── */
function ConfirmModal({
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.24 }}
        className="w-full max-w-[360px] bg-white rounded-[20px] shadow-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-secondary font-bold text-[16px] text-[#0F0F0F]">{title}</p>
            <p className="font-secondary text-[13px] text-[#666] leading-[1.6]">{description}</p>
          </div>
          <button onClick={onCancel} className="w-7 h-7 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-[#E0E0E0] transition-colors shrink-0 mt-0.5">
            <X className="w-3.5 h-3.5 text-[#555]" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-9 rounded-full border border-[#E0E0E0] font-secondary text-[13px] text-[#555] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-9 rounded-full bg-red-500 text-white font-secondary font-semibold text-[13px] hover:bg-red-600 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── inline rename input ──────────────────────────────────── */
function RenameInput({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

  return (
    <div className="flex items-center gap-1.5 flex-1">
      <input
        ref={ref}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(val);
          if (e.key === "Escape") onCancel();
        }}
        className="flex-1 h-7 px-2 rounded-lg border border-purple-400 font-secondary text-[13px] text-[#0F0F0F] outline-none bg-white"
      />
      <button onClick={() => onSave(val)} className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors shrink-0">
        <Check className="w-3 h-3 text-white" />
      </button>
      <button onClick={onCancel} className="w-6 h-6 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-[#E0E0E0] transition-colors shrink-0">
        <X className="w-3 h-3 text-[#555]" />
      </button>
    </div>
  );
}

/* ── main page ────────────────────────────────────────────── */
const BookmarksPage: React.FC = () => {
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [pickerScreen, setPickerScreen] = useState<ScreenToBookmark | null>(null);

  // folder CRUD state
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [deletingFolder, setDeletingFolder] = useState<string | null>(null);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const newFolderInputRef = useRef<HTMLInputElement>(null);

  const { bookmarks, allFolders, removeBookmark, updateNote, renameFolder, deleteFolder } = useBookmarks();

  // Group visible bookmarks by appId → for app cards
  const groupedByApp = (list: typeof bookmarks) => {
    const map = new Map<string, { appId: string; appName: string; screens: typeof bookmarks }>();
    list.forEach((b) => {
      const existing = map.get(b.appId);
      if (existing) {
        existing.screens.push(b);
      } else {
        map.set(b.appId, { appId: b.appId, appName: b.appName, screens: [b] });
      }
    });
    return Array.from(map.values());
  };

  // Ordered sidebar folders: "All" (virtual) then "Saved" then the rest
  const sidebarFolders = ["All", "Saved", ...allFolders.filter((f) => f !== "Saved")];
  const uniqueSidebar = Array.from(new Set(sidebarFolders));

  // If activeFolder was deleted, fall back to "All"
  useEffect(() => {
    if (activeFolder !== "All" && !allFolders.includes(activeFolder)) {
      setActiveFolder("All");
    }
  }, [allFolders, activeFolder]);

  useEffect(() => {
    if (showNewFolderInput) newFolderInputRef.current?.focus();
  }, [showNewFolderInput]);

  const visibleBookmarks =
    activeFolder === "All"
      ? bookmarks
      : bookmarks.filter((b) => b.folder === activeFolder);

  const countFor = (folder: string) =>
    folder === "All" ? bookmarks.length : bookmarks.filter((b) => b.folder === folder).length;

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    // Create folder by saving a placeholder entry (no — just set it as activeFolder;
    // actual folder is created when a screen is saved to it).
    // We track it by navigating to it. The folder only "exists" in the bookmark store.
    // For now just switch to that folder after creating it via rename of nothing — 
    // we use a trick: if the name doesn't exist, just set active. User can then bookmark to it.
    // Actually we can't create an empty folder with the current hook (bookmarks store folders derived from bookmarks).
    // So: just set the UI to show it as selected; it will appear once a screen is saved there.
    setActiveFolder(name);
    setShowNewFolderInput(false);
    setNewFolderName("");
  };

  const handleRenameFolder = (oldName: string, newName: string) => {
    const trimmed = newName.trim();
    if (trimmed && trimmed !== oldName) {
      renameFolder(oldName, trimmed);
      if (activeFolder === oldName) setActiveFolder(trimmed);
    }
    setRenamingFolder(null);
  };

  const handleDeleteFolder = (name: string) => {
    deleteFolder(name, false); // move screens to "Saved"
    setDeletingFolder(null);
    if (activeFolder === name) setActiveFolder("Saved");
  };

  return (
    <>
      <SEO
        title="My Bookmarks – UXBoard"
        description="View your saved screens and UI inspirations, organized by folder."
        keywords="UXBoard bookmarks, saved screens, UI inspiration"
      />

      <Header
        scrolled={false}
        transparentBg={true}
        onOpenAuthModal={() => setIsOpenAuth(true)}
      />

      {/* Page top bar */}
      <section className="w-full bg-[#0C0C0C] pt-[100px] pb-0">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[1200px] py-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Bookmark className="w-5 h-5 text-purple-400 fill-purple-400" />
              </div>
              <div>
                <h1 className="font-secondary font-extrabold text-[28px] text-white leading-none">
                  My Bookmarks
                </h1>
                <p className="font-secondary text-[13px] text-white/35 mt-0.5">
                  {bookmarks.length} screen{bookmarks.length !== 1 ? "s" : ""} · {allFolders.length} folder{allFolders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="w-full bg-[#F7F7F7] min-h-[70vh]">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-0 py-8">

            {/* ── Left sidebar — folders ── */}
            <aside className="w-full md:w-[220px] shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="bg-white rounded-[20px] border border-[#EBEBEB] overflow-hidden shadow-sm">
                {/* Sidebar header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
                  <p className="font-secondary font-semibold text-[12px] text-[#999] uppercase tracking-[0.1em]">
                    Folders
                  </p>
                  <button
                    onClick={() => { setShowNewFolderInput(true); }}
                    title="New folder"
                    className="w-6 h-6 rounded-lg bg-[#F5F5F5] hover:bg-purple-100 flex items-center justify-center transition-colors group"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#AAA] group-hover:text-purple-600 transition-colors" />
                  </button>
                </div>

                {/* New folder input */}
                <AnimatePresence>
                  {showNewFolderInput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="px-3 py-2 border-b border-[#F0F0F0] overflow-hidden"
                    >
                      <div className="flex items-center gap-1.5">
                        <FolderPlus className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <input
                          ref={newFolderInputRef}
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateFolder();
                            if (e.key === "Escape") { setShowNewFolderInput(false); setNewFolderName(""); }
                          }}
                          placeholder="Folder name..."
                          className="flex-1 h-7 px-2 rounded-lg border border-purple-300 font-secondary text-[12px] outline-none text-[#0F0F0F] bg-white"
                        />
                        <button onClick={handleCreateFolder} className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </button>
                        <button onClick={() => { setShowNewFolderInput(false); setNewFolderName(""); }} className="w-6 h-6 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-[#E0E0E0] transition-colors shrink-0">
                          <X className="w-3 h-3 text-[#555]" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Folder list */}
                <ul className="py-1.5">
                  {uniqueSidebar.map((folder) => {
                    const count = countFor(folder);
                    const isActive = activeFolder === folder;
                    const isProtected = folder === "All" || folder === "Saved";
                    const isRenaming = renamingFolder === folder;

                    return (
                      <li key={folder}>
                        <div
                          className={clsx(
                            "group flex items-center gap-2 px-3 py-2.5 mx-1.5 rounded-[12px] cursor-pointer transition-all",
                            isActive
                              ? "bg-purple-50 text-purple-700"
                              : "text-[#444] hover:bg-[#F5F5F5]"
                          )}
                          onClick={() => !isRenaming && setActiveFolder(folder)}
                        >
                          {folder === "All" ? (
                            <LayoutGrid className={clsx("w-3.5 h-3.5 shrink-0", isActive ? "text-purple-500" : "text-[#BBB]")} />
                          ) : (
                            <FolderOpen className={clsx("w-3.5 h-3.5 shrink-0", isActive ? "text-purple-500" : "text-[#BBB]")} />
                          )}

                          {isRenaming ? (
                            <RenameInput
                              value={folder}
                              onSave={(v) => handleRenameFolder(folder, v)}
                              onCancel={() => setRenamingFolder(null)}
                            />
                          ) : (
                            <>
                              <span className={clsx("flex-1 font-secondary text-[13px] truncate", isActive ? "font-semibold" : "font-medium")}>
                                {folder}
                              </span>
                              <span className={clsx("font-secondary text-[11px] shrink-0", isActive ? "text-purple-400" : "text-[#CCC]")}>
                                {count}
                              </span>

                              {/* Actions — only show on non-protected folders, on hover */}
                              {!isProtected && (
                                <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setRenamingFolder(folder); }}
                                    title="Rename"
                                    className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-purple-100 transition-colors"
                                  >
                                    <Pencil className="w-3 h-3 text-[#888] hover:text-purple-600" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setDeletingFolder(folder); }}
                                    title="Delete folder"
                                    className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3 text-[#888] hover:text-red-500" />
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* New folder CTA at bottom */}
                <div className="px-3 pb-3 pt-1 border-t border-[#F0F0F0]">
                  <button
                    onClick={() => setShowNewFolderInput(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-[12px] border border-dashed border-[#DDD] text-[#AAA] hover:border-purple-300 hover:text-purple-500 transition-all font-secondary text-[12px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New folder
                  </button>
                </div>
              </div>
            </aside>

            {/* ── Right panel — screens ── */}
            <div className="flex-1 min-w-0">
              {/* Panel header */}
              <div className="flex items-center gap-2 mb-5">
                {activeFolder !== "All" && (
                  <FolderOpen className="w-4 h-4 text-[#888]" />
                )}
                <h2 className="font-secondary font-bold text-[18px] text-[#1A1A1A]">
                  {activeFolder}
                </h2>
                <span className="font-secondary text-[13px] text-[#AAA]">
                  · {visibleBookmarks.length} screen{visibleBookmarks.length !== 1 ? "s" : ""}
                </span>
              </div>

              {visibleBookmarks.length === 0 ? (
                <motion.div
                  key={activeFolder + "-empty"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-24 gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8E8E8] flex items-center justify-center shadow-sm">
                    <BookmarkX className="w-7 h-7 text-[#BDBDBD]" />
                  </div>
                  <p className="font-secondary font-semibold text-[15px] text-[#333]">
                    No screens in "{activeFolder}"
                  </p>
                  <p className="font-secondary text-[13px] text-[#888] text-center max-w-[260px]">
                    Browse apps and tap the bookmark icon on a screen to save it here.
                  </p>
                  <Link
                    to="/"
                    className="mt-1 h-9 px-5 rounded-full bg-[#0C0C0C] text-white font-secondary text-[13px] font-medium flex items-center gap-1.5 hover:bg-[#222] transition-colors"
                  >
                    Browse apps <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-5">
                  <AnimatePresence mode="popLayout">
                    {groupedByApp(visibleBookmarks).map((group, i) => (
                      <motion.div
                        key={group.appId}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.28, delay: i * 0.04 }}
                      >
                        <BookmarkAppCard
                          appId={group.appId}
                          appName={group.appName}
                          screens={group.screens}
                          onRemove={removeBookmark}
                          onUpdateNote={updateNote}
                          onMoveFolder={(screen) => setPickerScreen(screen)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Folder picker modal — move screen to another folder */}
      <BookmarkFolderPickerModal
        isOpen={!!pickerScreen}
        screen={pickerScreen}
        onClose={() => setPickerScreen(null)}
      />

      {/* Delete folder confirm */}
      <AnimatePresence>
        {deletingFolder && (
          <ConfirmModal
            title={`Delete "${deletingFolder}"?`}
            description="Screens in this folder will be moved to Saved. This cannot be undone."
            confirmLabel="Delete folder"
            onConfirm={() => handleDeleteFolder(deletingFolder)}
            onCancel={() => setDeletingFolder(null)}
          />
        )}
      </AnimatePresence>

      <AuthModal isOpen={isOpenAuth} onClose={() => setIsOpenAuth(false)} />
    </>
  );
};

export default BookmarksPage;
