import { AuthModal } from "@/components/AuthModal";
import { CompareModal } from "@/components/CompareModal";
import { ScreenImageModalV2 } from "@/components/ScreenImageModalV2";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import {
  ArrowLeft,
  Building,
  Calendar,
  ExternalLink,
  GitCompare,
  Heart,
  Menu,
  Share2,
  Star,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import useController from "./usController";
import FilterItem from "@/components/FilterItem";

const useView: React.FC = () => {
  const {
    app,
    isLoadingDetail,
    selectedScreenCategory,
    screenViewMode,
    selectedScreen,
    showCompare,
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
    setShowCompare,
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
    scrolledFilterMenu,
    handleChangeFilterCategories,
  } = useController();

  if (isLoadingDetail) {
    return (
      <>
        <SEO
          title="Loading... | Screenboard"
          description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
        />
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <header className="fixed w-full top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="w-full flex justify-center items-center">
              <div className="w-full max-w-[1200px]">
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
            <div className="w-full max-w-[1200px]">
              <div className="pt-24 px-4 md:px-0 pb-[40px]">
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
          <div className="w-full max-w-[1200px]">
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
        title={`${app?.name} | Screenboard`}
        description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
      />

      {/* Navigation */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header
          className={clsx(
            "fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300",
            scrolled
              ? "bg-white/90 backdrop-blur-md shadow-sm"
              : "bg-transparent"
          )}
        >
          <div className="w-full flex justify-center items-center">
            <div className="w-full max-w-[1200px]">
              <div className="w-full">
                <div className=" px-0">
                  <div className="flex items-center justify-between h-16 lg:h-20 px-4 md:px-0">
                    {/* Logo */}
                    <Link to="/">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm lg:text-base">
                            S
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons - Desktop */}
                    <div className="hidden md:flex items-center gap-[10px]">
                      {user && (
                        <Link to="/favorites">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleOpenAuthModal}
                            className="relative"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.6666 9.33333C13.66 8.36 14.6666 7.19333 14.6666 5.66667C14.6666 4.69421 14.2803 3.76158 13.5927 3.07394C12.9051 2.38631 11.9724 2 11 2C9.82665 2 8.99998 2.33333 7.99998 3.33333C6.99998 2.33333 6.17331 2 4.99998 2C4.02752 2 3.09489 2.38631 2.40725 3.07394C1.71962 3.76158 1.33331 4.69421 1.33331 5.66667C1.33331 7.2 2.33331 8.36667 3.33331 9.33333L7.99998 14L12.6666 9.33333Z"
                                stroke="#94A3B8"
                                stroke-width="1.33333"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                              Favorites ({user.appLikes.length})
                            </span>
                          </Button>
                        </Link>
                      )}
                      {user && (
                        <Link to="/subscription">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="relative"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70725 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947618 11.2811 0.666668 11.9594 0.666668 12.6667V14M13.3333 5.33333V9.33333M15.3333 7.33333H11.3333M8.33333 4.66667C8.33333 6.13943 7.13943 7.33333 5.66667 7.33333C4.19391 7.33333 3 6.13943 3 4.66667C3 3.19391 4.19391 2 5.66667 2C7.13943 2 8.33333 3.19391 8.33333 4.66667Z"
                                stroke="#94A3B8"
                                stroke-width="1.33333"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <span className="lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                              Subscription
                            </span>
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={() => setShowCompare(true)}
                        variant="ghost"
                        size="sm"
                        className="relative"
                      >
                        <GitCompare className="h-4 w-4" />
                        {compareApps.length > 0 && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {compareApps.length}
                          </Badge>
                        )}
                        <span className="lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle">
                          Compare
                        </span>
                      </Button>
                      {!user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleOpenAuthModal}
                          className="relative"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.66667 8L5.33333 6.53334L5.73333 5.86667M4 3.33333H12L14 6.66667L8.33333 13C8.28988 13.0443 8.23802 13.0796 8.18078 13.1036C8.12355 13.1277 8.06209 13.1401 8 13.1401C7.93792 13.1401 7.87645 13.1277 7.81922 13.1036C7.76198 13.0796 7.71012 13.0443 7.66667 13L2 6.66667L4 3.33333Z"
                              stroke="black"
                              stroke-width="1.3"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                          <span className="lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle">
                            Join Us
                          </span>
                        </Button>
                      )}

                      {user && (
                        <div className="flex items-center gap-2 px-3">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                              stroke="black"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          <p className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                            {user.username}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex items-center space-x-2 font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle underline [text-decoration-style:solid] [text-decoration-skip-ink:auto] !text-[#4475EE]"
                          >
                            Logout
                          </Button>
                          {user.userType === "administrator" && (
                            <Link to="/admin">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hidden sm:flex items-center space-x-2"
                              >
                                Admin
                              </Button>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet
                      open={mobileMenuOpen}
                      onOpenChange={setMobileMenuOpen}
                    >
                      <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="sm">
                          <Menu className="h-6 w-6" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="w-[300px] sm:w-[350px]"
                      >
                        <div className="flex flex-col gap-4 mt-8">
                          {user ? (
                            <>
                              <div className="flex items-center gap-2 pb-4 border-b">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                                    stroke="black"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <p className="font-[Inter] font-semibold text-[16px]">
                                  {user.username}
                                </p>
                              </div>

                              <Link
                                to="/favorites"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start gap-2"
                                >
                                  <Heart className="h-5 w-5" />
                                  Favorites ({user.appLikes.length})
                                </Button>
                              </Link>

                              <Link
                                to="/subscription"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start gap-2"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70725 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947618 11.2811 0.666668 11.9594 0.666668 12.6667V14M13.3333 5.33333V9.33333M15.3333 7.33333H11.3333M8.33333 4.66667C8.33333 6.13943 7.13943 7.33333 5.66667 7.33333C4.19391 7.33333 3 6.13943 3 4.66667C3 3.19391 4.19391 2 5.66667 2C7.13943 2 8.33333 3.19391 8.33333 4.66667Z"
                                      stroke="currentColor"
                                      strokeWidth="1.33333"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Subscription
                                </Button>
                              </Link>

                              <Link
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start gap-2"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                                      stroke="currentColor"
                                      strokeWidth="1.33333"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Profile
                                </Button>
                              </Link>

                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setShowCompare(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full justify-start gap-2 relative"
                              >
                                <GitCompare className="h-5 w-5" />
                                Compare
                                {compareApps.length > 0 && (
                                  <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {compareApps.length}
                                  </Badge>
                                )}
                              </Button>

                              {user.userType === "administrator" && (
                                <Link
                                  to="/admin"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                  >
                                    Admin Panel
                                  </Button>
                                </Link>
                              )}

                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleLogout();
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full justify-start mt-4"
                              >
                                Logout
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setShowCompare(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full justify-start gap-2 relative"
                              >
                                <GitCompare className="h-5 w-5" />
                                Compare
                                {compareApps.length > 0 && (
                                  <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {compareApps.length}
                                  </Badge>
                                )}
                              </Button>

                              <Button
                                onClick={() => {
                                  setIsOpenAuth(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  className="mr-2"
                                >
                                  <path
                                    d="M6.66667 8L5.33333 6.53334L5.73333 5.86667M4 3.33333H12L14 6.66667L8.33333 13C8.28988 13.0443 8.23802 13.0796 8.18078 13.1036C8.12355 13.1277 8.06209 13.1401 8 13.1401C7.93792 13.1401 7.87645 13.1277 7.81922 13.1036C7.76198 13.0796 7.71012 13.0443 7.66667 13L2 6.66667L4 3.33333Z"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Join Us
                              </Button>
                            </>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* App Overview */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1200px]">
            <div className="pt-24 px-4 md:px-0 pb-[40px]">
              <div className="flex items-center justify-between md:flex-row flex-col">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
                      <ImageWithFallback
                        src={
                          app?.image ??
                          "https://source.unsplash.com/400x300?game"
                        }
                        fallbackSrc="https://placehold.co/400"
                        alt={app.name}
                        className="w-full h-full object-cover shadow-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      {app.name}
                    </h1>
                    <div className="flex mt-2 items-start gap-4 flex-col md:flex-row justify-start text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Building className="h-4 w-4" />
                        <span>{app.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
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
                                className="font-['Inter'] not-italic font-normal text-[13.3px] leading-[20px] items-center text-[#64748B]  overflow-hidden 
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
                                <p className="font-['Inter'] not-italic font-normal text-[13.3px] leading-[20px] items-center text-white bg-black">
                                  {app.countries.join(", ")}
                                </p>
                              }
                            />
                          </Tooltip>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-start justify-start gap-2 mt-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className="flex items-center space-x-1 text-sm px-3 py-1 font-bold text-[#464C4F]"
                      >
                        {getPlatformIcon(app.platform)}
                        <span>{app.platform}</span>
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1 font-bold text-[#464C4F]"
                      >
                        {app.category?.name ?? "-"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-sm px-3 py-1 font-bold text-[#464C4F]"
                      >
                        {app.subcategory?.name ?? "-"}
                      </Badge>
                      {app.featured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 font-bold ">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-700 mt-6 max-w-[559px] leading-relaxed text-base font-normal">
                      {app.description}
                    </p>
                    {(app.linkPlayStore ||
                      app.linkAppStore ||
                      app.linkWebsite) && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {app.linkPlayStore && (
                          <a
                            href={app.linkPlayStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Play Store</span>
                          </a>
                        )}
                        {app.linkAppStore && (
                          <a
                            href={app.linkAppStore}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>App Store</span>
                          </a>
                        )}
                        {app.linkWebsite && (
                          <a
                            href={app.linkWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm text-slate-700 hover:text-blue-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>Website</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-start items-center mt-4 md:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLike}
                    className={clsx(
                      "h-10 rounded-[6px] py-[1px] px-[13px] font-normal",
                      app.isLiked && "!bg-[#9333EA] !text-white"
                    )}
                  >
                    {user ? (
                      <Heart className="h-4 w-4" />
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.3335 7.33333V4.66667C5.3335 3.95942 5.61445 3.28115 6.11454 2.78105C6.61464 2.28095 7.29292 2 8.00016 2C8.70741 2 9.38568 2.28095 9.88578 2.78105C10.3859 3.28115 10.6668 3.95942 10.6668 4.66667V7.33333M3.3335 8.66667C3.3335 8.31304 3.47397 7.97391 3.72402 7.72386C3.97407 7.47381 4.31321 7.33333 4.66683 7.33333H11.3335C11.6871 7.33333 12.0263 7.47381 12.2763 7.72386C12.5264 7.97391 12.6668 8.31304 12.6668 8.66667V12.6667C12.6668 13.0203 12.5264 13.3594 12.2763 13.6095C12.0263 13.8595 11.6871 14 11.3335 14H4.66683C4.31321 14 3.97407 13.8595 3.72402 13.6095C3.47397 13.3594 3.3335 13.0203 3.3335 12.6667V8.66667ZM7.3335 10.6667C7.3335 10.8435 7.40373 11.013 7.52876 11.1381C7.65378 11.2631 7.82335 11.3333 8.00016 11.3333C8.17697 11.3333 8.34654 11.2631 8.47157 11.1381C8.59659 11.013 8.66683 10.8435 8.66683 10.6667C8.66683 10.4899 8.59659 10.3203 8.47157 10.1953C8.34654 10.0702 8.17697 10 8.00016 10C7.82335 10 7.65378 10.0702 7.52876 10.1953C7.40373 10.3203 7.3335 10.4899 7.3335 10.6667Z"
                          stroke="black"
                          stroke-width="1.33333"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                    {app.isLiked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddCompare}
                    className="h-10 rounded-[6px] py-[1px] px-[13px] font-normal"
                  >
                    <GitCompare className="h-4 w-4" />
                    Compare
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 rounded-[6px] py-[1px] px-[13px] font-normal"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-[1200px]">
          <div>
            <div className=" px-4 md:px-0 py-12">
              <div className="mb-8">
                {/*  Filters */}
                <div
                  ref={containerMainRef}
                  className="flex items-start gap-5 flex-col md:flex-row w-full"
                >
                  {/* Static Filters - visible when not scrolled */}
                  <div
                    className={clsx(
                      "min-w-[130px] max-w-[130px] transition-all duration-300 ease-in-out",
                      scrolledFilterMenu
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100"
                    )}
                  >
                    <FilterItem
                      handleChange={handleChangeFilterCategories}
                      menuFilter={filterCategories}
                      iconType="rounded"
                    />
                  </div>
                  {/* Fixed Filters - visible when scrolled */}
                  <div
                    className={clsx(
                      "min-w-[130px] max-w-[130px] fixed max-h-[90vh] overflow-y-auto top-24 z-50 pb-8 transition-all duration-300 ease-in-out",
                      scrolledFilterMenu
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                  >
                    <FilterItem
                      handleChange={handleChangeFilterCategories}
                      menuFilter={filterCategories}
                      iconType="rounded"
                    />
                  </div>
                  {/* Screens Grid/List/Horizontal */}
                  <div className="w-full flex justify-end">
                    <div className="w-full max-w-[990px] flex items-start gap-5 min-h-screen">
                      {screenViewMode === "list" ? (
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
                                <div className="flex items-start max-w-full pr-5 overflow-x-auto gap-7 pb-1 !styled-scrollbar-black">
                                  {screens.map((screen, i) => (
                                    <div
                                      key={i}
                                      className="w-full flex flex-col items-start gap-1 hover:cursor-pointer"
                                      onClick={() => setSelectedScreen(screen)}
                                    >
                                      <div className="min-w-[272px] max-w-[272px] h-[603px] rounded-xl overflow-hidden border-[1px] border-solid border-[rgba(0,0,0,0.1)]">
                                        <ImageWithFallback
                                          src={
                                            screen?.image ??
                                            "https://source.unsplash.com/400x300?game"
                                          }
                                          fallbackSrc="https://placehold.co/400"
                                          alt={screen.name}
                                          className="w-full h-[623px] object-cover -mt-[20px]"
                                        />
                                      </div>
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
                            )
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                                  {screens.map((screen, i) => (
                                    <div
                                      key={i}
                                      className="w-[272px] flex flex-col items-start gap-1 hover:cursor-pointer"
                                      onClick={() => setSelectedScreen(screen)}
                                    >
                                      <div className="w-[272px] h-[603px] rounded-xl overflow-hidden border-[1px] border-solid border-[rgba(0,0,0,0.1)]">
                                        <ImageWithFallback
                                          src={
                                            screen?.image ??
                                            "https://source.unsplash.com/400x300?game"
                                          }
                                          fallbackSrc="https://placehold.co/400"
                                          alt={screen.name}
                                          className="w-full h-[623px] object-cover -mt-[20px]"
                                        />
                                      </div>
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
                            )
                          )}
                        </div>
                      )}
                    </div>
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
                allScreens={filteredScreens}
                onScreenChange={handleScreenChange}
              />
            )}

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
          </div>
        </div>
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
