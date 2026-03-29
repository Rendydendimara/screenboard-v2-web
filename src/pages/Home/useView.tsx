import { AppCardSkeleton } from "@/components/AppCardSkeleton";
import { AuthModal } from "@/components/AuthModal";
import { CompareMaxModal } from "@/components/CompareMaxModal";
import { CompareModal } from "@/components/CompareModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { HeroSection } from "@/components/HeroSection";
import { Header } from "@/components/molecules";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import { Filter, Grid, List, Search, X, Zap } from "lucide-react";
import { useMemo } from "react";
import Filters from "./components/Filters";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import useController from "./useController";
import { Top10Apps } from "@/components/molecules/Top10Apps";

const Index = () => {
  const {
    listApp,
    searchTerm,
    handleChangeSearch,
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
    showCompareMaxModal,
    setShowCompareMaxModal,
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
    getListData,
    appsContainerRef,
    getOptionsCategoryItemFiltered,
    callbackAuth,
    getOptionsSubCategoryItemFiltered,
    getOptionsMarketItemFiltered,
  } = useController();

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCategories.value && !filterCategories.value.includes("All"))
      count++;
    if (filterSubCategories.value && !filterSubCategories.value.includes("All"))
      count++;
    if (filterSortBy.value && filterSortBy.value !== "Recent") count++;
    if (filterMarket.value && !filterMarket.value.includes("All")) count++;
    return count;
  }, [
    filterCategories.value,
    filterSubCategories.value,
    filterSortBy.value,
    filterMarket.value,
  ]);

  return (
    <>
      <SEO
        title="Screenboard"
        description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
      />
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <section className="relative overflow-hidden bg-[#E0E0E033]">
          <Header
            showSearch={true}
            searchTerm={searchTerm}
            onSearchChange={handleChangeSearch}
            scrolled={scrolled}
            scrolledSearch={scrolledSearch}
            onOpenAuthModal={() => setIsOpenAuth(true)}
            onShowCompare={() => setShowCompare(true)}
            transparentBg={true}
            callbackLogout={callbackAuth}
          />

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSection
              mainHeading="Explore Design Patterns from Real Apps"
              subtitle="Analyze hundreds of design examples. Register now to unlock complete app screens and learn from the best."
              onClickBtn={handleOpenAuthModal}
            />
          </div>
        </section>
        {/* Top 10 Apps This Month */}
        <Top10Apps apps={filteredApps.slice(0, 10)} />
        {/* Main Content */}
        <div
          ref={appsContainerRef}
          className="w-full flex justify-center items-center"
        >
          <div className="w-full lg:max-w-[920px] xl:max-w-[1440px]">
            <main className="px-4 py-6 md:px-0 md:py-8 lg:py-12 w-full">
              {user && (
                <div className="mb-6">
                  <div className="flex flex-col lg:flex-row lg:items-center w-full justify-between gap-4 lg:gap-6">
                    {/* Search Bar - Desktop */}
                    <div
                      className={clsx(
                        "w-[448px] transition-all duration-300 ease-in-out overflow-hidden h-[40px]",
                        !scrolledSearch
                          ? "max-h-[100px] opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                      )}
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-[1]" />
                        <input
                          placeholder="Search apps..."
                          value={searchTerm}
                          onChange={(e) => handleChangeSearch(e.target.value)}
                          className="w-full h-[40px] pl-10 pr-8 rounded-[20px] border border-input bg-background font-third text-[13px] outline-none focus:ring-0"
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => handleChangeSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Filters and View Controls */}
                    <div
                      className={clsx(
                        "bg-[white] md:w-fit w-full left-[0] transition-all duration-300 ease-in-out",
                        scrolledSearch &&
                          "fixed md:[position:initial] py-1 pl-[16px] z-[10000]",
                        showFilters ? "top-0 h-fit" : "top-[63px]"
                      )}
                    >
                      <div className="flex flex-row md:flex-col sm:flex-row gap-4 lg:gap-6">
                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={
                              viewMode === "grid" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="flex-1 sm:flex-none"
                          >
                            <Grid className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                            <span className="sm:hidden lg:inline">Grid</span>
                          </Button>
                          <Button
                            variant={
                              viewMode === "list" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="flex-1 sm:flex-none"
                          >
                            <List className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                            <span className="sm:hidden lg:inline">List</span>
                          </Button>

                          {/* Mobile Filter Button */}

                          <Sheet
                            open={showFilters}
                            onOpenChange={setShowFilters}
                          >
                            <SheetTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="md:hidden relative flex-1 sm:flex-none"
                              >
                                <Filter className="h-4 w-4 mr-2" />
                                <span>Filters</span>
                                {activeFiltersCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
                                  >
                                    {activeFiltersCount}
                                  </Badge>
                                )}
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              side="bottom"
                              className="h-[85vh] p-0"
                            >
                              <div className="flex flex-col h-full">
                                <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10">
                                  <div className="flex items-center justify-between">
                                    <SheetTitle className="text-lg font-semibold">
                                      Filters
                                      {activeFiltersCount > 0 && (
                                        <Badge
                                          variant="secondary"
                                          className="ml-2"
                                        >
                                          {activeFiltersCount} active
                                        </Badge>
                                      )}
                                    </SheetTitle>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setShowFilters(false)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </SheetHeader>
                                <div className="flex-1 overflow-y-auto px-6 py-6">
                                  <Filters
                                    getOptionsCategoryItemFiltered={
                                      getOptionsCategoryItemFiltered
                                    }
                                    filterCategories={filterCategories}
                                    filterSubCategories={filterSubCategories}
                                    filterSortBy={filterSortBy}
                                    filterMarket={filterMarket}
                                    handleChangeFilterSortBy={
                                      handleChangeFilterSortBy
                                    }
                                    handleChangeFilterCategories={
                                      handleChangeFilterCategories
                                    }
                                    handleChangeFilterSubCategories={
                                      handleChangeFilterSubCategories
                                    }
                                    handleChangeFilterMarket={
                                      handleChangeFilterMarket
                                    }
                                    getOptionsSubCategoryItemFiltered={
                                      getOptionsSubCategoryItemFiltered
                                    }
                                    getOptionsMarketItemFiltered={
                                      getOptionsMarketItemFiltered
                                    }
                                  />
                                </div>
                              </div>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                ref={containerMainRef}
                className="flex items-start gap-5 flex-col md:flex-row w-full"
              >
                {user && (
                  <>
                    {/* Static Filters - visible when not scrolled - Hidden on mobile */}
                    <div
                      className={clsx(
                        "hidden md:block min-w-[200px] max-w-[200px] max-h-[2000px] overflow-y-hidden transition-all ease-in-out",
                        scrolledFilterMenu
                          ? "opacity-0 pointer-events-none"
                          : "opacity-100"
                      )}
                    >
                      <Filters
                        getOptionsCategoryItemFiltered={
                          getOptionsCategoryItemFiltered
                        }
                        filterCategories={filterCategories}
                        filterSubCategories={filterSubCategories}
                        filterSortBy={filterSortBy}
                        filterMarket={filterMarket}
                        handleChangeFilterSortBy={handleChangeFilterSortBy}
                        handleChangeFilterCategories={
                          handleChangeFilterCategories
                        }
                        handleChangeFilterSubCategories={
                          handleChangeFilterSubCategories
                        }
                        handleChangeFilterMarket={handleChangeFilterMarket}
                        getOptionsSubCategoryItemFiltered={
                          getOptionsSubCategoryItemFiltered
                        }
                        getOptionsMarketItemFiltered={
                          getOptionsMarketItemFiltered
                        }
                      />
                    </div>

                    {/* Fixed Filters - visible when scrolled - Hidden on mobile */}
                    <div
                      className={clsx(
                        "hidden md:block min-w-[200px] max-w-[200px] fixed h-[90vh] overflow-y-auto top-24 z-50 pb-8 transition-all ease-in-out",
                        scrolledFilterMenu
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4 pointer-events-none"
                      )}
                    >
                      <Filters
                        getOptionsCategoryItemFiltered={
                          getOptionsCategoryItemFiltered
                        }
                        filterCategories={filterCategories}
                        filterSubCategories={filterSubCategories}
                        filterSortBy={filterSortBy}
                        filterMarket={filterMarket}
                        handleChangeFilterSortBy={handleChangeFilterSortBy}
                        handleChangeFilterCategories={
                          handleChangeFilterCategories
                        }
                        handleChangeFilterSubCategories={
                          handleChangeFilterSubCategories
                        }
                        handleChangeFilterMarket={handleChangeFilterMarket}
                        getOptionsSubCategoryItemFiltered={
                          getOptionsSubCategoryItemFiltered
                        }
                        getOptionsMarketItemFiltered={
                          getOptionsMarketItemFiltered
                        }
                      />
                    </div>
                  </>
                )}

                <div className="w-full flex justify-end">
                  <div
                    className={clsx(
                      "w-full flex items-start gap-5",
                      user && "max-w-[990px]"
                    )}
                  >
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
                          <div className="-mt-[12rem] pt-32 pb-8 bg-[linear-gradient(180.13deg,rgba(255,255,255,0)_-24.49%,#FFFFFF_33.51%)] absolute w-full max-w-[1440px]">
                            <div className="flex flex-col w-full gap-6">
                              <div className="flex justify-center items-center w-full">
                                <div className="flex flex-col gap-3 items-center w-full md:w-[889px] px-4">
                                  <h5 className="font-['Inter'] font-semibold text-[32px] md:text-[64px] leading-[80px] text-center bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                    Join and get more inspiration from real
                                    product
                                  </h5>
                                  <p className="font-[Inter] font-normal text-[16px] md:text-[20px] text-[#464C4F] leading-[31px] text-center">
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
          callbackSuccessLogin={callbackAuth}
        />

        <FavoritesModal
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
          favoriteScreens={favoriteScreens}
          onRemoveFavorite={toggleFavorite}
          onScreenClick={setSelectedScreen}
        />

        <CompareMaxModal
          isOpen={showCompareMaxModal}
          onClose={() => setShowCompareMaxModal(false)}
        />

        {/* ScreenPublic Detail Modal */}
        {/* {selectedScreen && (
          <Dialog
            open={!!selectedScreen}
            onOpenChange={() => setSelectedScreen(null)}
          >
            <DialogContent className="w-[365px] p-2 overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-lg lg:text-xl">
                  {selectedScreen.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden bg-slate-100">
                  <ImageWithFallback
                    src={selectedScreen.image}
                    fallbackSrc={selectedScreen.image}
                    alt={selectedScreen.name}
                    containerClassName="w-full h-[729px]"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )} */}
      </div>
    </>
  );
};

export default Index;
