import { AppCard } from "@/components/AppCard";
import { AppCardSkeleton } from "@/components/AppCardSkeleton";
import { AuthModal } from "@/components/AuthModal";
import { CompareModal } from "@/components/CompareModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { HeroSection } from "@/components/HeroSection";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import clsx from "clsx";
import { Grid, Heart, List, Search, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Filters from "./components/Filters";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import useController from "./useController";
import { Header } from "@/components/molecules";
import { Input } from "@/components/ui/input";

const Index = () => {
  const {
    listApp,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedCountries,
    setSelectedCountries,
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
    handleLike,
    handleAddToCompare,
    handleRemoveFromCompare,
    handleLogout,
    gotoDetail,
    handleChangeCategory,
    handleOpenAuthModal,
    handleDownloadScreens,
    filterCategories,
    filterSubCategories,
    filterSortBy,
    filterMarket,
    handleChangeFilterSortBy,
    handleChangeFilterCategories,
    handleChangeFilterSubCategories,
    handleChangeFilterMarket,
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
              mainHeading="Study Real UI Patterns from Real Apps"
              subtitle="Analyze hundreds of design examples. Register now to unlock complete app screens and learn from the best."
              labelBtn="Join to Unlock Everything"
              onClickBtn={handleOpenAuthModal}
            />
          </div>
        </section>
        {/* Main Content */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1140px]">
            <main className="px-4 py-6 md:px-0 md:py-8 lg:py-12 w-full">
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                  {/* Search Bar - Desktop */}
                  <div
                    className={clsx(
                      "flex-1 max-w-md transition-all duration-300 ease-in-out overflow-hidden",
                      !scrolledSearch
                        ? "max-h-[100px] opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                    )}
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search apps..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-full rounded-[6px]"
                      />
                    </div>
                  </div>

                  {/* Filters and View Controls */}
                  <div className="flex flex-row md:flex-col sm:flex-row gap-4 lg:gap-6">
                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="flex-1 sm:flex-none"
                      >
                        <Grid className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                        <span className="sm:hidden lg:inline">Grid</span>
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1 sm:flex-none"
                      >
                        <List className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                        <span className="sm:hidden lg:inline">List</span>
                      </Button>
                    </div>
                    {/* Download Button */}
                    {/* {selectedCategory && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadScreens}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                    )}
                    <span className="sm:hidden lg:inline">
                      {isDownloading ? "Downloading..." : "Download"}
                    </span>
                  </Button>
                )} */}
                  </div>
                </div>
              </div>

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
                    filterSubCategories={filterSubCategories}
                    filterSortBy={filterSortBy}
                    filterMarket={filterMarket}
                    handleChangeFilterSortBy={handleChangeFilterSortBy}
                    handleChangeFilterCategories={handleChangeFilterCategories}
                    handleChangeFilterSubCategories={
                      handleChangeFilterSubCategories
                    }
                    handleChangeFilterMarket={handleChangeFilterMarket}
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
                    filterSubCategories={filterSubCategories}
                    filterSortBy={filterSortBy}
                    filterMarket={filterMarket}
                    handleChangeFilterSortBy={handleChangeFilterSortBy}
                    handleChangeFilterCategories={handleChangeFilterCategories}
                    handleChangeFilterSubCategories={
                      handleChangeFilterSubCategories
                    }
                    handleChangeFilterMarket={handleChangeFilterMarket}
                  />
                </div>
                <div className="w-full flex justify-end">
                  <div className="w-full max-w-[990px] flex items-start gap-5">
                    {/* Apps Grid/List */}
                    {isLoadingGetApp ? (
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
                          No apps found
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
                                    We believe real design give more sense to
                                    your design process
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
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Modals */}
        <CompareModal
          isOpen={showCompare}
          setShowCompare={setShowCompare}
          onClose={() => setShowCompare(false)}
          apps={compareApps}
          onRemoveApp={handleRemoveFromCompare}
          onAddApp={handleAddToCompare}
          availableApps={listApp}
          categories={getListCategoryFiltered}
        />

        <AuthModal
          initialMode="login"
          isOpen={isOpenAuth}
          onClose={onCloseOpenAuth}
        />

        <FavoritesModal
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
          favoriteScreens={favoriteScreens}
          onRemoveFavorite={toggleFavorite}
          onScreenClick={setSelectedScreen}
        />

        {/* ScreenPublic Detail Modal */}
        {selectedScreen && (
          <Dialog
            open={!!selectedScreen}
            onOpenChange={() => setSelectedScreen(null)}
          >
            <DialogContent className="max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-lg lg:text-xl">
                  {selectedScreen.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-[9/16] rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={selectedScreen.image}
                    alt={selectedScreen.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  {/* <Badge variant="outline">{selectedScreen.category}</Badge> */}
                  <p className="text-sm text-slate-600">
                    {selectedScreen.description}
                  </p>
                  <p className="text-xs text-slate-500">
                    From: {selectedScreen.appName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(selectedScreen)}
                    className="flex-1"
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        favoriteScreens.some(
                          (fav) => fav.id === selectedScreen.id
                        )
                          ? "fill-red-500 text-red-500"
                          : "text-slate-400"
                      }`}
                    />
                    {favoriteScreens.some((fav) => fav.id === selectedScreen.id)
                      ? "Remove"
                      : "Add to"}{" "}
                    Favorites
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default Index;
