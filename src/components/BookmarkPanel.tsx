import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Check,
  FolderOpen,
  MessageSquare,
  Plus,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

export interface BookmarkPanelProps {
  /** screen._id — used as primary key in the bookmarks store */
  screenId: string;
  /** Absolute image URL (already passed through getImageUrl) */
  screenImage: string;
  screenName: string;
  appId: string;
  appName: string;
  onClose: () => void;
  /** Optional — pass when opened from a module detail page */
  moduleId?: string;
  moduleName?: string;
}

const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  screenId,
  screenImage,
  screenName,
  appId,
  appName,
  onClose,
  moduleId,
  moduleName,
}) => {
  const {
    isBookmarked,
    getBookmark,
    saveBookmark,
    removeBookmark,
    allFolders,
    allTags,
  } = useBookmarks();

  const existing = getBookmark(screenId);
  const saved = isBookmarked(screenId);

  const [folder, setFolder] = useState(existing?.folder ?? "Saved");
  const [note, setNote] = useState(existing?.note ?? "");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [showFolderNew, setShowFolderNew] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  /* Deduped folder list — "Saved" always first */
  const folderList = ["Saved", ...allFolders.filter((f) => f !== "Saved")];

  /* Suggest existing tags that match the current input and aren't yet added */
  const tagSuggestions =
    tagInput.trim()
      ? allTags.filter(
          (t) =>
            t.toLowerCase().includes(tagInput.trim().toLowerCase()) &&
            !tags.includes(t)
        )
      : allTags.filter((t) => !tags.includes(t)).slice(0, 8);

  const addTag = (t?: string) => {
    const raw = (t ?? tagInput).trim().toLowerCase().replace(/[\s,]+/g, "-");
    if (raw && !tags.includes(raw)) setTags((p) => [...p, raw]);
    setTagInput("");
    tagInputRef.current?.focus();
  };

  const confirmFolder = () => {
    const f = newFolder.trim();
    if (f) {
      setFolder(f);
      setShowFolderNew(false);
      setNewFolder("");
    }
  };

  const handleSave = () => {
    saveBookmark(
      { id: screenId, image: screenImage, name: screenName },
      appId,
      appName,
      folder,
      note,
      tags,
      moduleId,
      moduleName
    );
    onClose();
  };

  const handleRemove = () => {
    removeBookmark(screenId);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-[320px] shrink-0 bg-[#111] border-l border-white/[0.08] flex flex-col h-full overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
        <div className="flex items-center gap-2">
          <Bookmark
            className={clsx(
              "w-4 h-4 text-purple-400",
              saved && "fill-purple-400"
            )}
          />
          <span className="font-secondary font-semibold text-[14px] text-white">
            {saved ? "Saved" : "Save Screen"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <button
              onClick={handleRemove}
              className="flex items-center gap-1 text-[11px] font-secondary text-red-400/60 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
          >
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">

        {/* FOLDER */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-1.5 font-secondary text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em]">
            <FolderOpen className="w-3 h-3" />
            Folder
          </label>
          <div className="flex flex-wrap gap-2">
            {folderList.map((f) => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className={clsx(
                  "h-7 px-3 rounded-full border text-[12px] font-secondary font-medium transition-all",
                  folder === f
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "border-white/15 text-white/40 hover:border-purple-400/40 hover:text-white/70"
                )}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => setShowFolderNew((v) => !v)}
              title="New folder"
              className="h-7 w-7 flex items-center justify-center rounded-full border border-dashed border-white/20 text-white/30 hover:border-purple-400/40 hover:text-white/60 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <AnimatePresence>
            {showFolderNew && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex gap-2"
              >
                <input
                  autoFocus
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") confirmFolder();
                    if (e.key === "Escape") {
                      setShowFolderNew(false);
                      setNewFolder("");
                    }
                  }}
                  placeholder="New folder name…"
                  className="flex-1 h-8 px-3 rounded-full bg-white/5 border border-white/15 text-white text-[12px] font-secondary outline-none focus:border-purple-400 transition-colors placeholder:text-white/20"
                />
                <button
                  onClick={confirmFolder}
                  className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TAGS */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-1.5 font-secondary text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em]">
            <Tag className="w-3 h-3" />
            Tags
          </label>

          {/* Applied tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-purple-500/15 border border-purple-400/20 text-purple-300 text-[11px] font-secondary font-medium"
                >
                  #{t}
                  <button
                    onClick={() => setTags((p) => p.filter((x) => x !== t))}
                    className="opacity-50 hover:opacity-100 transition-opacity ml-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag input */}
          <div className="flex gap-2">
            <input
              ref={tagInputRef}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Type & press Enter to add…"
              className="flex-1 h-8 px-3 rounded-full bg-white/5 border border-white/15 text-white text-[12px] font-secondary outline-none focus:border-purple-400 transition-colors placeholder:text-white/20"
            />
            {tagInput.trim() && (
              <button
                onClick={() => addTag()}
                className="h-8 w-8 rounded-full bg-white/[0.08] flex items-center justify-center hover:bg-white/[0.16] transition-colors border border-white/10 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-white/50" />
              </button>
            )}
          </div>

          {/* Existing-tag suggestions */}
          {tagSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <span className="w-full font-secondary text-[10px] text-white/20 uppercase tracking-[0.08em]">
                {tagInput.trim() ? "Matching" : "Existing tags"}
              </span>
              {tagSuggestions.map((t) => (
                <button
                  key={t}
                  onClick={() => addTag(t)}
                  className="h-6 px-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-white/30 text-[11px] font-secondary hover:border-purple-400/30 hover:text-purple-300/70 transition-all"
                >
                  + #{t}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NOTE */}
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-1.5 font-secondary text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em]">
            <MessageSquare className="w-3 h-3" />
            Note
            {note.length > 0 && (
              <span className="ml-auto text-[10px] text-white/20 normal-case tracking-normal font-normal">
                {note.length} / 500
              </span>
            )}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 500))}
            rows={4}
            placeholder="Annotation, design insight, or anything you want to remember…"
            className="w-full px-3 py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-white text-[13px] font-secondary leading-[1.6] placeholder:text-white/20 outline-none focus:border-purple-400/50 resize-none transition-colors"
          />
        </div>

        {/* Screen preview */}
        <div className="rounded-[12px] overflow-hidden border border-white/[0.06] bg-white/[0.03] p-3 flex items-center gap-3">
          <img
            src={screenImage}
            alt={screenName}
            className="w-8 shrink-0 rounded-[6px] object-cover bg-white/[0.08]"
            style={{ aspectRatio: "9/19.5", height: "auto" }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-secondary text-[12px] text-white/60 truncate">
              {screenName || appName}
            </p>
            <p className="font-secondary text-[11px] text-white/30 truncate">
              {appName}
              {folder !== "Saved" ? ` · ${folder}` : ""}
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 px-5 py-4 border-t border-white/[0.07]">
        <button
          onClick={handleSave}
          className="w-full h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-secondary font-bold text-[13px] hover:opacity-90 active:scale-[0.98] transition-all"
        >
          {saved ? "Update Collection" : "Save to Collection"}
        </button>
      </div>
    </motion.div>
  );
};

export default BookmarkPanel;
