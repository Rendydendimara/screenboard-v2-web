import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookmarkedScreen } from "@/hooks/useBookmarks";
import { ScreenToBookmark } from "@/components/BookmarkFolderPickerModal";
import {
  ArrowUpRight,
  Check,
  FolderOpen,
  MessageSquare,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import clsx from "clsx";

interface BookmarkAppCardProps {
  appId: string;
  appName: string;
  screens: BookmarkedScreen[];
  onRemove: (screenId: string) => void;
  onUpdateNote: (screenId: string, note: string) => void;
  onMoveFolder: (screen: ScreenToBookmark) => void;
}

/* ── small inline note editor ── */
function NoteEditor({
  screenId,
  initial,
  onSave,
  onClose,
}: {
  screenId: string;
  initial: string;
  onSave: (v: string) => void;
  onClose: () => void;
}) {
  const [val, setVal] = useState(initial);
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm border-t border-[#E8E8E8] p-2.5 z-20"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="font-secondary text-[10px] font-semibold text-[#888] uppercase tracking-[0.08em] mb-1.5">
        Note
      </p>
      <textarea
        ref={ref}
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSave(val); }
          if (e.key === "Escape") onClose();
        }}
        placeholder="Add a note…"
        rows={2}
        className="w-full resize-none font-secondary text-[12px] text-[#222] placeholder:text-[#CCC] bg-transparent outline-none leading-[1.55]"
      />
      <div className="flex items-center justify-end gap-1.5 mt-1.5">
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-[#E0E0E0] transition-colors"
        >
          <X className="w-3 h-3 text-[#777]" />
        </button>
        <button
          onClick={() => onSave(val)}
          className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors"
        >
          <Check className="w-3 h-3 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

/* ── single screen tile inside the card ── */
function ScreenTile({
  bookmark,
  onRemove,
  onUpdateNote,
  onMoveFolder,
}: {
  bookmark: BookmarkedScreen;
  onRemove: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onMoveFolder: (screen: ScreenToBookmark) => void;
}) {
  const [editingNote, setEditingNote] = useState(false);

  return (
    <div className="flex-shrink-0 w-[220px] flex flex-col gap-2.5">
      {/* Image + overlay */}
      <div className="relative w-[220px] h-[390px] rounded-[18px] overflow-hidden bg-[#F0F0F0] border border-[#EBEBEB] group">
        <img
          src={bookmark.image}
          alt={bookmark.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />

        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 z-10">
          {/* Move to folder */}
          <button
            onClick={() =>
              onMoveFolder({
                id: bookmark.id,
                image: bookmark.image,
                name: bookmark.name,
                appId: bookmark.appId,
                appName: bookmark.appName,
                moduleId: bookmark.moduleId,
                moduleName: bookmark.moduleName,
              })
            }
            title="Move to folder"
            className="flex items-center gap-2 h-8 px-4 rounded-full bg-white/25 backdrop-blur-sm border border-white/30 text-white font-secondary text-[12px] hover:bg-white/40 transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Move
          </button>

          {/* Edit note */}
          <button
            onClick={() => setEditingNote(true)}
            title="Add note"
            className="flex items-center gap-2 h-8 px-4 rounded-full bg-white/25 backdrop-blur-sm border border-white/30 text-white font-secondary text-[12px] hover:bg-white/40 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Note
          </button>

          {/* Delete */}
          <button
            onClick={() => onRemove(bookmark.id)}
            title="Remove"
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-red-500/70 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Inline note editor */}
        <AnimatePresence>
          {editingNote && (
            <NoteEditor
              screenId={bookmark.id}
              initial={bookmark.note ?? ""}
              onSave={(v) => { onUpdateNote(bookmark.id, v); setEditingNote(false); }}
              onClose={() => setEditingNote(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Screen label */}
      <div className="flex flex-col gap-1 px-0.5">
        <p className="font-secondary font-semibold text-[14px] text-[#1A1A1A] truncate leading-none">
          {bookmark.name || "Screen"}
        </p>

        {/* Note preview or add-note button */}
        {bookmark.note ? (
          <div className="flex items-start gap-1.5 mt-0.5">
            <MessageSquare className="w-3 h-3 text-[#AEAEB2] shrink-0 mt-[1px]" />
            <p className="font-secondary text-[12px] text-[#AEAEB2] line-clamp-2 leading-[1.45] italic flex-1">
              {bookmark.note}
            </p>
            <button
              onClick={() => setEditingNote(true)}
              className="shrink-0"
              title="Edit note"
            >
              <Pencil className="w-3 h-3 text-[#CFCFCF] hover:text-purple-500 transition-colors" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingNote(true)}
            className="flex items-center gap-1.5 mt-0.5 text-left"
          >
            <MessageSquare className="w-3 h-3 text-[#D8D8D8]" />
            <span className="font-secondary text-[12px] text-[#D8D8D8] hover:text-purple-400 transition-colors">
              Add note
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── App Group Card ── */
const BookmarkAppCard: React.FC<BookmarkAppCardProps> = ({
  appId,
  appName,
  screens,
  onRemove,
  onUpdateNote,
  onMoveFolder,
}) => {
  return (
    <div className="bg-white rounded-[20px] border border-[#EBEBEB] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F4F4F4]">
        {/* App icon placeholder using first screen image */}
        <div className="w-10 h-10 rounded-[10px] overflow-hidden border border-[#EBEBEB] bg-[#F5F5F5] shrink-0">
          <img
            src={screens[0]?.image}
            alt={appName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-secondary font-bold text-[15px] text-[#0F0F0F] truncate">
            {appName}
          </p>
          <p className="font-secondary text-[12px] text-[#AEAEB2]">
            {screens.length} screen{screens.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link
          to={`/app/${appId}`}
          title="Go to app page"
          className="flex items-center gap-1.5 px-3 h-8 rounded-full border border-[#EBEBEB] bg-white hover:bg-[#F5F3FF] hover:border-purple-300 text-[#888] hover:text-purple-600 transition-colors shrink-0"
        >
          <span className="font-secondary text-[12px] font-medium">View App</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal screen strip */}
      <div className="px-5 py-5 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <div className="flex items-start gap-5">
          {screens.map((screen) => (
            <ScreenTile
              key={screen.id}
              bookmark={screen}
              onRemove={onRemove}
              onUpdateNote={onUpdateNote}
              onMoveFolder={onMoveFolder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkAppCard;
