import { AuthModal } from "@/components/AuthModal";
import { ScreenImageModalV2 } from "@/components/ScreenImageModalV2";
import SEO from "@/components/SEO";
import { Header } from "@/components/molecules";
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
import FilterItem from "@/components/FilterItem";
import clsx from "clsx";
import { ArrowRight, Filter, X } from "lucide-react";
import React, { useMemo } from "react";
import useController from "./useController";
import { TModulApp, TModulAppScreen } from "@/api/user/modul/type";
import { getImageUrl } from "@/utils";

const ModuleDetailPage: React.FC = () => {
  const {
    modulName,
    modulDescription,
    totalApps,
    filteredApps,
    isLoadingDetail,
    selectedScreen,
    selectedAppScreens,
    isOpenAuth,
    scrolled,
    user,
    filterCategories,
    containerMainRef,
    scrolledFilterMenu,
    setSelectedScreen,
    setIsOpenAuth,
    handleChangeFilterCategories,
    handleSelectScreen,
    handleScreenChange,
    onCloseOpenAuth,
    handleOpenAuthModal,
    navigate,
  } = useController();

  const activeFiltersCount = useMemo(() => {
    const v = filterCategories.value;
    return Array.isArray(v) ? v.filter((x) => x !== "All").length : 0;
  }, [filterCategories.value]);

  if (isLoadingDetail) {
    return (
      <>
        <SEO
          title="Loading... | UXBoard"
          description="Discover and explore amazing mobile app designs."
        />
        <div className="min-h-screen">
          <Header
            scrolled={false}
            onOpenAuthModal={handleOpenAuthModal}
            transparentBg={false}
          />
          <div className="w-full flex justify-center items-center">
            <div className="w-full md:max-w-[700px] lg:max-w-[1200px] px-4 md:px-0 pt-28">
              <Skeleton className="h-12 w-48 mb-4" />
              <Skeleton className="h-5 w-32 mb-6" />
              <Skeleton className="h-16 w-full max-w-[600px] mb-12" />
              <div className="flex gap-8">
                <Skeleton className="min-w-[200px] h-[300px] rounded-[20px]" />
                <div className="flex-1 flex flex-col gap-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-9 w-36 rounded-md" />
                      </div>
                      <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton
                            key={j}
                            className="min-w-[160px] h-[340px] rounded-xl flex-shrink-0"
                          />
                        ))}
                      </div>
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

  return (
    <>
      <SEO
        title={`${modulName} – UI Pattern & App Screens | UXBoard`}
        description={
          modulDescription
            ? `${modulDescription.slice(0, 155)}…`
            : `Explore ${modulName} UI pattern across ${totalApps} apps on UXBoard. See real-world screen examples and design inspiration.`
        }
        image={
          filteredApps[0]?.screens?.[0]?.image
            ? getImageUrl(filteredApps[0].screens[0].image)
            : undefined
        }
        type="article"
      />

      <div className="min-h-screen bg-white">
        <Header
          scrolled={scrolled}
          onOpenAuthModal={handleOpenAuthModal}
          onShowCompare={() => {}}
          transparentBg={false}
        />

        {/* Module Info */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px] px-4 md:px-0">
            <div className="pt-[100px] pb-[45px] flex flex-col gap-4">
              <h1 className="font-secondary font-bold text-[48px] text-[#0F172A] leading-[100%]">
                {modulName}
              </h1>
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 5.33301H4.00667M6 5.33301H6.00667M2 4.66634C2 4.31272 2.14048 3.97358 2.39052 3.72353C2.64057 3.47348 2.97971 3.33301 3.33333 3.33301H12.6667C13.0203 3.33301 13.3594 3.47348 13.6095 3.72353C13.8595 3.97358 14 4.31272 14 4.66634V11.333C14 11.6866 13.8595 12.0258 13.6095 12.2758C13.3594 12.5259 13.0203 12.6663 12.6667 12.6663H3.33333C2.97971 12.6663 2.64057 12.5259 2.39052 12.2758C2.14048 12.0258 2 11.6866 2 11.333V4.66634Z"
                    stroke="#181A1B"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-secondary font-normal text-[14px] text-[#475569]">
                  {totalApps} Product
                </p>
              </div>
              {modulDescription && (
                <p className="text-[#334155] font-secondary font-normal text-[16px] leading-[155%] max-w-[760px]">
                  {modulDescription}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex justify-center items-center pb-20">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px] px-4 md:px-0">
            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Categories</span>
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
                <SheetContent side="bottom" className="h-[60vh] p-0">
                  <div className="flex flex-col h-full">
                    <SheetHeader className="px-6 py-4 border-b">
                      <SheetTitle>Categories</SheetTitle>
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

            <div ref={containerMainRef} className="flex items-start gap-8">
              {/* Desktop Sidebar Filter */}
              <div className="hidden md:flex flex-col gap-5 z-[10]">
                {/* Static filter */}
                <div
                  className={clsx(
                    "min-w-[200px] max-w-[200px] transition-all ease-in-out rounded-[20px] p-5 bg-[#FAFAFA]",
                    scrolledFilterMenu
                      ? "opacity-0 pointer-events-none"
                      : "opacity-100"
                  )}
                >
                  <FilterItem
                    handleChange={handleChangeFilterCategories}
                    menuFilter={filterCategories}
                    iconType="square"
                    className="gap-4"
                    classNameContainerItem="gap-4"
                  />
                </div>
                {/* Fixed filter when scrolled */}
                <div
                  className={clsx(
                    "min-w-[200px] max-w-[200px] fixed top-24 max-h-[90vh] overflow-y-auto z-50 pb-8 transition-all ease-in-out rounded-[20px] p-5 bg-[#FAFAFA]",
                    scrolledFilterMenu
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  )}
                >
                  <FilterItem
                    handleChange={handleChangeFilterCategories}
                    menuFilter={filterCategories}
                    iconType="square"
                    className="gap-4"
                    classNameContainerItem="gap-4"
                  />
                </div>
              </div>

              {/* Apps List */}
              <div className="flex-1 flex flex-col gap-8">
                {filteredApps.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-[#565D61] font-secondary text-[16px]">
                      No apps found for this module.
                    </p>
                  </div>
                )}

                {filteredApps.map((app: TModulApp) => (
                  <AppScreenSection
                    key={app._id}
                    app={app}
                    onSelectScreen={handleSelectScreen}
                    onGoToApp={() => navigate(`/app/${app._id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Image Modal */}
      {selectedScreen && (
        <ScreenImageModalV2
          screen={selectedScreen}
          isOpen={!!selectedScreen}
          onClose={() => setSelectedScreen(null)}
          onImageUpdate={() => {}}
          allScreens={selectedAppScreens}
          onScreenChange={handleScreenChange}
          enableGetImgURL
          modalTitle={selectedScreen.appName}
        />
      )}

      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={onCloseOpenAuth}
      />
    </>
  );
};

interface AppScreenSectionProps {
  app: TModulApp;
  onSelectScreen: (screen: TModulAppScreen, app: TModulApp) => void;
  onGoToApp: () => void;
}

const AppScreenSection: React.FC<AppScreenSectionProps> = ({
  app,
  onSelectScreen,
  onGoToApp,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-[#F6F6F6] p-5 pr-0 rounded-tl-[20px] rounded-bl-[20px]">
      {/* App Header */}
      <div className="flex items-center gap-3 pr-5">
        <div className="w-12 h-12 rounded-[8px] overflow-hidden flex-shrink-0 bg-slate-100">
          <ImageWithFallback
            src={app.iconUrl}
            fallbackSrc="https://placehold.co/40"
            alt={app.name}
            containerClassName="w-12 h-12"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-secondary font-bold text-[16px] text-[#191919] truncate">
            {app.name}
          </p>
          {app.company && (
            <p className="font-secondary font-normal text-[12px] text-[#475569] truncate">
              {app.company}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onGoToApp}
          className="flex-shrink-0 gap-2a h-[40px] py-[1px] px-[13px] rounded-[6px] border border-solid border-[#E2E8F0] text-[#020817] font-normal tex bg-white text-[14px] font-primary"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66671 9.33333L14 2M6.66671 9.33333L9.00005 14C9.0293 14.0638 9.07626 14.1179 9.13535 14.1558C9.19444 14.1938 9.26317 14.2139 9.33338 14.2139C9.40359 14.2139 9.47233 14.1938 9.53141 14.1558C9.5905 14.1179 9.63746 14.0638 9.66671 14L14 2M6.66671 9.33333L2.00005 7C1.93622 6.97075 1.88213 6.92379 1.84421 6.8647C1.80629 6.80561 1.78613 6.73688 1.78613 6.66667C1.78613 6.59646 1.80629 6.52772 1.84421 6.46863C1.88213 6.40954 1.93622 6.36258 2.00005 6.33333L14 2"
              stroke="#181A1B"
              stroke-width="1.3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Go to App Screen
        </Button>
      </div>

      {/* Screens Horizontal Scroll */}
      <div className="flex items-start gap-4 overflow-x-auto pb-2 styled-scrollbar-black pr-5">
        {app.screens.map((screen: TModulAppScreen) => (
          <div
            key={screen._id}
            className="flex flex-col items-start gap-2 flex-shrink-0 hover:cursor-pointer"
            onClick={() => onSelectScreen(screen, app)}
          >
            <ImageWithFallback
              src={getImageUrl(screen.image)}
              fallbackSrc="https://placehold.co/160x340"
              alt={screen.name || "Screen"}
              containerClassName="w-auto h-auto"
              className="w-[160px] h-[340px] rounded-xl border border-[#0000001A] object-cover"
            />
            {screen.name && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <p
                    className="font-secondary font-medium text-[12px] text-[#565D61] w-[160px]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {screen.name}
                  </p>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  hidden={screen.name.length < 20}
                >
                  <p className="bg-black text-white font-secondary text-[12px] p-1">
                    {screen.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModuleDetailPage;
