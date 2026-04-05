import { AuthModal } from "@/components/AuthModal";
import { ScreenImageModalV2 } from "@/components/ScreenImageModalV2";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import clsx from "clsx";
import {
  ArrowLeft,
  Building,
  Calendar,
  ExternalLink,
  GitCompare,
  Heart,
  Share2,
  Star,
  Filter,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useController from "./useController";
import ScrollContainer from "react-indiana-drag-scroll";
import FilterItem from "@/components/FilterItem";
import { Header } from "@/components/molecules";
import { isValidUrl } from "@/utils";

const useView: React.FC = () => {
  const {
    app,
    isLoadingDetail,
    selectedScreenCategory,
    screenViewMode,
    selectedScreen,
    compareApps,
    listApp,
    categories,
    isOpenAuth,
    scrolled,
    scrolledCategories,
    isDownloading,
    mobileMenuOpen,
    user,
    screenCategories,
    filteredScreens,
    groupedScreens,
    groupedScreensFilter,
    getListCategoryFiltered,
    setSelectedScreenCategory,
    setScreenViewMode,
    setSelectedScreen,
    setIsOpenAuth,
    setMobileMenuOpen,
    getPlatformIcon,
    toggleLike,
    handleScreenChange,
    handleLogout,
    handleAddToCompare,
    handleRemoveFromCompare,
    onCloseOpenAuth,
    handleChangeCategory,
    handleOpenAuthModal,
    handleAddCompare,
    handleDownloadScreens,
    navigate,
    filterCategories,
    containerMainRef,
    handleChangeFilterCategories,
  } = useController();

  const [showFilters, setShowFilters] = useState(false);

  // Get only the screens from the same group as the selected screen
  const selectedGroupScreens = useMemo(() => {
    if (!selectedScreen || !groupedScreensFilter) return [];
    const categoryName = selectedScreen.category?.name || "Uncategorized";
    return groupedScreensFilter[categoryName] || [];
  }, [selectedScreen, groupedScreensFilter]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCategories.value && !filterCategories.value.includes("All"))
      count++;
    return count;
  }, [filterCategories.value]);

  if (isLoadingDetail) {
    return (
      <>
        <SEO
          title="Loading... | UXBoard"
          description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
        />
        <section className="relative overflow-hidden ">
          <header className="fixed w-full top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="w-full flex justify-center items-center">
              <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
                <div className="flex items-center justify-between h-16 lg:h-20 px-4 md:px-0">
                  <Link to="/">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm lg:text-base">
                          S
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {/* App Overview Skeleton */}
          <div className="w-full flex justify-center items-center">
            <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
              <div className="pt-24 px-4 md:px-0">
                <div className="flex items-center justify-between md:flex-row flex-col">
                  <div className="flex items-start gap-6 w-full">
                    <Skeleton className="w-20 h-20 rounded-2xl" />
                    <div className="flex-1 space-y-4">
                      <Skeleton className="h-9 w-64" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-5 w-56" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-7 w-20 rounded-full" />
                        <Skeleton className="h-7 w-24 rounded-full" />
                        <Skeleton className="h-7 w-28 rounded-full" />
                      </div>
                      <Skeleton className="h-20 w-full max-w-[559px]" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-start items-center mt-4 md:mt-0">
                    <Skeleton className="h-10 w-24 rounded-md" />
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots Skeleton */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
            <div className="px-4 md:px-0 py-12">
              <div className="mb-8">
                <div className="flex flex-col md:flex-row items-start gap-3 md:gap-0 md:items-center justify-between mb-9">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-5 w-20" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24 rounded-md" />
                      <Skeleton className="h-9 w-28 rounded-md" />
                      <Skeleton className="h-9 w-32 rounded-md" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <Skeleton className="w-[272px] h-[603px] rounded-xl" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            App Not Found
          </h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${app?.name} – UI Screens & Design Patterns | UXBoard`}
        description={
          app?.description
            ? `${app.description.slice(0, 155)}…`
            : `Explore ${app?.name} app screens, UI patterns and design inspiration on UXBoard.`
        }
        image={app?.screens?.[0]?.image || app?.image}
        type="article"
      />

      {/* Navigation */}

      <section className="relative overflow-hidden">
        <Header
          scrolled={scrolled}
          onOpenAuthModal={handleOpenAuthModal}
          transparentBg={true}
          availableApps={listApp}
          categories={getListCategoryFiltered}
        />

        <div
          className={clsx(
            "w-full bg-[#353535] h-[40px] fixed z-50 top-[80px] py-2 ransition-all duration-300 ease-in-out",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="w-full flex justify-center items-center">
            <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-6 h-6 rounded-2xl overflow-hidden shadow-2xl">
                    <ImageWithFallback
                      src={
                        app?.image ?? "https://source.unsplash.com/400x300?game"
                      }
                      fallbackSrc="https://placehold.co/400"
                      alt={app.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-contain shadow-2xl"
                    />
                  </div>
                  <h1 className="text-[14px] font-bold font-secondary text-[#FFFFFF]">
                    {app.name}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLike}
                    className="w-6 h-6 flex justify-center items-center border-[E2E8F0] rounded-[6px] bg-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.99984 2.6665H9.99984C10.3535 2.6665 10.6926 2.80698 10.9426 3.05703C11.1927 3.30708 11.3332 3.64622 11.3332 3.99984V13.3332L7.99984 11.3332L4.6665 13.3332V3.99984C4.6665 3.64622 4.80698 3.30708 5.05703 3.05703C5.30708 2.80698 5.64622 2.6665 5.99984 2.6665Z"
                        stroke="#181A1B"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleAddCompare}
                    className="w-6 h-6 flex justify-center items-center border-[E2E8F0] rounded-[6px] bg-white"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.99984 5.33333C3.64622 5.33333 3.30708 5.19286 3.05703 4.94281C2.80698 4.69276 2.6665 4.35362 2.6665 4C2.6665 3.64638 2.80698 3.30724 3.05703 3.05719C3.30708 2.80714 3.64622 2.66667 3.99984 2.66667C4.35346 2.66667 4.6926 2.80714 4.94265 3.05719C5.19269 3.30724 5.33317 3.64638 5.33317 4C5.33317 4.35362 5.19269 4.69276 4.94265 4.94281C4.6926 5.19286 4.35346 5.33333 3.99984 5.33333ZM3.99984 5.33333V10.6667C3.99984 11.0203 4.14031 11.3594 4.39036 11.6095C4.64041 11.8595 4.97955 12 5.33317 12H8.6665M11.9998 10.6667C12.3535 10.6667 12.6926 10.8071 12.9426 11.0572C13.1927 11.3072 13.3332 11.6464 13.3332 12C13.3332 12.3536 13.1927 12.6928 12.9426 12.9428C12.6926 13.1929 12.3535 13.3333 11.9998 13.3333C11.6462 13.3333 11.3071 13.1929 11.057 12.9428C10.807 12.6928 10.6665 12.3536 10.6665 12C10.6665 11.6464 10.807 11.3072 11.057 11.0572C11.3071 10.8071 11.6462 10.6667 11.9998 10.6667ZM11.9998 10.6667V5.33333C11.9998 4.97971 11.8594 4.64057 11.6093 4.39052C11.3593 4.14048 11.0201 4 10.6665 4H7.33317M7.33317 4L9.33317 6M7.33317 4L9.33317 2M8.6665 12L6.6665 10M8.6665 12L6.6665 14"
                        stroke="#181A1B"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Overview */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
            <div className="flex w-full justify-between items-center"></div>
            <div className="pt-24 px-4 md:px-0 w-full flex justify-between items-center">
              {/* App Info */}
              <div className="flex items-start gap-4 justify-between flex-col max-w-[909px]">
                <div className="flex items-start w-full flex-col gap-4">
                  <div className="flex items-center gap-5 flex-col md:flex-row">
                    {/* App Image */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
                        <ImageWithFallback
                          src={
                            app?.image ??
                            "https://source.unsplash.com/400x300?game"
                          }
                          fallbackSrc="https://placehold.co/400"
                          alt={app.name}
                          containerClassName="w-full h-full"
                          className="w-full h-full object-contain shadow-2xl"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col w-full items-start gap-3">
                        {/* App Name */}
                        <h1 className="text-[48px] font-bold font-secondary text-[#0F172A] leading-[100%] tracking-[0%] align-middle">
                          {app.name}
                        </h1>
                        {/* App Update Date, Country */}
                        <div className="flex items-start gap-4 flex-col md:flex-row justify-start text-sm text-slate-600">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span className="font-secondary">
                              {app.company}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-secondary">
                              Updated{" "}
                              {new Date(app.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                          {app.countries && app.countries.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-[14px] h-[14px]">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.66667 0C2.99067 0 0 2.99067 0 6.66667C0 10.3427 2.99067 13.3333 6.66667 13.3333C10.3427 13.3333 13.3333 10.3427 13.3333 6.66667C13.3333 2.99067 10.3427 0 6.66667 0ZM1.33333 6.66667C1.33333 6.06733 1.43733 5.492 1.62067 4.954L2.66667 6L4 7.33333V8.66667L5.33333 10L6 10.6667V11.954C3.374 11.624 1.33333 9.38133 1.33333 6.66667ZM10.8867 9.91533C10.4513 9.56467 9.79133 9.33333 9.33333 9.33333V8.66667C9.33333 8.31304 9.19286 7.97391 8.94281 7.72386C8.69276 7.47381 8.35362 7.33333 8 7.33333H5.33333V5.33333C5.68695 5.33333 6.02609 5.19286 6.27614 4.94281C6.52619 4.69276 6.66667 4.35362 6.66667 4V3.33333H7.33333C7.68695 3.33333 8.02609 3.19286 8.27614 2.94281C8.52619 2.69276 8.66667 2.35362 8.66667 2V1.726C10.6187 2.51867 12 4.43333 12 6.66667C11.9997 7.84311 11.608 8.98602 10.8867 9.91533Z"
                                    fill="#475569"
                                  />
                                </svg>
                              </div>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <span
                                    className="font-secondary not-italic font-normal text-[13.3px] leading-[20px] items-center text-[#64748B]  overflow-hidden 
            text-ellipsis 
            break-words 
            [display:-webkit-box] 
            [-webkit-line-clamp:1] 
            [-webkit-box-orient:vertical]"
                                  >
                                    {`${
                                      app.countries.join(", ").length > 50
                                        ? `${app.countries
                                            .join(", ")
                                            .substring(0, 50)}...`
                                        : app.countries.join(", ")
                                    }`}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="bottom"
                                  align="center"
                                  hidden={app.countries.join(", ").length < 50}
                                  children={
                                    <p className="font-secondary not-italic font-normal text-[13.3px] leading-[20px] items-center text-white bg-black">
                                      {app.countries.join(", ")}
                                    </p>
                                  }
                                />
                              </Tooltip>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* App Feature */}
                  <div className="flex items-start justify-start gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="flex items-center space-x-1 text-sm px-3 py-1 font-bold text-[#464C4F] font-secondary"
                    >
                      {getPlatformIcon(app.platform)}
                      <span>{app.platform}</span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-sm px-3 py-1 font-bold text-[#464C4F] font-secondary"
                    >
                      {app.category?.name ?? "-"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-sm px-3 py-1 font-bold text-[#464C4F] font-secondary"
                    >
                      {app.subcategory?.name ?? "-"}
                    </Badge>
                    {app.featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 font-bold font-secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                {/* Description */}
                <p className="text-slate-700  font-secondary leading-relaxed text-base font-normal">
                  {app.description}
                </p>
              </div>
              {/* Button Like, Compare */}
              <div className="flex flex-wrap gap-2 justify-start items-center mt-4 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLike}
                  className={clsx(
                    "h-10 rounded-[6px] py-[1px] px-[13px] font-normal",
                    app.isLiked && "!bg-[#9333EA] !text-white",
                  )}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.99984 2.6665H9.99984C10.3535 2.6665 10.6926 2.80698 10.9426 3.05703C11.1927 3.30708 11.3332 3.64622 11.3332 3.99984V13.3332L7.99984 11.3332L4.6665 13.3332V3.99984C4.6665 3.64622 4.80698 3.30708 5.05703 3.05703C5.30708 2.80698 5.64622 2.6665 5.99984 2.6665Z"
                      stroke="#181A1B"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  {app.isLiked ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCompare}
                  className="h-10 rounded-[6px] py-[1px] px-[13px] font-normal"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.99984 5.33333C3.64622 5.33333 3.30708 5.19286 3.05703 4.94281C2.80698 4.69276 2.6665 4.35362 2.6665 4C2.6665 3.64638 2.80698 3.30724 3.05703 3.05719C3.30708 2.80714 3.64622 2.66667 3.99984 2.66667C4.35346 2.66667 4.6926 2.80714 4.94265 3.05719C5.19269 3.30724 5.33317 3.64638 5.33317 4C5.33317 4.35362 5.19269 4.69276 4.94265 4.94281C4.6926 5.19286 4.35346 5.33333 3.99984 5.33333ZM3.99984 5.33333V10.6667C3.99984 11.0203 4.14031 11.3594 4.39036 11.6095C4.64041 11.8595 4.97955 12 5.33317 12H8.6665M11.9998 10.6667C12.3535 10.6667 12.6926 10.8071 12.9426 11.0572C13.1927 11.3072 13.3332 11.6464 13.3332 12C13.3332 12.3536 13.1927 12.6928 12.9426 12.9428C12.6926 13.1929 12.3535 13.3333 11.9998 13.3333C11.6462 13.3333 11.3071 13.1929 11.057 12.9428C10.807 12.6928 10.6665 12.3536 10.6665 12C10.6665 11.6464 10.807 11.3072 11.057 11.0572C11.3071 10.8071 11.6462 10.6667 11.9998 10.6667ZM11.9998 10.6667V5.33333C11.9998 4.97971 11.8594 4.64057 11.6093 4.39052C11.3593 4.14048 11.0201 4 10.6665 4H7.33317M7.33317 4L9.33317 6M7.33317 4L9.33317 2M8.6665 12L6.6665 10M8.6665 12L6.6665 14"
                      stroke="#181A1B"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Compare
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full pt-[45px] pb-12">
        <div className="mb-8">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4 px-4">
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
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
                          <Badge variant="secondary" className="ml-2">
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
                    <FilterItem
                      handleChange={handleChangeFilterCategories}
                      menuFilter={filterCategories}
                      iconType="square"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/*  Filters */}
          <div
            ref={containerMainRef}
            className="flex items-start gap-5 flex-col md:flex-row w-full"
            style={{ paddingLeft: "max(16px, calc((100vw - 1200px) / 2))" }}
          >
            {/* Sticky sidebar - hidden on mobile */}
            <div className="hidden md:flex flex-col gap-5 min-w-[200px] max-w-[200px] self-start sticky top-[130px] max-h-[calc(100vh-140px)] overflow-y-auto pb-4 z-[10]">
              {/* Reference links */}
              {(isValidUrl(app.linkPlayStore) ||
                isValidUrl(app.linkAppStore) ||
                isValidUrl(app.linkWebsite)) && (
                <div className="rounded-[20px] p-5 bg-[#FAFAFA] flex flex-col items-start gap-4 w-full">
                  <p className="font-secondary font-bold text-[14px] leading-[20px] tracking-[-0.2%] align-middle text-[#323638]">
                    Reference
                  </p>
                  <div className="w-full flex flex-col items-start gap-3">
                    {isValidUrl(app.linkPlayStore) && (
                      <a
                        href={app.linkPlayStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-600 font-secondary bg-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Play Store</span>
                      </a>
                    )}
                    {isValidUrl(app.linkAppStore) && (
                      <a
                        href={app.linkAppStore}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-600 font-secondary bg-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>App Store</span>
                      </a>
                    )}
                    {isValidUrl(app.linkWebsite) && (
                      <a
                        href={app.linkWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-600 font-secondary bg-white"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.66667 0C2.99067 0 0 2.99067 0 6.66667C0 10.3427 2.99067 13.3333 6.66667 13.3333C10.3427 13.3333 13.3333 10.3427 13.3333 6.66667C13.3333 2.99067 10.3427 0 6.66667 0ZM1.33333 6.66667C1.33333 6.06733 1.43733 5.492 1.62067 4.954L2.66667 6L4 7.33333V8.66667L5.33333 10L6 10.6667V11.954C3.374 11.624 1.33333 9.38133 1.33333 6.66667ZM10.8867 9.91533C10.4513 9.56467 9.79133 9.33333 9.33333 9.33333V8.66667C9.33333 8.31304 9.19286 7.97391 8.94281 7.72386C8.69276 7.47381 8.35362 7.33333 8 7.33333H5.33333V5.33333C5.68695 5.33333 6.02609 5.19286 6.27614 4.94281C6.52619 4.69276 6.66667 4.35362 6.66667 4V3.33333H7.33333C7.68695 3.33333 8.02609 3.19286 8.27614 2.94281C8.52619 2.69276 8.66667 2.35362 8.66667 2V1.726C10.6187 2.51867 12 4.43333 12 6.66667C11.9997 7.84311 11.608 8.98602 10.8867 9.91533Z"
                            fill="#475569"
                          />
                        </svg>
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
              {/* Categories filter */}
              <div className="rounded-[20px] p-5 bg-[#FAFAFA] w-full">
                <FilterItem
                  handleChange={handleChangeFilterCategories}
                  menuFilter={filterCategories}
                  iconType="square"
                  className="gap-4"
                  classNameContainerItem="gap-4"
                />
              </div>
            </div>

            {/* Screens Grid/List/Horizontal */}
            <div className="flex-1 min-w-0 pb-[80px] pr-4 md:pr-0">
              <div className="w-full">
                {screenViewMode === "list" ? (
                  <div className="flex gap-8 flex-col items-start  bg-[#F6F6F6] p-5 pr-0 rounded-[20px] rounded-tr-none rounded-br-none w-full">
                    {Object.entries(groupedScreensFilter).map(
                      ([key, screens]) => (
                        <div
                          className="flex gap-4 flex-col items-start w-full"
                          key={key}
                        >
                          <div className="bg-[linear-gradient(90deg,#2563EB_0%,#9333EA_100%)] font-primary font-bold text-[16px] leading-[16px] text-center flex items-center justify-center text-white py-2 px-4 rounded-full">
                            {key}
                          </div>
                          <div className="flex items-start max-w-full pr-5 overflow-x-auto gap-4 pb-1 styled-scrollbar-black">
                            {screens.map((screen, i) => (
                              <div
                                key={i}
                                className="w-full flex flex-col items-start gap-3 hover:cursor-pointer pb-1"
                                onClick={() => setSelectedScreen(screen)}
                              >
                                <ImageWithFallback
                                  src={
                                    screen?.image ??
                                    "https://source.unsplash.com/400x300?game"
                                  }
                                  fallbackSrc="https://placehold.co/400"
                                  alt={screen.name}
                                  containerClassName="w-auto h-[100%]"
                                  className="w-full min-w-[240px] h-[499px] max-w-[240px] flex justify-center items-center rounded-xl overflow-hidden border-solid border border-[#0000001A] object-fill"
                                />

                                <Tooltip delayDuration={0}>
                                  <TooltipTrigger asChild>
                                    <h4
                                      className="
                                         text-ellipsis 
            break-words 
            [display:-webkit-box] 
            [-webkit-line-clamp:1] 
            [-webkit-box-orient:vertical
                                        font-[Inter] font-medium text-[12px] leading-normal tracking-[0%] align-middle text-[#565D61] min-w-[240px] max-w-[240px]"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {screen.name}
                                    </h4>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    align="center"
                                    hidden={screen.name.length < 26}
                                    children={
                                      <h4 className="bg-black font-[Inter] font-medium text-[12px] leading-normal tracking-[0%] align-middle text-white p-1 ">
                                        {screen.name}
                                      </h4>
                                    }
                                  />
                                </Tooltip>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <div className="flex gap-8 flex-col items-start  w-full">
                    {Object.entries(groupedScreensFilter).map(
                      ([key, screens]) => (
                        <div
                          className="flex gap-4 flex-col items-start w-full"
                          key={key}
                        >
                          <div className="h-8 py-2 px-4 flex items-center justify-center font-[Inter] font-bold text-[16px] leading-[16px] tracking-[0%] text-[#020817] rounded-full border border-solid border-[#E2E8F0]">
                            {key}
                          </div>
                          {/* <div className="flex items-start max-w-full pr-5 overflow-x-auto gap-7 pb-1 !styled-scrollbar-black"> */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7">
                            {screens.map((screen, i) => (
                              <div
                                key={i}
                                className="w-full max-w-[272px] flex flex-col items-start gap-1 hover:cursor-pointer"
                                onClick={() => setSelectedScreen(screen)}
                              >
                                {/* <div className="w-full max-w-[272px] h-[565px] aspect-[272/623] flex justify-center items-center rounded-xl overflow-hidden border-[1px] border-solid border-[rgba(0,0,0,0.1)]"> */}
                                <ImageWithFallback
                                  src={
                                    screen?.image ??
                                    "https://source.unsplash.com/400x300?game"
                                  }
                                  fallbackSrc="https://placehold.co/400"
                                  alt={screen.name}
                                  containerClassName="w-auto h-[100%]"
                                  className="w-full max-w-[272px] h-[565px] aspect-[272/623] flex justify-center items-center rounded-xl overflow-hidden border-[1px] border-solid border-[rgba(0,0,0,0.1)]"
                                />
                                {/* </div> */}
                                <h4
                                  className="font-[Inter] font-medium text-[12px] leading-[100%] tracking-[0%] align-middle text-[#565D61]"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {screen.name}
                                </h4>
                              </div>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scr Image Modal */}
        {selectedScreen && (
          <ScreenImageModalV2
            screen={selectedScreen}
            isOpen={!!selectedScreen}
            onClose={() => setSelectedScreen(null)}
            onImageUpdate={(newImage) => {}}
            allScreens={selectedGroupScreens}
            onScreenChange={handleScreenChange}
          />
        )}
      </div>
      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={onCloseOpenAuth}
      />
    </>
  );
};

export default useView;
