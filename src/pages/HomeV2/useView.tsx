import { AuthModal } from "@/components/AuthModal";
import { Header } from "@/components/molecules";
import SEO from "@/components/SEO";
import { AppCard } from "@/components/AppCard";
import { AppCardSkeleton } from "@/components/AppCardSkeleton";
import { motion, useInView } from "framer-motion";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import useController from "@/pages/Home/useController";
import { InfiniteScrollList } from "@/pages/Home/components/InfiniteScrollList";
import Filters from "@/pages/Home/components/Filters";
import { Top10Apps } from "@/components/molecules/Top10Apps";
import { Footer } from "@/components/molecules";

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
    if (!isInView) return;
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

const HomeV2 = () => {
  const {
    listApp,
    searchTerm,
    handleChangeSearch,
    viewMode,
    setViewMode,
    selectedScreen,
    setSelectedScreen,
    scrolled,
    scrolledSearch,
    isOpenAuth,
    setIsOpenAuth,
    isLoadingGetApp,
    selectedApp,
    setSelectedApp,
    user,
    compareApps,
    onCloseOpenAuth,
    filteredApps,
    allFilteredApps,
    loadMoreItems,
    hasMoreItems,
    handleLike,
    handleAddToCompare,
    gotoDetail,
    handleOpenAuthModal,
    filterCategories,
    filterSubCategories,
    filterSortBy,
    filterMarket,
    handleChangeFilterSortBy,
    handleChangeFilterCategories,
    handleChangeFilterSubCategories,
    handleChangeFilterMarket,
    getOptionsCategoryItemFiltered,
    getOptionsSubCategoryItemFiltered,
    getOptionsMarketItemFiltered,
    callbackAuth,
    getListCategoryFiltered,
    searchTermHeader,
    handleChangeSearchHeader,
    showFilters,
    setShowFilters,
    isLoadingGetCategory,
    scrolledFilterMenu,
    containerMainRef,
    appsContainerRef,
    top10Apps,
    isLoadingTop10,
  } = useController();

  const heroRef = useRef<HTMLDivElement>(null);

  const handleScrollToApps = () => {
    if (!appsContainerRef.current) return;
    const yOffset = -80;
    const y =
      appsContainerRef.current.getBoundingClientRect().top +
      window.scrollY +
      yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const activeFiltersCount = [
    filterCategories.value && !filterCategories.value.includes("All"),
    filterSubCategories.value && !filterSubCategories.value.includes("All"),
    filterSortBy.value && filterSortBy.value !== "Recent",
    filterMarket.value && !filterMarket.value.includes("All"),
  ].filter(Boolean).length;

  return (
    <>
      <SEO
        title="UXBoard – Explore & Discover Mobile App UI Screenshots"
        description="Browse 1,000+ real mobile app screenshots from 100+ curated apps across 20+ categories. Find UI inspiration, compare flows, and level up your mobile product design."
        keywords="mobile app design, UI screenshots, app UI inspiration, mobile UX patterns, iOS app design, Android app design, UX research, mobile interface design, app screens"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "UXBoard",
            "url": "https://uxboard.art",
            "description": "Discover inspiring mobile app UI screenshots and design patterns.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://uxboard.art/home-v2?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "UXBoard",
            "url": "https://uxboard.art",
            "logo": {
              "@type": "ImageObject",
              "url": "https://uxboard.art/assets/images/logo.png"
            },
            "description": "UXBoard is a design research platform for discovering mobile app UI patterns and screenshots."
          }
        ]}
      />
      <div className="min-h-screen bg-[#0C0C0C]">
        {/* Header */}
        <Header
          showSearch={true}
          searchTerm={searchTermHeader}
          onSearchChange={handleChangeSearchHeader}
          scrolled={scrolled}
          scrolledSearch={true}
          onOpenAuthModal={() => setIsOpenAuth(true)}
          transparentBg={false}
          callbackLogout={callbackAuth}
          availableApps={listApp}
          categories={getListCategoryFiltered}
        />

        {/* ── DARK HERO ── */}
        <section
          ref={heroRef}
          className="relative pt-32 pb-24 px-4 md:px-0 overflow-hidden"
        >
          {/* ambient glows */}
          <div className="absolute top-0 left-1/4 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
          <div className="absolute top-10 right-1/4 w-[360px] h-[360px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

          <div className="relative flex w-full justify-center">
            <div className="w-full max-w-[1200px] flex flex-col items-center gap-8">
              {/* eyebrow badge */}
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[12px] font-secondary font-medium text-white/70 tracking-wide">
                  UXBoard 2.0 — New Experience
                </span>
              </motion.div>

              {/* heading */}
              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-[40px] md:text-[72px] font-secondary font-extrabold text-center leading-[1.05] text-white max-w-[860px]"
              >
                Design Research,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Reimagined
                </span>
              </motion.h1>

              {/* subtitle */}
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-[18px] font-secondary font-normal text-white/50 text-center max-w-[560px] leading-[1.7]"
              >
                Browse hundreds of real app screenshots, organized by module.
                Find patterns. Get inspired. Ship better.
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
                  onClick={user ? handleScrollToApps : handleOpenAuthModal}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0px 12px 32px -4px rgba(99,102,241,0.55)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22 }}
                  className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-secondary font-bold text-[16px] px-10 py-4 rounded-[20px] flex items-center justify-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4" />
                  {user ? "Explore Apps" : "Join Free"}
                </motion.button>

                {!user && (
                  <button
                    onClick={handleScrollToApps}
                    className="w-full md:w-auto text-white/60 font-secondary font-medium text-[16px] px-10 py-4 rounded-[20px] border border-white/10 hover:border-white/20 hover:text-white/80 transition-all"
                  >
                    Preview
                  </button>
                )}
              </motion.div>

              {/* stats row */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-8 mt-4"
              >
                <CountUpStatItem target={100} suffix="+" label="Apps" delay={0} />
                <CountUpStatItem target={1000} suffix="+" label="Screens" delay={120} />
                <CountUpStatItem target={20} suffix="+" label="Categories" delay={240} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── TOP 10 APPS ── */}
        {(isLoadingTop10 || top10Apps.length > 0) && (
          <Top10Apps apps={top10Apps} isLoading={isLoadingTop10} />
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="bg-white rounded-t-[32px] min-h-screen">
          <div
            ref={appsContainerRef}
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
                      App Library
                    </span>
                  </div>
                  <h2 className="text-[28px] font-secondary font-extrabold text-[#0F0F0F]">
                    All Applications
                  </h2>
                </div>

                {user && (
                  <div className="flex items-center gap-3">
                    {/* Search bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        placeholder="Search apps..."
                        value={searchTerm}
                        onChange={(e) => handleChangeSearch(e.target.value)}
                        className="w-[240px] h-[40px] pl-9 pr-8 rounded-[20px] border border-[#EBEBEB] bg-[#FAFAFA] font-secondary text-[13px] outline-none focus:border-purple-300 focus:ring-0 transition-colors"
                      />
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => handleChangeSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter toggle chip */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={clsx(
                        "flex items-center gap-2 h-[40px] px-4 rounded-[20px] border font-secondary text-[13px] font-medium transition-all",
                        activeFiltersCount > 0
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-[#EBEBEB] bg-[#FAFAFA] text-[#323638] hover:border-slate-300"
                      )}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <span className="w-4.5 h-4.5 flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-bold px-1">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>

              <div className="flex items-start gap-6 pb-16">
                {/* Sidebar filters - visible when toggled */}
                {user && showFilters && (
                  <motion.aside
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                    className="hidden md:block w-[220px] shrink-0"
                  >
                    <Filters
                      getOptionsCategoryItemFiltered={getOptionsCategoryItemFiltered}
                      filterCategories={filterCategories}
                      filterSubCategories={filterSubCategories}
                      filterSortBy={filterSortBy}
                      filterMarket={filterMarket}
                      handleChangeFilterSortBy={handleChangeFilterSortBy}
                      handleChangeFilterCategories={handleChangeFilterCategories}
                      handleChangeFilterSubCategories={handleChangeFilterSubCategories}
                      handleChangeFilterMarket={handleChangeFilterMarket}
                      getOptionsSubCategoryItemFiltered={getOptionsSubCategoryItemFiltered}
                      getOptionsMarketItemFiltered={getOptionsMarketItemFiltered}
                    />
                  </motion.aside>
                )}

                {/* Grid */}
                <div className="flex-1 min-w-0">
                  {isLoadingGetApp ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <AppCardSkeleton key={i} viewMode="grid" />
                      ))}
                    </div>
                  ) : filteredApps.length === 0 ? (
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
                  ) : (
                    <div className="relative">
                      <InfiniteScrollList
                        apps={filteredApps}
                        viewMode="grid"
                        onLike={handleLike}
                        onAppClick={setSelectedApp}
                        onDetail={gotoDetail}
                        onAddToCompare={handleAddToCompare}
                        compareApps={compareApps}
                        setSelectedScreen={setSelectedScreen}
                        hasMoreItems={hasMoreItems}
                        loadMoreItems={loadMoreItems}
                        isLoading={isLoadingGetApp}
                      />
                      {!user && allFilteredApps.length > 9 && (
                        <div className="absolute bottom-0 left-0 right-0 h-[600px] flex justify-center items-end pb-12 bg-gradient-to-t from-white via-white/90 to-transparent">
                          <div className="flex flex-col items-center gap-4 text-center max-w-[480px]">
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
                  )}
                </div>
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

export default HomeV2;
