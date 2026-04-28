import { AuthModal } from "@/components/AuthModal";
import SEO from "@/components/SEO";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Footer, Header } from "@/components/molecules";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Layers,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useController from "./useController";
import { TModulApp, TModulAppScreen } from "@/api/user/modul/type";
import { getImageUrl } from "@/utils";
import { useBookmarks } from "@/hooks/useBookmarks";
import BookmarkPanel from "@/components/BookmarkPanel";
import CollectionsModal from "@/components/CollectionsModal";

/* ── Helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

/* ── Types ── */
type LightboxScreen = { name: string; image: string; id?: string };





/* ── ScreenLightbox ── */
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
  const { isBookmarked } = useBookmarks();

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
      {/* Nav arrows */}
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

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.3 }}
        className="relative flex flex-col bg-[#0f0f0f] border border-white/[0.09] rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{
          maxHeight: "92vh",
          width: saveOpen ? "820px" : "440px",
          maxWidth: "calc(100vw - 120px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0 border-b border-white/[0.07]">
          <span className="font-secondary text-[12px] text-white/30 tabular-nums">
            {idx + 1} / {screens.length}
          </span>
          <p className="font-secondary font-semibold text-[13px] text-white truncate max-w-[220px] text-center">
            {screen.name || appName}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSaveOpen((v) => !v)}
              className={clsx(
                "flex items-center gap-1.5 h-7 px-2.5 rounded-full border font-secondary text-[12px] font-semibold transition-all",
                isBookmarked(screen.id ?? "")
                  ? "bg-purple-600 border-purple-600 text-white"
                  : saveOpen
                  ? "bg-white/15 border-white/20 text-white"
                  : "border-white/15 text-white/50 hover:border-purple-400/50 hover:text-white/80"
              )}
            >
              <Bookmark className={clsx("w-3.5 h-3.5", isBookmarked(screen.id ?? "") && "fill-white")} />
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

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
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
                  boxShadow:
                    "0 24px 60px -8px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)",
                }}
                draggable={false}
              />
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {saveOpen && (
              <BookmarkPanel
                screenId={screen.id ?? ""}
                screenImage={screen.image}
                screenName={screen.name}
                appId={appId}
                appName={appName}
                onClose={() => setSaveOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Thumbnail strip */}
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
                  <img
                    src={s.image}
                    alt=""
                    className="w-full aspect-[9/19] object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── AppScreenSection ── */
interface AppScreenSectionProps {
  app: TModulApp;
  index: number;
  onOpenLightbox: (startIdx: number) => void;
  onGoToApp: () => void;
}

const AppScreenSection: React.FC<AppScreenSectionProps> = ({
  app,
  index,
  onOpenLightbox,
  onGoToApp,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-5"
    >
      {/* App header */}
      <div className="flex items-center gap-3">
        {/* Index badge */}
        <span className="shrink-0 w-8 h-8 rounded-full bg-[#F4F4F4] flex items-center justify-center font-secondary font-bold text-[12px] text-[#939393]">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* App icon */}
        <div className="w-11 h-11 rounded-[13px] overflow-hidden shrink-0 bg-[#F6F6F6] border border-[#F0F0F0]">
          <ImageWithFallback
            src={app.iconUrl}
            fallbackSrc="https://placehold.co/44"
            alt={app.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>

        {/* App info */}
        <div className="flex-1 min-w-0">
          <p className="font-secondary font-bold text-[15px] text-[#0F0F0F] truncate">
            {app.name}
          </p>
          <p className="font-secondary font-normal text-[12px] text-[#939393] truncate">
            {[app.company, app.category?.name].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* Screen count + View App button */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:flex items-center gap-1 h-7 px-3 rounded-full bg-[#F4F4F4] font-secondary text-[12px] text-[#939393]">
            <ImageIcon className="w-3 h-3" />
            {app.screens.length}
          </span>
          <button
            onClick={onGoToApp}
            className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#0F0F0F] text-white font-secondary text-[12px] font-semibold hover:bg-[#2a2a2a] transition-all"
          >
            View App
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Screen thumbnails — horizontal scroll */}
      <div className="flex items-start gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {app.screens.map((screen: TModulAppScreen, i: number) => (
          <motion.button
            key={screen._id}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 320, damping: 20 }}
            onClick={() => onOpenLightbox(i)}
            className="flex flex-col items-start gap-2 shrink-0 group"
          >
            <div className="w-[130px] md:w-[150px] rounded-[16px] overflow-hidden border border-[#F0F0F0] group-hover:border-purple-300 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition-all duration-300 relative">
              <ImageWithFallback
                src={getImageUrl(screen.image)}
                fallbackSrc="https://placehold.co/150x300"
                alt={screen.name || "Screen"}
                containerClassName="w-full"
                className="w-full aspect-[9/19.5] object-contain bg-[#F6F6F6] group-hover:scale-[1.03] transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-300 pointer-events-none" />
            </div>
            {screen.name && (
              <span className="w-[130px] md:w-[150px] text-[11px] font-secondary text-[#939393] group-hover:text-[#555] transition-colors truncate text-left px-0.5">
                {screen.name}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#F0F0F0]" />
    </motion.div>
  );
};

/* ── ModuleDetailPage ── */
const ModuleDetailPage: React.FC = () => {
  const {
    modulName,
    modulDescription,
    totalApps,
    apps,
    allModuls,
    id: currentModulId,
    isLoadingDetail,
    isOpenAuth,
    scrolled,
    user,
    onCloseOpenAuth,
    handleOpenAuthModal,
    navigate,
  } = useController();

  const otherModuls = useMemo(
    () => allModuls.filter((m) => m._id !== currentModulId).slice(0, 6),
    [allModuls, currentModulId]
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [appSearch, setAppSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showCollections, setShowCollections] = useState(false);

  /* Lazy-load state */
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* Lightbox state */
  const [lightboxList, setLightboxList] = useState<LightboxScreen[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [lightboxAppId, setLightboxAppId] = useState("");
  const [lightboxAppName, setLightboxAppName] = useState("");

  /* Derived data */
  const heroImageRaw = apps[0]?.screens?.[0]?.image;
  const heroImage = heroImageRaw ? getImageUrl(heroImageRaw) : null;

  const totalScreens = useMemo(
    () => apps.reduce((sum, app) => sum + app.screens.length, 0),
    [apps]
  );

  const categoryTabs = useMemo(() => {
    const seen = new Map<string, string>();
    apps.forEach((app) => {
      if (app.category?._id && !seen.has(app.category._id)) {
        seen.set(app.category._id, app.category.name);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [apps]);

  const displayedApps = useMemo(() => {
    let result = activeCategoryId
      ? apps.filter((a) => a.category?._id === activeCategoryId)
      : apps;
    const q = appSearch.trim().toLowerCase();
    if (q) result = result.filter((a) => a.name.toLowerCase().includes(q));
    return result;
  }, [apps, activeCategoryId, appSearch]);

  // Reset visible count when filter / search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategoryId, appSearch]);

  // IntersectionObserver sentinel — load more when bottom sentinel enters viewport
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, displayedApps.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [displayedApps.length]);

  const visibleApps = displayedApps.slice(0, visibleCount);
  const hasMore = visibleCount < displayedApps.length;

  const openLightbox = (app: TModulApp, startIdx: number) => {
    const screens: LightboxScreen[] = app.screens.map((s) => ({
      id: s._id,
      name: s.name || "",
      image: getImageUrl(s.image),
    }));
    setLightboxList(screens);
    setLightboxIdx(startIdx);
    setLightboxAppId(app._id);
    setLightboxAppName(app.name);
  };

  const closeLightbox = () => setLightboxIdx(null);

  /* Loading state */
  if (isLoadingDetail) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col">
        <div className="w-full h-[420px] animate-pulse bg-[#1a1a1a]" />
        <div className="bg-white flex-1 p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-11 h-11 rounded-[13px]" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="flex gap-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="shrink-0 w-[150px] h-[290px] rounded-[16px]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${modulName || "Module"} – UI Pattern & App Screens | UXBoard`}
        description={
          modulDescription
            ? `${modulDescription.slice(0, 155)}…`
            : `Explore ${modulName} UI pattern across ${totalApps} apps on UXBoard. See real-world screen examples and design inspiration.`
        }
        image={heroImage ?? undefined}
        type="article"
      />

      <div className="min-h-screen bg-[#0C0C0C]">
        {/* Header */}
        <Header
          scrolled={scrolled}
          onOpenAuthModal={handleOpenAuthModal}
          transparentBg={true}
          scrolledSearch={true}
          searchTerm={globalSearch}
          onSearchChange={setGlobalSearch}
          onSearchSubmit={(term) => {
            if (term.trim()) navigate(`/?q=${encodeURIComponent(term.trim())}`);
          }}
        />

        {/* ── CINEMATIC HERO ── */}
        <section className="relative w-full h-[420px] overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: "blur(24px) brightness(0.28) saturate(1.3)" }}
            />
          ) : (
            <>
              <div className="absolute top-0 left-1/4 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
              <div className="absolute top-10 right-1/4 w-[360px] h-[360px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

          {/* Back button */}
          <div className="absolute top-[88px] left-0 right-0 flex justify-center px-4 md:px-0 z-10">
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

          {/* Hero content */}
          <div className="relative h-full flex items-end pb-12 justify-center px-4 md:px-0">
            <div className="w-full max-w-[1200px]">
              <div className="flex flex-col gap-3">
                {/* Eyebrow */}
                <motion.div
                  {...fadeUp(0.08)}
                  className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                  <span className="text-[11px] font-secondary font-semibold tracking-[0.12em] text-white/50 uppercase">
                    UI Module
                  </span>
                </motion.div>

                {/* Module name */}
                <motion.h1
                  {...fadeUp(0.15)}
                  className="text-[36px] md:text-[54px] font-secondary font-extrabold text-white leading-[1.0]"
                >
                  {modulName}
                </motion.h1>

                {/* Meta */}
                <motion.div
                  {...fadeUp(0.22)}
                  className="flex items-center gap-4 flex-wrap"
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-secondary text-white/50">
                    <ImageIcon className="w-3.5 h-3.5" />
                    {totalApps} App{totalApps !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] font-secondary text-white/50">
                    <Layers className="w-3.5 h-3.5" />
                    {totalScreens} Screens
                  </span>
                  {categoryTabs.length > 0 && (
                    <span className="text-[11px] font-secondary font-semibold px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/60">
                      {categoryTabs.length} {categoryTabs.length !== 1 ? "Categories" : "Category"}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div className="w-full bg-[#111] border-b border-white/10">
          <div className="w-full flex justify-center px-4 md:px-0">
            <div className="w-full max-w-[1200px] flex items-center gap-8 py-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-white/40" />
                <span className="font-secondary text-[13px] text-white/40 font-medium">
                  <span className="text-white font-bold">{totalApps}</span> Apps
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white/40" />
                <span className="font-secondary text-[13px] text-white/40 font-medium">
                  <span className="text-white font-bold">{totalScreens}</span> Screens
                </span>
              </div>
              {modulDescription && (
                <p
                  title={modulDescription}
                  className="ml-auto font-secondary text-[13px] text-white/35 hidden md:block max-w-[400px] truncate cursor-default"
                >
                  {modulDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        {modulDescription && (
          <div className="w-full bg-[#111] border-b border-white/[0.06]">
            <div className="w-full flex justify-center px-4 md:px-0">
              <div className="w-full max-w-[1200px] py-5">
                <div className="max-w-[720px]">
                  <p
                    className={clsx(
                      "font-secondary text-[14px] text-white/50 leading-[1.75] transition-all",
                      modulDescription.length > 200 && !showFullDesc && "line-clamp-2"
                    )}
                  >
                    {modulDescription}
                  </p>
                  {modulDescription.length > 200 && (
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

        {/* ── WHITE CONTENT AREA ── */}
        <div className="bg-white rounded-t-[32px] min-h-screen">
          {/* Sticky category tabs + search */}
          {(categoryTabs.length > 0 || apps.length > 0) && (
            <div className="sticky top-[80px] z-30 bg-white border-b border-[#F0F0F0] shadow-sm">
              <div className="w-full flex justify-center px-4 md:px-0">
                <div className="w-full max-w-[1200px] flex items-center">
                  {/* Tabs */}
                  <div className="flex items-center gap-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] flex-1 min-w-0">
                    {/* All tab */}
                    <button
                      onClick={() => setActiveCategoryId(null)}
                      className={clsx(
                        "relative flex items-center gap-2 px-5 py-4 font-secondary text-[13px] font-semibold whitespace-nowrap transition-colors shrink-0",
                        !activeCategoryId ? "text-[#0F0F0F]" : "text-[#939393] hover:text-[#555]"
                      )}
                    >
                      All
                      <span
                        className={clsx(
                          "text-[11px] px-1.5 py-0.5 rounded-full font-secondary font-bold",
                          !activeCategoryId ? "bg-[#0F0F0F] text-white" : "bg-[#F0F0F0] text-[#939393]"
                        )}
                      >
                        {apps.length}
                      </span>
                      {!activeCategoryId && (
                        <motion.div
                          layoutId="module-detail-tab"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F0F0F] rounded-full"
                        />
                      )}
                    </button>

                    {categoryTabs.map((cat) => {
                      const count = apps.filter((a) => a.category?._id === cat.id).length;
                      const isActive = activeCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategoryId(cat.id)}
                          className={clsx(
                            "relative flex items-center gap-2 px-5 py-4 font-secondary text-[13px] font-semibold whitespace-nowrap transition-colors shrink-0",
                            isActive ? "text-[#0F0F0F]" : "text-[#939393] hover:text-[#555]"
                          )}
                        >
                          {cat.name}
                          <span
                            className={clsx(
                              "text-[11px] px-1.5 py-0.5 rounded-full font-secondary font-bold",
                              isActive ? "bg-[#0F0F0F] text-white" : "bg-[#F0F0F0] text-[#939393]"
                            )}
                          >
                            {count}
                          </span>
                          {isActive && (
                            <motion.div
                              layoutId="module-detail-tab"
                              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0F0F0F] rounded-full"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search + Collections */}
                  <div className="shrink-0 flex items-center gap-2 pl-4 pr-3 py-2 border-l border-[#F0F0F0]">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C0C0C0] pointer-events-none" />
                      <input
                        placeholder="Search apps..."
                        value={appSearch}
                        onChange={(e) => setAppSearch(e.target.value)}
                        className="w-[160px] h-[34px] pl-8 pr-7 rounded-full border border-[#EBEBEB] bg-[#F8F8F8] text-[12px] font-secondary placeholder:text-[#C0C0C0] outline-none focus:border-purple-300 transition-colors"
                      />
                      {appSearch && (
                        <button
                          onClick={() => setAppSearch("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#C0C0C0] hover:text-[#555] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setShowCollections(true)}
                      className="shrink-0 flex items-center gap-1.5 h-[34px] px-3.5 rounded-full bg-[#0F0F0F] text-white font-secondary text-[12px] font-semibold hover:bg-[#2a2a2a] transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span className="hidden lg:block">Collections</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App list */}
          <div className="w-full flex justify-center px-4 md:px-0 py-10">
            <div className="w-full max-w-[1200px] flex flex-col gap-10">
              {displayedApps.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Search className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="font-secondary font-semibold text-[18px] text-slate-600">
                    No apps found
                  </p>
                  <p className="font-secondary text-[14px] text-slate-400 mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              )}

              {visibleApps.map((app, appIdx) => (
                <AppScreenSection
                  key={app._id}
                  app={app}
                  index={appIdx}
                  onOpenLightbox={(startIdx) => openLightbox(app, startIdx)}
                  onGoToApp={() => navigate(`/app/${app._id}`)}
                />
              ))}

              {/* Sentinel — triggers next batch via IntersectionObserver */}
              <div ref={sentinelRef} className="w-full h-1 pointer-events-none" />

              {/* Loading skeletons while more items incoming */}
              {hasMore && (
                <div className="flex flex-col gap-10">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="w-11 h-11 rounded-[13px]" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                      </div>
                      <div className="flex gap-3 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <Skeleton key={j} className="shrink-0 w-[150px] h-[290px] rounded-[16px]" />
                        ))}
                      </div>
                      <div className="w-full h-px bg-[#F0F0F0]" />
                    </div>
                  ))}
                </div>
              )}

              {/* End-of-list indicator */}
              {!hasMore && displayedApps.length > PAGE_SIZE && (
                <div className="flex items-center justify-center py-6 gap-3">
                  <div className="h-px flex-1 bg-[#F0F0F0]" />
                  <span className="font-secondary text-[12px] text-[#C0C0C0] shrink-0">
                    {displayedApps.length} apps loaded
                  </span>
                  <div className="h-px flex-1 bg-[#F0F0F0]" />
                </div>
              )}
            </div>
          </div>

          {/* ── CTA — unauthenticated gate ── */}
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mx-4 md:mx-auto w-full max-w-[1200px] mb-10"
            >
              <div className="relative overflow-hidden rounded-[28px] bg-[#0C0C0C] px-8 py-12 md:py-16 flex flex-col items-center gap-6 text-center">
                {/* Ambient glows */}
                <div className="absolute top-0 left-1/4 w-[360px] h-[360px] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
                <div className="absolute top-0 right-1/4 w-[280px] h-[280px] rounded-full bg-purple-600/20 blur-[80px] pointer-events-none" />

                <div className="relative flex flex-col items-center gap-5">
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-[12px] font-secondary font-medium text-white/70 tracking-wide">
                      Free Membership — This Month Only
                    </span>
                  </div>

                  <h3 className="text-[28px] md:text-[40px] font-secondary font-extrabold leading-tight bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent max-w-[560px]">
                    Unlock Every Pattern &amp; App Screen
                  </h3>

                  <p className="font-secondary text-[15px] text-white/50 max-w-[440px] leading-[1.7]">
                    Join UXBoard to browse the full {modulName} pattern and 100+ curated apps — no credit card needed.
                  </p>

                  <motion.button
                    onClick={handleOpenAuthModal}
                    whileHover={{ scale: 1.04, boxShadow: "0px 12px 32px -4px rgba(99,102,241,0.55)" }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 22 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-secondary font-bold text-[16px] px-10 py-4 rounded-[20px] flex items-center gap-2.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Join Free
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Other Modules ── */}
          {otherModuls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center px-4 md:px-0 pb-16"
            >
              <div className="w-full max-w-[1200px]">
                {/* Section header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                      <span className="text-[11px] font-secondary font-semibold tracking-[0.14em] text-[#939393] uppercase">
                        More Patterns
                      </span>
                    </div>
                    <h2 className="text-[22px] font-secondary font-extrabold text-[#0F0F0F]">
                      Explore Other Modules
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/module")}
                    className="hidden md:flex items-center gap-1.5 h-8 px-4 rounded-full border border-[#EBEBEB] bg-[#FAFAFA] font-secondary text-[12px] font-semibold text-[#555] hover:border-purple-300 hover:text-purple-600 transition-all"
                  >
                    View all
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Module cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {otherModuls.map((modul, i) => (
                    <motion.button
                      key={modul._id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ y: -5, boxShadow: "0px 16px 40px -8px rgba(0,0,0,0.10)" }}
                      onClick={() => navigate(`/module/${modul._id}`)}
                      className="group relative flex flex-col items-start gap-3 p-4 rounded-[18px] bg-white border border-[#EBEBEB] hover:border-transparent transition-all text-left overflow-hidden"
                    >
                      {/* Gradient top bar */}
                      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[18px]" />

                      {/* Icon */}
                      <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4 text-white" />
                      </div>

                      {/* Name */}
                      <p className="font-secondary font-bold text-[13px] text-[#0F0F0F] leading-[1.35] line-clamp-2">
                        {modul.name}
                      </p>

                      {/* Arrow */}
                      <ArrowRight className="w-3.5 h-3.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
                    </motion.button>
                  ))}
                </div>

                {/* Mobile see all */}
                <div className="mt-5 flex md:hidden justify-center">
                  <button
                    onClick={() => navigate("/module")}
                    className="flex items-center gap-1.5 h-9 px-5 rounded-full border border-[#EBEBEB] font-secondary text-[13px] font-semibold text-[#555] hover:border-purple-300 hover:text-purple-600 transition-all"
                  >
                    View all modules
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <CollectionsModal
          isOpen={showCollections}
          onClose={() => setShowCollections(false)}
        />

        <AuthModal
          initialMode="login"
          isOpen={isOpenAuth}
          onClose={onCloseOpenAuth}
        />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <ScreenLightbox
            screens={lightboxList}
            initialIndex={lightboxIdx}
            onClose={closeLightbox}
            appId={lightboxAppId}
            appName={lightboxAppName}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default ModuleDetailPage;
