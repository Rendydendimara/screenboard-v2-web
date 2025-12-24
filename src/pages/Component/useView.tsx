import { AuthModal } from "@/components/AuthModal";
import { HeroSection } from "@/components/HeroSection";
import { Header } from "@/components/molecules";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import { Search, Filter, X } from "lucide-react";
import Filters from "./components/Filters";
import { InfiniteScrollList } from "./components/InfiniteScrollList";
import useController from "./useController";
import { useMemo, useState } from "react";

const Index = () => {
  const {
    searchTerm,
    setSearchTerm,
    showCompare,
    setShowCompare,
    scrolled,
    scrolledSearch,
    scrolledCategories,
    mobileMenuOpen,
    setMobileMenuOpen,
    isOpenAuth,
    setIsOpenAuth,
    isLoadingGet,
    user,
    compareApps,
    onCloseOpenAuth,
    filteredComponent,
    allFilteredComponent,
    loadMoreItems,
    hasMoreItems,
    handleRemoveFromCompare,
    handleLogout,
    gotoDetail,
    handleOpenAuthModal,
    filterCategories,
    handleChangeFilterCategories,
    containerMainRef,
    scrolledFilterMenu,
  } = useController();

  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCategories.value && !filterCategories.value.includes("All"))
      count++;
    return count;
  }, [filterCategories.value]);

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
                {/* Static Filters - visible when not scrolled - Hidden on mobile */}
                <div
                  className={clsx(
                    "hidden md:block min-w-[130px] max-w-[130px] max-h-[2000px] overflow-y-hidden transition-all duration-300 ease-in-out",
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

                {/* Fixed Filters - visible when scrolled - Hidden on mobile */}
                <div
                  className={clsx(
                    "hidden md:block min-w-[140px] max-w-[140px] fixed h-[90vh] overflow-y-auto top-24 z-50 pb-8 transition-all duration-300 ease-in-out",
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

                        {/* Mobile Filter Button */}
                        <Sheet open={showFilters} onOpenChange={setShowFilters}>
                          <SheetTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="md:hidden w-full sm:w-auto"
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
                          <SheetContent side="bottom" className="h-[85vh] p-0">
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
                                  filterCategories={filterCategories}
                                  handleChangeFilterCategories={
                                    handleChangeFilterCategories
                                  }
                                />
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                      <div className="w-full  flex items-start gap-5">
                        {/* Component */}
                        {isLoadingGet ? (
                          <div className={clsx("w-full space-y-10")}>
                            {[1, 2, 3].map((section) => (
                              <div
                                key={section}
                                className="flex flex-col gap-6"
                              >
                                <Skeleton className="h-9 w-48" />
                                <div className="grid grid-cols-1 items-start sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                    <div
                                      key={item}
                                      className="flex flex-col gap-5"
                                    >
                                      <Skeleton className="w-[231px] h-[143px] rounded-[11px]" />
                                      <Skeleton className="h-[14px] w-3/4" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : filteredComponent.length === 0 ? (
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
                              components={filteredComponent}
                              onDetail={gotoDetail}
                              hasMoreItems={hasMoreItems}
                              loadMoreItems={loadMoreItems}
                              isLoading={isLoadingGet}
                            />
                          </div>
                        )}
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
