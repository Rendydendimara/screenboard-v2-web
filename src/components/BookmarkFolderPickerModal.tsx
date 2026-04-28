import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Check, FolderOpen, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";

export interface ScreenToBookmark {
  id: string;
  image: string;
  name: string;
  appId: string;
  appName: string;
  moduleId?: string;
  moduleName?: string;
}

interface BookmarkFolderPickerModalProps {
  isOpen: boolean;
  screen: ScreenToBookmark | null;
  onClose: () => void;
}

const BookmarkFolderPickerModal: React.FC<BookmarkFolderPickerModalProps> = ({
  isOpen,
  screen,
  onClose,
}) => {
  const { allFolders, saveBookmark, moveToFolder, isBookmarked, getBookmark } = useBookmarks();

  const [selectedFolder, setSelectedFolder] = useState("Saved");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Reset state whenever the modal opens for a new screen
  useEffect(() => {
    if (isOpen && screen) {
      const existing = getBookmark(screen.id);
      setSelectedFolder(existing?.folder ?? "Saved");
      setShowNewFolder(false);
      setNewFolderName("");
    }
  }, [isOpen, screen?.id]);

  if (!screen) return null;

  const orderedFolders = ["Saved", ...allFolders.filter((f) => f !== "Saved")];

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    setSelectedFolder(name);
    setShowNewFolder(false);
    setNewFolderName("");
  };

  const handleSave = () => {
    if (alreadySaved) {
      // Moving an existing bookmark — preserve its note & tags
      moveToFolder(screen.id, selectedFolder);
    } else {
      saveBookmark(
        { id: screen.id, image: screen.image, name: screen.name },
        screen.appId,
        screen.appName,
        selectedFolder,
        "",
        [],
        screen.moduleId,
        screen.moduleName
      );
    }
    onClose();
  };

  const alreadySaved = isBookmarked(screen.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 12 }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.28 }}
            className="w-full max-w-[380px] bg-[#111] border border-white/[0.10] rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.85)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/20 flex items-center justify-center">
                  <Bookmark className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                </div>
                <div>
                  <p className="font-secondary font-bold text-[14px] text-white leading-none">
                    {alreadySaved ? "Move to Folder" : "Save to Folder"}
                  </p>
                  <p className="font-secondary text-[11px] text-white/35 mt-0.5 truncate max-w-[220px]">
                    {screen.name || screen.appName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>

            {/* Screen preview */}
            <div className="flex items-center gap-3 px-5 py-4">
              <div className="w-12 h-[64px] rounded-[10px] overflow-hidden border border-white/[0.08] bg-white/[0.04] shrink-0">
                <img
                  src={screen.image}
                  alt={screen.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-secondary font-semibold text-[13px] text-white truncate max-w-[270px]">
                  {screen.name || "Screen"}
                </p>
                <p className="font-secondary text-[11px] text-white/35 mt-0.5">{screen.appName}</p>
              </div>
            </div>

            {/* Folder picker */}
            <div className="px-5 pb-2">
              <p className="font-secondary text-[10px] font-bold text-white/30 uppercase tracking-[0.1em] mb-3">
                Choose folder
              </p>

              <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                {orderedFolders.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFolder(f)}
                    className={clsx(
                      "flex items-center justify-between w-full px-4 py-2.5 rounded-[12px] text-left transition-all border",
                      selectedFolder === f
                        ? "bg-purple-600/20 border-purple-500/30 text-white"
                        : "border-transparent bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80"
                    )}
                  >
                    <span className="flex items-center gap-2.5 font-secondary text-[13px] font-medium">
                      <FolderOpen
                        className={clsx(
                          "w-3.5 h-3.5 shrink-0",
                          selectedFolder === f ? "text-purple-400" : "text-white/25"
                        )}
                      />
                      {f}
                    </span>
                    {selectedFolder === f && (
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* New folder */}
              <AnimatePresence>
                {showNewFolder ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="flex gap-2 mt-2"
                  >
                    <input
                      autoFocus
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder();
                        if (e.key === "Escape") {
                          setShowNewFolder(false);
                          setNewFolderName("");
                        }
                      }}
                      placeholder="Folder name..."
                      className="flex-1 h-9 px-3 rounded-full bg-white/[0.06] border border-white/[0.12] text-white text-[12px] font-secondary outline-none focus:border-purple-400/60 transition-colors placeholder:text-white/20"
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors shrink-0"
                    >
                      <Check className="w-3.5 h-3.5 text-white" />
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowNewFolder(true)}
                    className="flex items-center gap-2 mt-2 w-full px-4 py-2.5 rounded-[12px] border border-dashed border-white/[0.12] text-white/35 hover:text-white/60 hover:border-purple-400/30 transition-all font-secondary text-[13px]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New folder
                  </button>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 mt-2">
              <button
                onClick={handleSave}
                className="w-full h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-secondary font-bold text-[13px] hover:opacity-90 transition-opacity"
              >
                Save to "{selectedFolder}"
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookmarkFolderPickerModal;
