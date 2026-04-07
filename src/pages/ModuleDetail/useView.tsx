import { TModulApp, TModulAppScreen } from "@/api/user/modul/type";
import { AuthModal } from "@/components/AuthModal";
import FilterItem from "@/components/FilterItem";
import { Header } from "@/components/molecules";
import { ScreenImageModalV2 } from "@/components/ScreenImageModalV2";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { getImageUrl } from "@/utils";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { Filter } from "lucide-react";
import React, { useMemo } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import useController from "./useController";

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
            <div className="w-full md:max-w-[700px] lg:max-w-[1200px] px-4 md:px-0 pt-20 md:pt-28">
              <Skeleton className="h-8 md:h-12 w-48 mb-4" />
              <Skeleton className="h-5 w-32 mb-6" />
              <Skeleton className="h-16 w-full max-w-[600px] mb-12" />
              <div className="flex gap-8">
                <Skeleton className="hidden md:block min-w-[200px] h-[300px] rounded-[20px]" />
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
                      <div className="flex gap-3 overflow-hidden">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton
                            key={j}
                            className="min-w-[120px] h-[260px] md:min-w-[160px] md:h-[340px] rounded-xl flex-shrink-0"
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
          transparentBg={false}
        />

        {/* Module Info */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px] px-4 md:px-0">
            <div className="pt-[76px] md:pt-[100px] pb-[24px] md:pb-[45px] flex flex-col gap-3 md:gap-4">
              <h1 className="font-secondary font-bold text-[26px] md:text-[48px] text-[#0F172A] leading-[115%] md:leading-[100%]">
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
                <p className="text-[#334155] font-secondary font-normal text-[14px] md:text-[16px] leading-[155%] max-w-[760px]">
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-[40px] rounded-[10px] border-[#E2E8F0] font-secondary text-[14px] text-[#323638]"
                  >
                    <Filter className="h-4 w-4 mr-2 text-[#565D61]" />
                    <span>Filter Categories</span>
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

            <div
              ref={containerMainRef}
              className="flex items-start justify-end gap-8"
            >
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
                    "fixed top-24 z-50 transition-all ease-in-out",
                    scrolledFilterMenu
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  )}
                >
                  <div className="w-[216px] max-h-[90vh] overflow-y-auto pb-8 pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300/70 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:my-6">
                    <div className="w-[200px] rounded-[20px] bg-[#FAFAFA] p-5">
                      <FilterItem
                        handleChange={handleChangeFilterCategories}
                        menuFilter={filterCategories}
                        iconType="square"
                        className="gap-4"
                        classNameContainerItem="gap-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Apps List */}
              <div className="flex-1 flex flex-col gap-8 w-full md:max-w-[1028px]">
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
    <div className="flex flex-col gap-3 md:gap-4 bg-[#F6F6F6] p-4 md:p-5 rounded-[16px] md:rounded-tl-[20px] md:rounded-bl-[20px] md:rounded-tr-none md:rounded-br-none">
      {/* App Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-[8px] overflow-hidden flex-shrink-0 bg-slate-100">
          <ImageWithFallback
            src={app.iconUrl}
            fallbackSrc="https://placehold.co/40"
            alt={app.name}
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-secondary font-bold text-[14px] md:text-[16px] text-[#191919] truncate">
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
          className="flex-shrink-0 mr-5 h-[34px] md:h-[40px] gap-1.5 py-[1px] px-[10px] md:px-[13px] rounded-[6px] border border-solid border-[#E2E8F0] text-[#020817] font-normal bg-white text-[12px] md:text-[14px] font-primary"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M6.66671 9.33333L14 2M6.66671 9.33333L9.00005 14C9.0293 14.0638 9.07626 14.1179 9.13535 14.1558C9.19444 14.1938 9.26317 14.2139 9.33338 14.2139C9.40359 14.2139 9.47233 14.1938 9.53141 14.1558C9.5905 14.1179 9.63746 14.0638 9.66671 14L14 2M6.66671 9.33333L2.00005 7C1.93622 6.97075 1.88213 6.92379 1.84421 6.8647C1.80629 6.80561 1.78613 6.73688 1.78613 6.66667C1.78613 6.59646 1.80629 6.52772 1.84421 6.46863C1.88213 6.40954 1.93622 6.36258 2.00005 6.33333L14 2"
              stroke="#181A1B"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="md:hidden">Open</span>
          <span className="hidden md:inline">Go to App Screen</span>
        </Button>
      </div>

      {/* Screens Horizontal Scroll */}
      <ScrollContainer
        horizontal
        vertical={false}
        className="flex items-start gap-3 md:gap-4 pb-2 md:pr-5"
      >
        {app.screens.map((screen: TModulAppScreen) => (
          <div
            key={screen._id}
            className="flex flex-col items-start gap-2 flex-shrink-0 hover:cursor-pointer"
            onClick={() => onSelectScreen(screen, app)}
          >
            <ImageWithFallback
              src={getImageUrl(screen.image)}
              fallbackSrc="https://placehold.co/120x260"
              alt={screen.name || "Screen"}
              containerClassName="w-auto h-auto"
              className="w-[120px] h-[260px] md:w-[160px] md:h-[340px] rounded-xl border border-[#0000001A] object-cover"
            />
            {screen.name && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <p
                    className="font-secondary font-medium text-[11px] md:text-[12px] text-[#565D61] w-[120px] md:w-[160px]"
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
      </ScrollContainer>
    </div>
  );
};

export default ModuleDetailPage;
