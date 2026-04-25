import { AuthModal } from "@/components/AuthModal";
import SEO from "@/components/SEO";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Footer, Header } from "@/components/molecules";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderPlus,
  GitMerge,
  Globe,
  GitCompare,
  ImageIcon,
  LayoutGrid,
  Layers,
  MessageSquare,
  Plus,
  Search,
  Star,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useController from "@/pages/AppDetailV2/useController";
import { isValidUrl } from "@/utils";

/* ─── tiny helpers ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

/* ─── Shared type ─── */
type LightboxScreen = { name: string; image: string; id?: string };

/* ─────────────────────────────────────────
   SCREEN LIGHTBOX — full-screen horizontal slider
──────────────────────────────────────────── */
function ScreenLightbox({
  screens,
  initialIndex,
  onClose,
  appId,
  appName,
}: {
  screens: LightboxScreen[];
  initialIndex: number;
  onClose: () => void;
  appId: string;
  appName: string;
}) {
  const [idx, setIdx] = useState(initialIndex);
  const [saveOpen, setSaveOpen] = useState(false);
  const slideDir = useRef(0);
  const thumbRef = useRef<HTMLDivElement>(null);
  const { isSaved } = useScreenSaves(appId);

  const go = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= screens.length || newIdx === idx) return;
    slideDir.current = newIdx > idx ? 1 : -1;
    setIdx(newIdx);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(idx - 1);
      else if (e.key === "ArrowRight") go(idx + 1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [idx, onClose]);

  useEffect(() => {
    const el = thumbRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [idx]);

  const screen = screens[idx];
  if (!screen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Nav arrows — outside the card ── */}
      <button
        onClick={() => go(idx - 1)}
        disabled={idx === 0}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 shrink-0 w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center disabled:opacity-20 hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => go(idx + 1)}
        disabled={idx === screens.length - 1}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 shrink-0 w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center disabled:opacity-20 hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* ── Modal card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
        className="relative flex flex-col bg-[#0f0f0f] border border-white/[0.09] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ maxHeight: "92vh", width: saveOpen ? "820px" : "440px", maxWidth: "calc(100vw - 120px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0 border-b border-white/[0.07]">
          <span className="font-secondary text-[12px] text-white/30 tabular-nums">
            {idx + 1} / {screens.length}
          </span>
          <p className="font-secondary font-semibold text-[13px] text-white truncate max-w-[220px] text-center">
            {screen.name}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaveOpen((v) => !v)}
              className={clsx(
                "flex items-center gap-1.5 h-7 px-2.5 rounded-full border font-secondary text-[12px] font-semibold transition-all",
                isSaved(screen.image)
                  ? "bg-purple-600 border-purple-600 text-white"
                  : saveOpen
                  ? "bg-white/15 border-white/20 text-white"
                  : "border-white/15 text-white/50 hover:border-purple-400/50 hover:text-white/80"
              )}
            >
              <Bookmark className={clsx("w-3.5 h-3.5", isSaved(screen.image) && "fill-white")} />
              Save
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <X className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* ── Body: image + optional save panel ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Image */}
          <div className="flex-1 flex items-center justify-center p-6 min-h-0">
            <AnimatePresence mode="wait" custom={slideDir.current}>
              <motion.img
                key={idx}
                custom={slideDir.current}
                variants={{
                  enter: (d: number) => ({ x: d * 60, opacity: 0, scale: 0.97 }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ x: d * -60, opacity: 0, scale: 0.97 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                src={screen.image}
                alt={screen.name}
                className="w-auto rounded-[20px] object-contain select-none"
                style={{
                  maxHeight: "calc(92vh - 140px)",
                  maxWidth: "100%",
                  boxShadow: "0 24px 60px -8px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)",
                }}
                draggable={false}
              />
            </AnimatePresence>
          </div>

          {/* Save panel */}
          <AnimatePresence>
            {saveOpen && (
              <SavePanel
                screen={screen}
                appId={appId}
                appName={appName}
                onClose={() => setSaveOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Thumbnail strip ── */}
        {screens.length > 1 && (
          <div className="shrink-0 px-5 pb-4 pt-2 border-t border-white/[0.06]">
            <div
              ref={thumbRef}
              className={clsx(
                "flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]",
                screens.length <= 8 ? "justify-center" : "justify-start"
              )}
            >
              {screens.map((s, i) => (
                <button
                  key={(s.id ?? s.name) + i}
                  onClick={() => go(i)}
                  className={clsx(
                    "shrink-0 w-[30px] rounded-[6px] overflow-hidden border-2 transition-all duration-200",
                    i === idx
                      ? "border-purple-400 opacity-100 scale-110"
                      : "border-transparent opacity-30 hover:opacity-60"
                  )}
                >
                  <img src={s.image} alt="" className="w-full aspect-[9/19] object-cover" draggable={false} />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SAVE / ANNOTATE — localStorage-based bookmarks
──────────────────────────────────────────── */
type SavedScreen = {
  image: string;
  name: string;
  appId: string;
  appName: string;
  folder: string;
  note: string;
  tags: string[];
  savedAt: number;
};

const SAVES_KEY = "uxboard:saved_screens";

function useScreenSaves(appId: string) {
  const load = (): SavedScreen[] => {
    try { return JSON.parse(localStorage.getItem(SAVES_KEY) ?? "[]"); } catch { return []; }
  };
  const [saves, setSaves] = useState<SavedScreen[]>(load);

  const persist = (next: SavedScreen[]) => {
    setSaves(next);
    localStorage.setItem(SAVES_KEY, JSON.stringify(next));
  };

  const isSaved = useCallback(
    (image: string) => saves.some((s) => s.image === image && s.appId === appId),
    [saves, appId]
  );

  const getSave = useCallback(
    (image: string) => saves.find((s) => s.image === image && s.appId === appId) ?? null,
    [saves, appId]
  );

  const save = useCallback(
    (screen: LightboxScreen, appName: string, folder: string, note: string, tags: string[]) => {
      const existing = saves.findIndex((s) => s.image === screen.image && s.appId === appId);
      const entry: SavedScreen = {
        image: screen.image,
        name: screen.name,
        appId,
        appName,
        folder: folder || "Saved",
        note,
        tags,
        savedAt: Date.now(),
      };
      if (existing >= 0) {
        const next = [...saves];
        next[existing] = entry;
        persist(next);
      } else {
        persist([...saves, entry]);
      }
    },
    [saves, appId]
  );

  const remove = useCallback(
    (image: string) => persist(saves.filter((s) => !(s.image === image && s.appId === appId))),
    [saves, appId]
  );

  const folders = useMemo(
    () => Array.from(new Set(saves.map((s) => s.folder))).sort(),
    [saves]
  );

  return { saves, isSaved, getSave, save, remove, folders };
}

/* SavePanel — shown inside the Lightbox overlay */
function SavePanel({
  screen,
  appId,
  appName,
  onClose,
}: {
  screen: LightboxScreen;
  appId: string;
  appName: string;
  onClose: () => void;
}) {
  const { isSaved, getSave, save, remove, folders } = useScreenSaves(appId);
  const existing = getSave(screen.image);
  const [folder, setFolder] = useState(existing?.folder ?? "Saved");
  const [note, setNote] = useState(existing?.note ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [showFolderNew, setShowFolderNew] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const saved = isSaved(screen.image);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags((p) => [...p, t]);
    setTagInput("");
  };

  const handleSave = () => {
    save(screen, appName, folder, note, tags);
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
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-purple-400" />
          <span className="font-secondary font-semibold text-[14px] text-white">
            {saved ? "Saved" : "Save Screen"}
          </span>
        </div>
        {saved && (
          <button
            onClick={() => { remove(screen.image); onClose(); }}
            className="flex items-center gap-1 text-[11px] font-secondary text-red-400/60 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Remove
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {/* Folder */}
        <div className="flex flex-col gap-2">
          <label className="font-secondary text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em]">
            Folder
          </label>
          <div className="flex flex-wrap gap-2">
            {["Saved", ...folders.filter((f) => f !== "Saved")].map((f) => (
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
              className="h-7 px-2.5 rounded-full border border-dashed border-white/20 text-white/30 hover:border-purple-400/40 hover:text-white/60 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {showFolderNew && (
            <div className="flex gap-2 mt-1">
              <input
                autoFocus
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newFolder.trim()) {
                    setFolder(newFolder.trim());
                    setShowFolderNew(false);
                    setNewFolder("");
                  }
                }}
                placeholder="New folder name..."
                className="flex-1 h-8 px-3 rounded-full bg-white/5 border border-white/15 text-white text-[12px] font-secondary outline-none focus:border-purple-400 transition-colors placeholder:text-white/20"
              />
              <button
                onClick={() => {
                  if (newFolder.trim()) { setFolder(newFolder.trim()); setShowFolderNew(false); setNewFolder(""); }
                }}
                className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center hover:bg-purple-500 transition-colors"
              >
                <Check className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="flex flex-col gap-2">
          <label className="font-secondary text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em] flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Add your insight or annotation here..."
            className="w-full px-3 py-2.5 rounded-[12px] bg-white/5 border border-white/10 text-white text-[13px] font-secondary leading-[1.6] placeholder:text-white/20 outline-none focus:border-purple-400/50 resize-none transition-colors"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <label className="font-secondary text-[11px] font-semibold text-white/40 uppercase tracking-[0.1em] flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            Tags
          </label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-purple-500/15 border border-purple-400/20 text-purple-300 text-[11px] font-secondary font-medium"
                >
                  #{t}
                  <button onClick={() => setTags((p) => p.filter((x) => x !== t))} className="opacity-50 hover:opacity-100 transition-opacity">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag, press Enter..."
              className="flex-1 h-8 px-3 rounded-full bg-white/5 border border-white/15 text-white text-[12px] font-secondary outline-none focus:border-purple-400 transition-colors placeholder:text-white/20"
            />
            <button
              onClick={addTag}
              className="h-8 w-8 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/16 transition-colors border border-white/10"
            >
              <Plus className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="shrink-0 px-5 py-4 border-t border-white/[0.07]">
        <button
          onClick={handleSave}
          className="w-full h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-secondary font-bold text-[13px] hover:opacity-90 transition-opacity"
        >
          {saved ? "Update Save" : "Save Screen"}
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FLOW VIEW — per-category journey visualization
──────────────────────────────────────────── */
function FlowView({
  groupedScreens,
  activeTab,
  onScreenClick,
}: {
  groupedScreens: Record<string, LightboxScreen[]>;
  activeTab: string;
  onScreenClick: (screens: LightboxScreen[], idx: number) => void;
}) {
  const screens = groupedScreens[activeTab] ?? [];

  if (screens.length === 0) {
    return (
      <div className="text-center py-20 text-[#C0C0C0] font-secondary text-[14px]">
        No screens in this flow.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-0">
      {screens.map((screen, i) => (
        <motion.div
          key={screen.name + i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={clsx(
            "flex items-start gap-6 py-5",
            i < screens.length - 1 && "border-b border-[#F4F4F4]"
          )}
        >
          {/* Step connector column */}
          <div className="flex flex-col items-center gap-0 shrink-0 pt-1">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-secondary font-bold text-[11px] shadow-sm z-10">
              {i + 1}
            </div>
            {i < screens.length - 1 && (
              <div className="w-px flex-1 min-h-[60px] mt-1" style={{
                background: "repeating-linear-gradient(to bottom, #d8b4fe 0px, #d8b4fe 4px, transparent 4px, transparent 10px)"
              }} />
            )}
          </div>

          {/* Screen thumbnail */}
          <button
            onClick={() => onScreenClick(screens, i)}
            className="shrink-0 w-[72px] rounded-[12px] overflow-hidden border border-[#EBEBEB] hover:border-purple-300 hover:shadow-md transition-all group"
          >
            <img
              src={screen.image}
              alt={screen.name}
              className="w-full aspect-[9/19] object-cover bg-[#F6F6F6] group-hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* Content */}
          <div className="flex-1 pt-1 min-w-0">
            <p className="font-secondary font-semibold text-[14px] text-[#0F0F0F] truncate">
              {screen.name}
            </p>
            <p className="font-secondary text-[12px] text-[#939393] mt-0.5">
              {activeTab} · Step {i + 1} of {screens.length}
            </p>

            {/* Visual state hints */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {i === 0 && (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-green-100 border border-green-200 text-green-700 text-[10px] font-secondary font-semibold">
                  Entry Point
                </span>
              )}
              {i === screens.length - 1 && (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-secondary font-semibold">
                  End State
                </span>
              )}
              {/* Edge case detection by name */}
              {/error|fail|empty|oops|not found|404/i.test(screen.name) && (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-secondary font-semibold">
                  Edge Case
                </span>
              )}
              {/success|confirm|done|complete|congrat/i.test(screen.name) && (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-secondary font-semibold">
                  Success State
                </span>
              )}
              {/loading|skeleton|shimmer/i.test(screen.name) && (
                <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-secondary font-semibold">
                  Loading State
                </span>
              )}
            </div>
          </div>

          {/* Quick view button */}
          <button
            onClick={() => onScreenClick(screens, i)}
            className="shrink-0 h-8 px-3 rounded-full border border-[#EBEBEB] bg-white text-[12px] font-secondary font-medium text-[#555] hover:border-purple-300 hover:text-purple-600 transition-all mt-1"
          >
            View
          </button>
        </motion.div>
      ))}
    </div>
  );
}

const AppDetailV2: React.FC = () => {
  const {
    app,
    isLoadingDetail,
    selectedScreen,
    compareApps,
    listApp,
    isOpenAuth,
    scrolled,
    user,
    groupedScreensFilter,
    getListCategoryFiltered,
    setSelectedScreen,
    setIsOpenAuth,
    toggleLike,
    handleScreenChange,
    onCloseOpenAuth,
    handleOpenAuthModal,
    handleAddCompare,
    navigate,
  } = useController();

  const filmstripRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [filmPage, setFilmPage] = useState(0);
  const [navSearch, setNavSearch] = useState("");
  const [screenSearch, setScreenSearch] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);

  /* ── lightbox ── */
  const [lightboxList, setLightboxList] = useState<LightboxScreen[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showSavePanel, setShowSavePanel] = useState(false);

  /* ── screen compare mode ── */
  const [showCompareView, setShowCompareView] = useState(false);
  const [compareLeftTab, setCompareLeftTab] = useState<string | null>(null);
  const [compareRightTab, setCompareRightTab] = useState<string | null>(null);

  /* ── view mode (grid | flow) ── */
  const [browseMode, setBrowseMode] = useState<"grid" | "flow">("grid");

  /* ── save/annotate hook ── */
  const { isSaved, saves } = useScreenSaves(app?.id ?? "");

  /* ─── derived data ─── */
  const allScreens = useMemo(() => app?.screens ?? [], [app]);
  const screenCount = allScreens.length;

  const tabs = useMemo(
    () => Object.keys(groupedScreensFilter ?? {}),
    [groupedScreensFilter]
  );

  /* initialise compare columns when the overlay opens */
  useEffect(() => {
    if (showCompareView && tabs.length > 0) {
      setCompareLeftTab((prev) => prev ?? tabs[0]);
      setCompareRightTab((prev) => prev ?? (tabs[1] ?? tabs[0]));
    }
  }, [showCompareView, tabs]);

  const activeTabScreens = useMemo(() => {
    const key = activeTab ?? tabs[0];
    return key ? (groupedScreensFilter?.[key] ?? []) : [];
  }, [activeTab, tabs, groupedScreensFilter]);

  /* when searching, flatten ALL screens across all tabs so "Splash" is findable regardless of active tab */
  const allGroupedScreens = useMemo(() => {
    if (!groupedScreensFilter) return [];
    return Object.values(groupedScreensFilter).flat();
  }, [groupedScreensFilter]);

  const filteredScreens = useMemo(() => {
    const q = screenSearch.trim().toLowerCase();
    if (!q) return activeTabScreens;
    return allGroupedScreens.filter((s) => s.name.toLowerCase().includes(q));
  }, [activeTabScreens, allGroupedScreens, screenSearch]);

  const selectedGroupScreens = useMemo(() => {
    if (!selectedScreen || !groupedScreensFilter) return [];
    const cat = selectedScreen.category?.name ?? "Uncategorized";
    return groupedScreensFilter[cat] ?? [];
  }, [selectedScreen, groupedScreensFilter]);

  /* filmstrip paging — 6 per page */
  const FILM_PER_PAGE = 6;
  const filmPages = Math.ceil(screenCount / FILM_PER_PAGE);
  const visibleFilm = allScreens.slice(
    filmPage * FILM_PER_PAGE,
    filmPage * FILM_PER_PAGE + FILM_PER_PAGE
  );

  const similarApps = useMemo(() => {
    if (!app || !listApp.length) return [];
    const byCat = listApp.filter(
      (a) =>
        a.id !== app.id &&
        (a.category?._id === app.category?._id ||
          a.category?.name === app.category?.name)
    );
    return (byCat.length >= 4 ? byCat : listApp.filter((a) => a.id !== app.id)).slice(0, 8);
  }, [app, listApp]);

  const heroImage =
    app?.screens?.[0]?.image ?? app?.image ?? "https://placehold.co/1200x600";

  const openLightbox = (list: LightboxScreen[], startIdx: number) => {
    setLightboxList(list);
    setLightboxIdx(startIdx);
  };
  const closeLightbox = () => setLightboxIdx(null);

  /* ─── loading ─── */
  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
        <div className="w-full h-[480px] animate-pulse bg-[#1a1a1a]" />
        <div className="bg-white flex-1 p-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <div className="grid grid-cols-4 gap-4 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="font-secondary font-bold text-2xl text-slate-700">
            App not found
          </p>
          <Link to="/" className="text-purple-600 font-secondary text-sm mt-2 block">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${app.name} – UI Screens | UXBoard`}
        description={
          app.description
            ? `${app.description.slice(0, 155)}…`
            : `Explore ${app.name} app screens and design patterns on UXBoard.`
        }
        image={heroImage}
        type="article"
      />

      {/* ── FIXED HEADER ── */}
      <Header
        scrolled={scrolled}
        onOpenAuthModal={handleOpenAuthModal}
        transparentBg={true}
        scrolledSearch={true}
        searchTerm={navSearch}
        onSearchChange={setNavSearch}
        onSearchSubmit={(term) => {
          if (term.trim()) navigate(`/?q=${encodeURIComponent(term.trim())}`);
        }}
        availableApps={listApp}
        categories={getListCategoryFiltered}
      />

      {/* ─────────────────────────────────────────
          CINEMATIC HERO
          blurred first screenshot as backdrop,
          dark gradient overlay, app info centered
      ──────────────────────────────────────────── */}
      <section className="relative w-full h-[520px] overflow-hidden">
        {/* Blurred backdrop */}
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{ filter: "blur(24px) brightness(0.35) saturate(1.4)" }}
        />
        {/* top-to-bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

        {/* back link */}
        <div className="absolute top-[88px] left-0 right-0 flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[1200px]">
            <button
              onClick={() => navigate(-1 as any)}
              className="flex items-center gap-1.5 text-[13px] font-secondary text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>

        {/* Hero content — centered */}
        <div className="relative h-full flex items-end pb-12 justify-center px-4 md:px-0">
          <div className="w-full max-w-[1200px] flex items-end justify-between gap-6">
            <div className="flex items-end gap-6">
              {/* App icon */}
              <motion.div
                {...fadeUp(0.1)}
                className="w-20 h-20 md:w-28 md:h-28 rounded-[22px] overflow-hidden shrink-0 shadow-2xl ring-2 ring-white/20"
              >
                <ImageWithFallback
                  src={app.image ?? "https://placehold.co/400"}
                  fallbackSrc="https://placehold.co/400"
                  alt={app.name}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <div className="flex flex-col gap-2 mb-1">
                {/* Featured badge */}
                {app.featured && (
                  <motion.div {...fadeUp(0.08)}>
                    <span className="inline-flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-secondary font-semibold px-2.5 py-0.5 rounded-full">
                      <Star className="w-3 h-3" />
                      Featured
                    </span>
                  </motion.div>
                )}

                {/* App name */}
                <motion.h1
                  {...fadeUp(0.15)}
                  className="text-[36px] md:text-[52px] font-secondary font-extrabold text-white leading-[1.0]"
                >
                  {app.name}
                </motion.h1>

                {/* Meta row */}
                <motion.div
                  {...fadeUp(0.22)}
                  className="flex items-center gap-4 flex-wrap"
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-secondary text-white/60">
                    <Building2 className="w-3.5 h-3.5" />
                    {app.company}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] font-secondary text-white/60">
                    <CalendarDays className="w-3.5 h-3.5" />
                    {new Date(app.lastUpdated).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {app.category?.name && (
                    <span className="text-[11px] font-secondary font-semibold px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70">
                      {app.category.name}
                    </span>
                  )}
                  {app.platform && (
                    <span className="text-[11px] font-secondary font-semibold px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/70">
                      {app.platform}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* CTA buttons — right side */}
            <motion.div
              {...fadeUp(0.28)}
              className="hidden md:flex items-center gap-2 mb-1 shrink-0"
            >
              <button
                onClick={toggleLike}
                className={clsx(
                  "flex items-center gap-2 h-10 px-4 rounded-[20px] border font-secondary text-[13px] font-semibold transition-all",
                  app.isLiked
                    ? "bg-purple-600 border-purple-600 text-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                )}
              >
                {app.isLiked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {app.isLiked ? "Saved" : "Save"}
              </button>
              {user && (
                <button
                  onClick={handleAddCompare}
                  className="flex items-center gap-2 h-10 px-4 rounded-[20px] border border-white/20 bg-white/10 text-white font-secondary text-[13px] font-semibold hover:bg-white/15 transition-all"
                >
                  <GitCompare className="w-4 h-4" />
                  Compare
                </button>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────
          STATS STRIP
      ──────────────────────────────────────────── */}
      <div className="w-full bg-[#111] border-b border-white/10">
        <div className="w-full flex justify-center px-4 md:px-0">
          <div className="w-full max-w-[1200px] flex items-center gap-8 py-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-white/40" />
              <span className="font-secondary text-[13px] text-white/40 font-medium">
                <span className="text-white font-bold">{screenCount}</span>{" "}
                Screens
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-white/40" />
              <span className="font-secondary text-[13px] text-white/40 font-medium">
                <span className="text-white font-bold">{tabs.length}</span>{" "}
                Categories
              </span>
            </div>
            {app.description && (
              <p
                title={app.description}
                className="ml-auto font-secondary text-[13px] text-white/35 hidden md:block max-w-[360px] truncate cursor-default"
              >
                {app.description}
              </p>
            )}
            {/* External links */}
            <div className="flex items-center gap-2 ml-auto md:ml-0 shrink-0">
              {isValidUrl(app.linkPlayStore) && (
                <a
                  href={app.linkPlayStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/8 border border-white/15 text-white/60 hover:text-white text-[12px] font-secondary transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  Play Store
                </a>
              )}
              {isValidUrl(app.linkAppStore) && (
                <a
                  href={app.linkAppStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/8 border border-white/15 text-white/60 hover:text-white text-[12px] font-secondary transition-all"
                >
                  <ExternalLink className="w-3 h-3" />
                  App Store
                </a>
              )}
              {isValidUrl(app.linkWebsite) && (
                <a
                  href={app.linkWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/8 border border-white/15 text-white/60 hover:text-white text-[12px] font-secondary transition-all"
                >
                  <Globe className="w-3 h-3" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── About / Description ─── */}
      {app.description && (
        <div className="w-full bg-[#111] border-b border-white/[0.06]">
          <div className="w-full flex justify-center px-4 md:px-0">
            <div className="w-full max-w-[1200px] py-5">
              <div className="max-w-[720px]">
                <p
                  className={clsx(
                    "font-secondary text-[14px] text-white/50 leading-[1.75] transition-all",
                    app.description.length > 200 && !showFullDesc && "line-clamp-2"
                  )}
                >
                  {app.description}
                </p>
                {app.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDesc((v) => !v)}
                    className="mt-2 font-secondary text-[12px] font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {showFullDesc ? "Show less ↑" : "Read more ↓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          FILMSTRIP — scrollable preview of ALL screens
      ──────────────────────────────────────────── */}
      {screenCount > 0 && (
        <div className="w-full bg-[#111] py-6">
          <div className="w-full flex justify-center px-4 md:px-0">
            <div className="w-full max-w-[1200px] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-secondary text-[12px] font-semibold tracking-[0.12em] uppercase text-white/30">
                  All Screens
                </span>
                {filmPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setFilmPage((p) => Math.max(0, p - 1))
                      }
                      disabled={filmPage === 0}
                      className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-white/60 flex items-center justify-center disabled:opacity-30 hover:bg-white/15 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-secondary text-[12px] text-white/30">
                      {filmPage + 1} / {filmPages}
                    </span>
                    <button
                      onClick={() =>
                        setFilmPage((p) => Math.min(filmPages - 1, p + 1))
                      }
                      disabled={filmPage === filmPages - 1}
                      className="w-7 h-7 rounded-full bg-white/10 border border-white/15 text-white/60 flex items-center justify-center disabled:opacity-30 hover:bg-white/15 transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={filmPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(visibleFilm.length, 6)}, 1fr)`,
                  }}
                >
                  {visibleFilm.map((screen, i) => (
                    <button
                      key={screen.name + i}
                      onClick={() => openLightbox(allScreens as LightboxScreen[], filmPage * FILM_PER_PAGE + i)}
                      className="relative group rounded-[12px] overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all"
                    >
                      <ImageWithFallback
                        src={screen.image}
                        fallbackSrc="https://placehold.co/300x600"
                        alt={screen.name}
                        containerClassName="w-full"
                        className="w-full aspect-[9/19] object-contain bg-[#1a1a1a] group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end p-2">
                        <span className="text-white text-[10px] font-secondary truncate">
                          {screen.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          WHITE CONTENT AREA — tabs + grid
      ──────────────────────────────────────────── */}
      <div className="bg-white min-h-[60vh]">
        {/* Sticky tab bar */}
        {tabs.length > 0 && (
          <div className="sticky top-[80px] z-30 bg-white border-b border-[#F0F0F0] shadow-sm">
            <div className="w-full flex justify-center px-4 md:px-0">
              <div className="w-full max-w-[1200px] flex items-center">
                <div className="flex items-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] flex-1 min-w-0">
                  {tabs.map((tab) => {
                    const count = groupedScreensFilter?.[tab]?.length ?? 0;
                    const isActive = (activeTab ?? tabs[0]) === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => { setActiveTab(tab); setScreenSearch(""); }}
                        className={clsx(
                          "relative flex items-center gap-2 px-5 py-4 font-secondary text-[13px] font-semibold whitespace-nowrap transition-colors shrink-0",
                          isActive
                            ? "text-[#0F0F0F]"
                            : "text-[#939393] hover:text-[#555]"
                        )}
                      >
                        {tab}
                        <span
                          className={clsx(
                            "text-[11px] px-1.5 py-0.5 rounded-full font-secondary font-bold",
                            isActive
                              ? "bg-[#0F0F0F] text-white"
                              : "bg-[#F0F0F0] text-[#939393]"
                          )}
                        >
                          {count}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="tab-indicator"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F0F0F] rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* View mode + Compare + Search */}
                <div className="shrink-0 flex items-center gap-2 pl-4 pr-1 py-2 border-l border-[#F0F0F0]">
                  {/* Grid / Flow toggle */}
                  <div className="flex items-center h-8 rounded-full border border-[#E8E8E8] bg-[#F8F8F8] overflow-hidden">
                    <button
                      onClick={() => setBrowseMode("grid")}
                      className={clsx(
                        "flex items-center gap-1.5 h-full px-3 font-secondary text-[12px] font-semibold transition-all whitespace-nowrap",
                        browseMode === "grid"
                          ? "bg-[#0F0F0F] text-white"
                          : "text-[#939393] hover:text-[#555]"
                      )}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Grid
                    </button>
                    <button
                      onClick={() => setBrowseMode("flow")}
                      className={clsx(
                        "flex items-center gap-1.5 h-full px-3 font-secondary text-[12px] font-semibold transition-all whitespace-nowrap",
                        browseMode === "flow"
                          ? "bg-[#0F0F0F] text-white"
                          : "text-[#939393] hover:text-[#555]"
                      )}
                    >
                      <GitMerge className="w-3.5 h-3.5" />
                      Flow
                    </button>
                  </div>
                  {user && (
                    <button
                      onClick={() => setShowCompareView(true)}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#E8E8E8] bg-[#F8F8F8] text-[#939393] font-secondary text-[12px] font-semibold hover:border-purple-300 hover:text-purple-600 transition-all whitespace-nowrap"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      Compare
                    </button>
                  )}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C0C0C0] pointer-events-none" />
                    <input
                      placeholder="Search screens..."
                      value={screenSearch}
                      onChange={(e) => setScreenSearch(e.target.value)}
                      className="w-[160px] h-[34px] pl-8 pr-7 rounded-full border border-[#EBEBEB] bg-[#F8F8F8] text-[12px] font-secondary placeholder:text-[#C0C0C0] outline-none focus:border-purple-300 transition-colors"
                    />
                    {screenSearch && (
                      <button
                        onClick={() => setScreenSearch("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#C0C0C0] hover:text-[#555] transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen content — Grid or Flow */}
        <div className="w-full flex justify-center px-4 md:px-0 py-10">
          <div className="w-full max-w-[1200px]">
            <AnimatePresence mode="wait">

              {/* ── FLOW MODE ── */}
              {browseMode === "flow" && !screenSearch && groupedScreensFilter && (
                <motion.div
                  key={"flow-" + (activeTab ?? tabs[0])}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Flow header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F0F0F0]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                      <GitMerge className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="font-secondary font-bold text-[15px] text-[#0F0F0F]">
                        {activeTab ?? tabs[0]} Journey
                      </p>
                      <p className="font-secondary text-[12px] text-[#939393]">
                        {(groupedScreensFilter[activeTab ?? tabs[0]] ?? []).length} steps in this flow
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-green-100 border border-green-200 text-green-700 text-[10px] font-secondary font-semibold">Entry</span>
                      <span className="font-secondary text-[10px] text-[#C0C0C0]">→</span>
                      <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-secondary font-semibold">End</span>
                    </div>
                  </div>

                  <FlowView
                    groupedScreens={groupedScreensFilter as Record<string, LightboxScreen[]>}
                    activeTab={activeTab ?? tabs[0]}
                    onScreenClick={(list, idx2) => openLightbox(list, idx2)}
                  />
                </motion.div>
              )}

              {/* ── GRID MODE  ── */}
              {(browseMode === "grid" || screenSearch) && (
              <motion.div
                key={(activeTab ?? tabs[0]) + "-grid"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
              >
                {filteredScreens.length === 0 && screenSearch && (
                  <div className="col-span-full text-center py-16 text-[#C0C0C0] font-secondary text-[14px]">
                    No screens match &ldquo;{screenSearch}&rdquo;
                  </div>
                )}
                {filteredScreens.map((screen, i) => {
                  const screenIsSaved = isSaved(screen.image);
                  return (
                  <motion.button
                    key={screen.name + i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: i * 0.04,
                      duration: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -4 }}
                    onClick={() => openLightbox(filteredScreens as LightboxScreen[], i)}
                    className="flex flex-col gap-2 items-start group"
                  >
                    <div className="w-full rounded-[16px] overflow-hidden border border-[#F0F0F0] group-hover:border-purple-300 group-hover:shadow-md transition-all duration-300 relative">
                      <ImageWithFallback
                        src={screen.image}
                        fallbackSrc="https://placehold.co/300x600"
                        alt={screen.name}
                        containerClassName="w-full"
                        className="w-full aspect-[9/19.5] object-contain bg-[#F6F6F6] group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      {screenIsSaved && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shadow-sm">
                          <Bookmark className="w-2.5 h-2.5 text-white fill-white" />
                        </div>
                      )}
                    </div>
                    <span
                      className="text-[11px] font-secondary text-[#939393] group-hover:text-[#555] transition-colors w-full text-left truncate px-0.5"
                    >
                      {screen.name}
                    </span>
                  </motion.button>
                  );
                })}
              </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Similar Apps ── */}
        {similarApps.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-[#F6F6F6] py-14"
          >
            <div className="w-full flex justify-center px-4 md:px-0">
              <div className="w-full max-w-[1200px] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                      <span className="text-[11px] font-secondary font-semibold tracking-[0.14em] text-[#939393] uppercase">
                        Similar Apps
                      </span>
                    </div>
                    <h2 className="text-[24px] font-secondary font-extrabold text-[#0F0F0F]">
                      You might also like
                    </h2>
                  </div>
                  {user && (
                    <Link
                      to="/"
                      className="flex items-center gap-1 text-[13px] font-secondary font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      See all
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {user ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {similarApps.map((sa, i) => (
                      <motion.div
                        key={sa.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.06,
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileHover={{ y: -4, boxShadow: "0px 12px 28px -6px rgba(0,0,0,0.12)" }}
                      >
                        <Link
                          to={`/app-v2/${sa.id}`}
                          className="flex flex-col gap-3 bg-white rounded-[20px] p-4 h-full border border-transparent hover:border-slate-100 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={sa.image ?? "https://placehold.co/400"}
                              fallbackSrc="https://placehold.co/400"
                              alt={sa.name}
                              containerClassName="w-10 h-10 shrink-0"
                              className="w-10 h-10 rounded-[10px] object-contain"
                            />
                            <div className="min-w-0">
                              <p className="font-secondary font-bold text-[14px] text-[#0F0F0F] truncate">
                                {sa.name}
                              </p>
                              <p className="font-secondary text-[12px] text-[#939393] truncate">
                                {sa.category?.name ?? ""}
                              </p>
                            </div>
                          </div>
                          {sa.screens?.[0]?.image && (
                            <ImageWithFallback
                              src={sa.screens[0].image}
                              fallbackSrc="https://placehold.co/400"
                              alt={sa.name}
                              containerClassName="w-full"
                              className="w-full aspect-[9/19] rounded-[12px] object-contain bg-[#F6F6F6]"
                            />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  /* Locked gate for unauthenticated users */
                  <div className="relative rounded-[24px] overflow-hidden">
                    {/* Blurred preview grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 select-none pointer-events-none">
                      {similarApps.slice(0, 4).map((sa) => (
                        <div
                          key={sa.id}
                          className="flex flex-col gap-3 bg-white rounded-[20px] p-4 border border-transparent blur-[3px] opacity-70"
                        >
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={sa.image ?? "https://placehold.co/400"}
                              fallbackSrc="https://placehold.co/400"
                              alt={sa.name}
                              containerClassName="w-10 h-10 shrink-0"
                              className="w-10 h-10 rounded-[10px] object-contain"
                            />
                            <div className="min-w-0">
                              <p className="font-secondary font-bold text-[14px] text-[#0F0F0F] truncate">{sa.name}</p>
                              <p className="font-secondary text-[12px] text-[#939393] truncate">{sa.category?.name ?? ""}</p>
                            </div>
                          </div>
                          {sa.screens?.[0]?.image && (
                            <ImageWithFallback
                              src={sa.screens[0].image}
                              fallbackSrc="https://placehold.co/400"
                              alt={sa.name}
                              containerClassName="w-full"
                              className="w-full aspect-[9/19] rounded-[12px] object-contain bg-[#F6F6F6]"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Overlay CTA */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#F6F6F6]/60 to-[#F6F6F6]/95 backdrop-blur-[2px] px-4 gap-5">
                      <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M14 9V6a4 4 0 0 0-8 0v3" stroke="#7C3AED" strokeWidth="1.6" strokeLinecap="round" />
                          <rect x="3" y="9" width="14" height="10" rx="2.5" fill="#7C3AED" fillOpacity="0.12" stroke="#7C3AED" strokeWidth="1.4" />
                          <circle cx="10" cy="14" r="1.25" fill="#7C3AED" />
                        </svg>
                      </div>
                      <div className="text-center max-w-[360px]">
                        <p className="font-secondary font-extrabold text-[20px] text-[#0F0F0F] leading-snug">
                          Discover {similarApps.length}+ similar apps
                        </p>
                        <p className="font-secondary text-[13px] text-[#888] mt-1.5 leading-relaxed">
                          Sign in for free to explore apps in the same category, compare flows, and get inspired.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenAuthModal}
                        className="flex items-center gap-2 h-11 px-7 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-secondary font-bold text-[13px] shadow-lg shadow-purple-200 hover:scale-[1.03] hover:shadow-purple-300 transition-all duration-200"
                      >
                        Sign in — it&apos;s free
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ── CTA Subscribe ── */}
        <div className="w-full bg-gradient-to-br from-[#0F0F0F] via-[#1a0a2e] to-[#0d0d1a] py-20 px-4 md:px-0">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-[680px] flex flex-col items-center text-center gap-6">
              <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-400/25 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-secondary text-[11px] font-semibold tracking-[0.14em] uppercase text-purple-300">
                  Unlock Everything
                </span>
              </div>
              <h2 className="font-secondary font-extrabold text-[34px] md:text-[48px] text-white leading-[1.1]">
                Design smarter,
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ship faster.
                </span>
              </h2>
              <p className="font-secondary text-[15px] text-white/50 leading-[1.75] max-w-[500px]">
                Get unlimited access to every screen, every app, and every category — plus download in bulk, compare flows, and stay ahead of design trends.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                <button
                  onClick={handleOpenAuthModal}
                  className="flex items-center gap-2 h-12 px-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-secondary font-bold text-[14px] shadow-lg shadow-purple-900/40 hover:shadow-purple-700/50 hover:scale-[1.03] transition-all duration-200"
                >
                  Start for free
                </button>
                <Link
                  to="/pricing"
                  className="flex items-center gap-1.5 h-12 px-6 rounded-full border border-white/15 text-white/60 font-secondary text-[14px] hover:border-white/30 hover:text-white transition-all"
                >
                  See plans
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="font-secondary text-[12px] text-white/25">
                No credit card required &middot; Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* ── Compare overlay: 2-column scrollable large images ── */}
      <AnimatePresence>
        {showCompareView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-[#0C0C0C] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/20 flex items-center justify-center shrink-0">
                  <GitCompare className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="font-secondary font-bold text-[15px] text-white">Compare</span>
                <span className="font-secondary text-[13px] text-white/30">— {app?.name}</span>
              </div>
              <button
                onClick={() => setShowCompareView(false)}
                className="w-8 h-8 rounded-full bg-white/[0.07] flex items-center justify-center hover:bg-white/[0.14] transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Two columns */}
            <div className="flex flex-1 overflow-hidden divide-x divide-white/[0.07]">
              {[
                { tab: compareLeftTab, setTab: setCompareLeftTab, label: "Left" },
                { tab: compareRightTab, setTab: setCompareRightTab, label: "Right" },
              ].map(({ tab, setTab }, colIdx) => {
                const activeCol = tab ?? tabs[colIdx] ?? tabs[0];
                const colScreens: LightboxScreen[] =
                  (groupedScreensFilter as Record<string, LightboxScreen[]>)?.[activeCol] ??
                  (filteredScreens as LightboxScreen[]);
                return (
                  <div key={colIdx} className="flex-1 flex flex-col min-w-0">
                    {/* Module picker */}
                    <div
                      className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] overflow-x-auto shrink-0"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {tabs.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTab(t)}
                          className={clsx(
                            "px-3 py-1 rounded-full text-[11px] font-secondary font-semibold whitespace-nowrap transition-colors",
                            activeCol === t
                              ? "bg-purple-600 text-white"
                              : "bg-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.10]"
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable screens */}
                    <div
                      className="flex-1 overflow-y-auto px-4 py-5 space-y-3"
                      style={{ scrollbarWidth: "none" }}
                    >
                      <p className="font-secondary text-[11px] text-white/25 mb-2">
                        {colScreens.length} screen{colScreens.length !== 1 ? "s" : ""}
                      </p>
                      {colScreens.map((screen, si) => (
                        <div key={screen.image + si} className="w-full flex flex-col gap-1.5">
                          <ImageWithFallback
                            src={screen.image}
                            fallbackSrc="https://placehold.co/300x600"
                            alt={screen.name}
                            containerClassName="w-full"
                            className="w-full rounded-[14px] object-contain bg-[#1a1a1a]"
                          />
                          <p className="font-secondary text-[11px] text-white/35 truncate px-0.5">
                            {screen.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Screen lightbox (horizontal slider) ── */}
      <AnimatePresence>
        {lightboxIdx !== null && lightboxList.length > 0 && (
          <ScreenLightbox
            screens={lightboxList}
            initialIndex={lightboxIdx}
            onClose={closeLightbox}
            appId={app?.id ?? ""}
            appName={app?.name ?? ""}
          />
        )}
      </AnimatePresence>

      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={onCloseOpenAuth}
      />

      <Footer />
    </>
  );
};

export default AppDetailV2;
