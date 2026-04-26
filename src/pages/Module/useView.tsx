import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/molecules";
import { Footer } from "@/components/molecules";
import SEO from "@/components/SEO";
import { motion, useInView } from "framer-motion";
import { Search, X, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useController from "./useController";
import { InfiniteScrollList } from "./components/InfiniteScrollList";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

function CountUpStatItem({ target, suffix = "", label, delay = 0 }: {
  target: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView || target === 0) return;
    const duration = 1400;
    let raf: number;
    let startTs: number | null = null;
    const timer = setTimeout(() => {
      const step = (ts: number) => {
        if (startTs === null) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isInView, target, delay]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-0.5">
      <span className="text-[22px] font-secondary font-extrabold text-white leading-none">
        {count}{suffix}
      </span>
      <span className="text-[12px] font-secondary text-white/40 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

const ModulePage = () => {
  const {
    user,
    searchTerm,
    handleChangeSearch,
    scrolled,
    setIsOpenAuth,
    callbackAuth,
    handleOpenAuthModal,
    onCloseOpenAuth,
    isOpenAuth,
    moduls,
    displayedModuls,
    isLoading,
    hasMoreItems,
    loadMoreItems,
  } = useController();

  const modulesRef = useRef<HTMLDivElement>(null);
  const [localSearch, setLocalSearch] = useState("");

  const handleScrollToModules = () => {
    if (!modulesRef.current) return;
    const yOffset = -80;
    const y = modulesRef.current.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const filteredModuls = localSearch
    ? moduls.filter((m) => m.name.toLowerCase().includes(localSearch.toLowerCase()))
    : displayedModuls;

  const resolvedHasMore = localSearch ? false : hasMoreItems;
  const resolvedLoadMore = localSearch ? () => {} : loadMoreItems;

  return (
    <>
      <SEO
        title="UI Modules & Design Patterns | UXBoard"
        description="Browse curated UI modules and design patterns from the world's best mobile apps. Find inspiration for onboarding, checkout, login, and more."
      />
      <div className="min-h-screen bg-[#0C0C0C]">
        {/* Header */}
        <Header
          showSearch={true}
          searchTerm={searchTerm}
          onSearchChange={handleChangeSearch}
          scrolled={scrolled}
          scrolledSearch={true}
          onOpenAuthModal={() => setIsOpenAuth(true)}
          transparentBg={false}
          callbackLogout={callbackAuth}
        />

        {/* ── DARK HERO ── */}
        <section className="relative pt-32 pb-24 px-4 md:px-0 overflow-hidden">
          {/* Ambient glows */}
          <div className="absolute top-0 left-1/4 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-[360px] h-[360px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

          <div className="relative flex w-full justify-center">
            <div className="w-full max-w-[1200px] flex flex-col items-center gap-8">

              {/* Eyebrow badge */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[12px] font-secondary font-medium text-white/70 tracking-wide">
                  Module Library — Organized UI Patterns
                </span>
              </motion.div>

              {/* Heading */}
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-[40px] md:text-[72px] font-secondary font-extrabold text-center leading-[1.05] text-white max-w-[860px]"
              >
                Design Patterns,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Organized
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-[18px] font-secondary font-normal text-white/50 text-center max-w-[560px] leading-[1.7]"
              >
                Patterns for Login, Onboarding, Cart, Checkout, and more —
                curated from the world's best apps.
              </motion.p>

              {/* CTA row */}
              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row items-center gap-4 w-full justify-center"
              >
                <motion.button
                  onClick={user ? handleScrollToModules : handleOpenAuthModal}
                  whileHover={{ scale: 1.04, boxShadow: "0px 12px 32px -4px rgba(99,102,241,0.55)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-secondary font-bold text-[16px] px-10 py-4 rounded-[20px] flex items-center justify-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4" />
                  {user ? "Explore Modules" : "Join Free"}
                </motion.button>

                {!user && (
                  <button
                    onClick={handleScrollToModules}
                    className="w-full md:w-auto text-white/60 font-secondary font-medium text-[16px] px-10 py-4 rounded-[20px] border border-white/10 hover:border-white/20 hover:text-white/80 transition-all"
                  >
                    Preview
                  </button>
                )}
              </motion.div>

              {/* Stats row */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-8 mt-4"
              >
                <CountUpStatItem target={moduls.length || 40} suffix="+" label="Modules" delay={0} />
                <CountUpStatItem target={1000} suffix="+" label="Screens" delay={120} />
                <CountUpStatItem target={20} suffix="+" label="Patterns" delay={240} />
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── WHITE CONTENT AREA ── */}
        <div className="bg-white rounded-t-[32px] min-h-screen">
          <div
            ref={modulesRef}
            className="w-full flex justify-center px-4 md:px-0 pt-10"
          >
            <div className="w-full max-w-[1200px]">

              {/* Section header */}
              <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    <span className="text-[11px] font-secondary font-semibold tracking-[0.14em] text-[#939393] uppercase">
                      Module Library
                    </span>
                  </div>
                  <h2 className="text-[28px] font-secondary font-extrabold text-[#0F0F0F]">
                    Browse by Module
                  </h2>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    placeholder="Search modules..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-[240px] h-[40px] pl-9 pr-8 rounded-[20px] border border-[#EBEBEB] bg-[#FAFAFA] font-secondary text-[13px] outline-none focus:border-purple-300 transition-colors"
                  />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={() => setLocalSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Module grid + unauthenticated gate */}
              <div className="relative pb-16">
                <InfiniteScrollList
                  moduls={filteredModuls}
                  hasMoreItems={resolvedHasMore}
                  loadMoreItems={resolvedLoadMore}
                  isLoading={isLoading}
                />

                {!user && (
                  <div className="absolute bottom-0 left-0 right-0 h-[560px] flex justify-center items-end pb-12 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none">
                    <div className="pointer-events-auto flex flex-col items-center gap-4 text-center max-w-[480px]">
                      <h5 className="font-secondary font-extrabold text-[32px] leading-tight bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Unlock 100+ curated apps
                      </h5>
                      <p className="font-secondary text-[15px] text-[#464C4F]">
                        Free membership — this month only.
                      </p>
                      <motion.button
                        onClick={handleOpenAuthModal}
                        whileHover={{ scale: 1.04, boxShadow: "0px 12px 32px -4px rgba(99,102,241,0.55)" }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 340, damping: 22 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-secondary font-bold text-[16px] px-10 py-4 rounded-[20px] flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Join Membership
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <AuthModal
          initialMode="login"
          isOpen={isOpenAuth}
          onClose={onCloseOpenAuth}
          callbackSuccessLogin={callbackAuth}
        />
      </div>
      <Footer />
    </>
  );
};

export default ModulePage;
