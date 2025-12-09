import { AppCardSkeleton } from "@/components/AppCardSkeleton";
import { AuthModal } from "@/components/AuthModal";
import { HeroSection } from "@/components/HeroSection";
import { Header } from "@/components/molecules";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import DummyView from "@/components/DummyView";
import clsx from "clsx";
import { Search, Zap } from "lucide-react";
import Filters from "./components/Filters";
import useController from "./useController";

const Index = () => {
  const {
    listComponent,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    showCompare,
    setShowCompare,
    selectedScreen,
    setSelectedScreen,
    showFavorites,
    setShowFavorites,
    scrolled,
    scrolledSearch,
    scrolledCategories,
    mobileMenuOpen,
    setMobileMenuOpen,
    isOpenAuth,
    setIsOpenAuth,
    isLoadingGetCategory,
    isLoadingGetApp,
    isDownloading,
    selectedApp,
    setSelectedApp,
    categories,
    user,
    compareApps,
    favoriteScreens,
    toggleFavorite,
    onCloseOpenAuth,
    filteredApps,
    allFilteredApps,
    loadMoreItems,
    hasMoreItems,
    getListCategoryFiltered,
    handleAddToCompare,
    handleRemoveFromCompare,
    handleLogout,
    gotoDetail,
    handleChangeCategory,
    handleOpenAuthModal,
    handleDownloadScreens,
    filterCategories,

    handleChangeFilterCategories,
    containerMainRef,
    scrolledFilterMenu,
  } = useController();
  return (
    <>
      <SEO
        title="Screenboard"
        description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
      />
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Header
            showSearch={true}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            scrolled={scrolled}
            scrolledSearch={scrolledSearch}
            onOpenAuthModal={() => setIsOpenAuth(true)}
            onShowCompare={() => setShowCompare(true)}
            transparentBg={true}
          />

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSection
              mainHeading="Collection of Favorite Component"
              subtitle="Explore thousands of carefully curated mobile applications. Comparefeatures, discover UI patterns, and find inspiration for your next project."
              labelBtn="Join to Unlock Everything"
              onClickBtn={handleOpenAuthModal}
            />
          </div>
        </section>
        {/* Main Content */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1140px]">
            <main className="px-4 py-6 md:px-0 md:py-8 lg:py-12 w-full">
              <div
                ref={containerMainRef}
                className="flex items-start gap-5 flex-col md:flex-row w-full"
              >
                {/* Static Filters - visible when not scrolled */}
                <div
                  className={clsx(
                    "min-w-[130px] max-w-[130px] max-h-[2000px] overflow-y-hidden transition-all duration-300 ease-in-out",
                    scrolledFilterMenu
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  )}
                >
                  <Filters
                    filterCategories={filterCategories}
                    handleChangeFilterCategories={handleChangeFilterCategories}
                  />
                </div>

                {/* Fixed Filters - visible when scrolled */}
                <div
                  className={clsx(
                    "min-w-[130px] max-w-[130px] fixed h-[90vh] overflow-y-auto top-24 z-50 pb-8 transition-all duration-300 ease-in-out",
                    scrolledFilterMenu
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  )}
                >
                  <Filters
                    filterCategories={filterCategories}
                    handleChangeFilterCategories={handleChangeFilterCategories}
                  />
                </div>
                <div className="w-full flex justify-end">
                  <div className="w-full max-w-[990px] flex items-start gap-5">
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                        {/* Search Bar - Desktop */}
                        <div
                          className={clsx(
                            "flex-1 w-full transition-all duration-300 ease-in-out overflow-hidden",
                            !scrolledSearch
                              ? "max-h-[100px] opacity-100 translate-y-0"
                              : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                          )}
                        >
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search component..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-full rounded-[6px]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full  flex items-start gap-5">
                        {/* Component */}
                        <DummyView />
                        {/* {isLoadingGetApp ? (
                          <div
                            className={clsx(
                              "w-full",
                              viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                                : "space-y-4 lg:space-y-6"
                            )}
                          >
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <AppCardSkeleton key={i} viewMode={viewMode} />
                            ))}
                          </div>
                        ) : filteredApps.length === 0 ? (
                          <div className="text-center w-full py-12 lg:py-20 min-h-[600px] flex flex-col items-center justify-center">
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Search className="h-10 w-10 lg:h-12 lg:w-12 text-slate-400" />
                            </div>
                            <h3 className="text-xl lg:text-2xl font-semibold text-slate-600 mb-2">
                              No component found
                            </h3>
                            <p className="text-slate-500">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        ) : (
                          <div className="w-full">
                            <InfiniteScrollList
                              apps={filteredApps}
                              viewMode={viewMode}
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
                              <div className="w-full -mt-64 pt-32 pb-8 bg-gradient-to-t from-white via-white/90 to-transparent">
                                <div className="flex flex-col w-full gap-6">
                                  <div className="flex justify-center items-center w-full">
                                    <div className="flex flex-col gap-3 items-center w-full md:w-[889px] px-4">
                                      <h5 className="font-['Inter'] font-semibold text-[32px] md:text-[64px] leading-[125%] text-center bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                        Join and get more inspiration from real
                                        product
                                      </h5>
                                      <p className="font-[Inter] font-normal text-[16px] md:text-[20px] text-[#464C4F] leading-[155%] text-center">
                                        We believe real design give more sense
                                        to your design process
                                      </p>
                                      <div
                                        onClick={() => setIsOpenAuth(true)}
                                        className="flex justify-center hover:cursor-pointer"
                                      >
                                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-8 py-3 text-sm font-[Inter] font-bold text-[17.6px] leading-[28px] text-center">
                                          <Zap className="h-4 w-4 mr-1" />
                                          Join to Unlock Everything
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        <AuthModal
          initialMode="login"
          isOpen={isOpenAuth}
          onClose={onCloseOpenAuth}
        />
      </div>
    </>
  );
};

export default Index;
