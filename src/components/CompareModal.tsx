import { TCategoryRes } from "@/api/user/category/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPublic } from "@/pages/Home/useController";
import clsx from "clsx";
import { Globe, Monitor, Search, Smartphone } from "lucide-react";
import React, { useEffect, useState } from "react";
import "yet-another-react-lightbox/styles.css";
import { AppCardCompare } from "./AppCardCompare";
import ImageWithFallback from "./ui/ImageWithFallback";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppPublic[];
  onRemoveApp: (appId: string) => void;
  onAddApp?: (app: AppPublic) => void;
  availableApps?: AppPublic[];
  categories: TCategoryRes[];
  setShowCompare: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  apps,
  onRemoveApp,
  onAddApp,
  availableApps = [],
  categories,
  setShowCompare,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [indexInitialImageOpen, setIndexInitialImageOpen] = useState(0);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);

  const filteredAvailableApps = availableApps.filter((app) => {
    const notInCompare = !apps.find((compareApp) => compareApp.id === app.id);
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app?.category?._id === selectedCategory;

    return notInCompare && matchesSearch && matchesCategory;
  });

  const canAddMoreApps = apps.length < 3;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "iOS":
        return <Smartphone className="h-4 w-4" />;
      case "Android":
        return <Monitor className="h-4 w-4" />;
      case "Both":
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!openDetailImage) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCompare(true);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openDetailImage]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          onEscapeKeyDown={(e) => {
            if (isChildModalOpen) {
              e.preventDefault();
            }
          }}
          // onCloseAutoFocus={(e) => {
          //   e.preventDefault();
          //   setShowCompare(true);
          // }}
          className={clsx(
            "md:max-w-[1120px] p-6 md:p-[52px] !rounded-[32px] overflow-auto",
            apps.length > 0 ? "max-h-[95vh]" : "max-h-[90vh]"
          )}
        >
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <DialogTitle className="text-2xl lg:text-3xl font-bold">
                Compare Apps
                {/* ({apps.length}/3) */}
              </DialogTitle>
              {apps.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-9 p-0 rounded-[6px] px-3"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.66699 13.3333V2.66663M5.33366 2.66663V2.67329M8.00033 2.66663V2.67329M10.667 2.66663V2.67329M13.3337 2.66663V2.67329M8.00033 5.33329V5.33996M13.3337 5.33329V5.33996M5.33366 7.99996V8.00663M8.00033 7.99996V8.00663M10.667 7.99996V8.00663M13.3337 7.99996V8.00663M8.00033 10.6666V10.6733M13.3337 10.6666V10.6733M5.33366 13.3333V13.34M8.00033 13.3333V13.34M10.667 13.3333V13.34M13.3337 13.3333V13.34"
                        stroke={viewMode === "grid" ? "white" : "black"}
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Side by Side
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-9 p-0 rounded-[6px] px-3"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.66699 2.66663H13.3337M2.66699 5.33329V5.33996M8.00033 5.33329V5.33996M13.3337 5.33329V5.33996M2.66699 7.99996V8.00663M5.33366 7.99996V8.00663M8.00033 7.99996V8.00663M10.667 7.99996V8.00663M13.3337 7.99996V8.00663M2.66699 10.6666V10.6733M8.00033 10.6666V10.6733M13.3337 10.6666V10.6733M2.66699 13.3333V13.34M5.33366 13.3333V13.34M8.00033 13.3333V13.34M10.667 13.3333V13.34M13.3337 13.3333V13.34"
                        stroke={viewMode === "list" ? "white" : "black"}
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Top Down
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          {apps.length === 0 ? (
            <div className="text-center py-8 lg:py-12 bg-[#FBF9FF] rounded-2xl h-[340px] flex flex-col justify-center items-center">
              <div className="w-16 h-16 lg:w-28 lg:h-28 bg-[#F0ECFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="64"
                  height="65"
                  viewBox="0 0 64 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.3333 11.1667H34.6667M32 45.8333V45.86M16 13.8333C16 12.4188 16.5619 11.0623 17.5621 10.0621C18.5623 9.0619 19.9188 8.5 21.3333 8.5H42.6667C44.0812 8.5 45.4377 9.0619 46.4379 10.0621C47.4381 11.0623 48 12.4188 48 13.8333V51.1667C48 52.5812 47.4381 53.9377 46.4379 54.9379C45.4377 55.9381 44.0812 56.5 42.6667 56.5H21.3333C19.9188 56.5 18.5623 55.9381 17.5621 54.9379C16.5619 53.9377 16 52.5812 16 51.1667V13.8333Z"
                    stroke="#818181"
                    stroke-width="5.33333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-slate-600 mb-2">
                No apps to compare
              </h3>
              <p className="text-slate-500">
                Search and add apps below to start comparing
              </p>
            </div>
          ) : (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid gap-4 lg:gap-6"
                  : "space-y-4 lg:space-y-6"
              }`}
              style={
                viewMode === "grid"
                  ? {
                      gridTemplateColumns: `repeat(${Math.min(
                        2,
                        3
                      )}, minmax(0, 1fr))`,
                    }
                  : {}
              }
            >
              {apps.map((app, i) => (
                <AppCardCompare
                  key={i}
                  app={app}
                  viewMode={viewMode}
                  onRemoveApp={onRemoveApp}
                  onLightboxOpenChange={setIsChildModalOpen}
                />
              ))}
              {apps.length === 1 && (
                <div className="flex justify-center items-center">
                  {/* h-[185px */}
                  <div className="w-[506px] rounded-2xl gap-3 p-6 border flex flex-col items-start border-solid border-[#E0E1E1]">
                    <div className="flex gap-6 flex-col items-center">
                      <div className="flex gap-3 items-center">
                        <div className="flex-1 sm:flex-none sm:min-w-[115px]">
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger className="w-full rounded-xl">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent
                              className="bg-white rounded-[12px]"
                              classNameMenu="!m-0 !p-0"
                            >
                              <SelectItem
                                className="!items-start !py-[9px] !px-2"
                                isRemoveCheckIndocator
                                value="All"
                              >
                                All category
                              </SelectItem>
                              {categories.map((category, i) => (
                                <SelectItem
                                  className="!items-start !py-[9px] !px-2 truncate"
                                  key={i}
                                  value={category._id}
                                  isRemoveCheckIndocator
                                  withRoundedEdge
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="relative lg:col-span-1 w-[308px]">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#323638]" />
                          <Input
                            placeholder="Search app"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 placeholder:text-Semantic_Text_Placeholder_1 rounded-xl text-body-4 !font-normal placeholder:font-normal"
                          />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="bg-gradient-to-r w-[375px] rounded-2xl from-blue-500 to-purple-600 text-white border-0 px-4 h-11 py-2 text-sm lg:text-base"
                      >
                        Find Competitor
                      </Button>
                    </div>
                    <div className="flex items-start flex-col gap-3 w-full">
                      {filteredAvailableApps.length > 0 && (
                        <div className="flex items-start gap-6 overflow-x-auto max-w-[435px]">
                          {filteredAvailableApps.map((app) => (
                            <div
                              key={app.id}
                              className="w-full min-w-[264px] min-h-[262px] rounded-2xl flex flex-col items-start gap-6 border border-solid border-[#E0E1E1]"
                            >
                              <div className="w-full flex items-center justify-between p-3">
                                <div className="flex items-center gap-4">
                                  <ImageWithFallback
                                    src={
                                      app?.image ??
                                      "https://source.unsplash.com/400x300?game"
                                    }
                                    fallbackSrc="https://placehold.co/400"
                                    alt={app.name}
                                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-[8px] object-cover flex-shrink-0"
                                  />
                                  <div className="flex flex-col gap-4 items-start">
                                    <h3 className="font-semibold text-base lg:text-lg truncate">
                                      {app.name}
                                    </h3>
                                    <p className="text-sm text-black font-normal truncate">
                                      {app.company}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onAddApp(app)}
                                  className="h-[18px] w-[18px] p-0 m-0 flex-shrink-0 border-none"
                                >
                                  <svg
                                    width="12"
                                    height="13"
                                    viewBox="0 0 12 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6 1.25V11.75M0.75 6.5H11.25"
                                      stroke="black"
                                      stroke-width="1.4"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </Button>
                              </div>
                              <div className="flex items-start gap-2 px-3 overflow-x-auto max-w-[264px]">
                                {app.screens.map((screenshot, i) => (
                                  <ImageWithFallback
                                    src={
                                      screenshot.image ??
                                      "https://source.unsplash.com/400x300?game"
                                    }
                                    key={i}
                                    fallbackSrc="https://placehold.co/400"
                                    alt={screenshot.name}
                                    className="w-[74px] h-[163px] rounded-[8px] object-cover flex-shrink-0"
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {searchTerm && filteredAvailableApps.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <p className="text-sm">
                            No apps found matching "{searchTerm}" in{" "}
                            {selectedCategory === "All"
                              ? "any category"
                              : selectedCategory}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {apps.length === 0 && canAddMoreApps && onAddApp ? (
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 sm:flex-none sm:min-w-[115px]">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white rounded-[12px]"
                      classNameMenu="!m-0 !p-0"
                    >
                      <SelectItem
                        className="!items-start !py-[9px] !px-2"
                        isRemoveCheckIndocator
                        value="All"
                      >
                        All category
                      </SelectItem>
                      {categories.map((category, i) => (
                        <SelectItem
                          className="!items-start !py-[9px] !px-2 truncate"
                          key={i}
                          value={category._id}
                          isRemoveCheckIndocator
                          withRoundedEdge
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative lg:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#323638]" />
                  <Input
                    placeholder="Search app"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 placeholder:text-Semantic_Text_Placeholder_1 rounded-xl text-body-4 !font-normal"
                  />
                </div>
              </div>
              {apps.length === 0 && (
                <div className="flex items-start flex-col gap-3 w-full">
                  <p className="font-[Inter] font-medium text-[14px] leading-[155%] tracking-[-0.2%] align-middle">
                    Trending Apps
                  </p>
                  <div className="flex items-start gap-6 overflow-x-auto max-w-[325px] md:max-w-[1016px] w-full">
                    {filteredAvailableApps.map((app) => (
                      <div
                        key={app.id}
                        className="w-full md:min-w-[264px] min-h-[262px] rounded-2xl flex flex-col items-start gap-6 border border-solid border-[#E0E1E1]"
                      >
                        <div className="w-full flex items-center justify-between p-3">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={
                                app?.image ??
                                "https://source.unsplash.com/400x300?game"
                              }
                              fallbackSrc="https://placehold.co/400"
                              alt={app.name}
                              className="w-10 h-10 lg:w-12 lg:h-12 rounded-[8px] object-contain flex-shrink-0"
                            />
                            <div className="flex flex-col gap-4 items-start">
                              <h3 className="font-semibold text-base lg:text-lg truncate">
                                {app.name}
                              </h3>
                              <p className="text-sm text-black font-normal truncate">
                                {app.company}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAddApp(app)}
                            className="h-[18px] w-[18px] p-0 m-0 flex-shrink-0 border-none"
                          >
                            <svg
                              width="12"
                              height="13"
                              viewBox="0 0 12 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 1.25V11.75M0.75 6.5H11.25"
                                stroke="black"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </Button>
                        </div>
                        <div className="flex items-start gap-2 px-3 overflow-x-auto max-w-[264px]">
                          {app.screens.map((screenshot, i) => (
                            <ImageWithFallback
                              src={
                                screenshot.image ??
                                "https://source.unsplash.com/400x300?game"
                              }
                              key={i}
                              fallbackSrc="https://placehold.co/400"
                              alt={screenshot.name}
                              className="w-[74px] h-[163px] rounded-[8px] object-cover flex-shrink-0"
                            />
                          ))}
                        </div>
                      </div>

                      // <div
                      //   key={app.id}
                      //   className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      // >
                      //   <div className="flex items-center space-x-3 min-w-0 flex-1">
                      //     <ImageWithFallback
                      //       src={
                      //         app?.image ??
                      //         "https://source.unsplash.com/400x300?game"
                      //       }
                      //       fallbackSrc="https://placehold.co/400"
                      //       alt={app.name}
                      //       className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                      //     />
                      //     <div className="min-w-0">
                      //       <h4 className="font-medium text-sm truncate">
                      //         {app.name}
                      //       </h4>
                      //       <p className="text-xs text-slate-600 truncate">
                      //         {app?.category?.name}
                      //       </p>
                      //     </div>
                      //   </div>
                      //   <Button
                      //     variant="outline"
                      //     size="sm"
                      //     onClick={() => onAddApp(app)}
                      //     className="h-8 w-8 p-0 flex-shrink-0"
                      //   >
                      //     <Plus className="h-3 w-3" />
                      //   </Button>
                      // </div>
                    ))}
                  </div>

                  {searchTerm && filteredAvailableApps.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <p className="text-sm">
                        No apps found matching "{searchTerm}" in{" "}
                        {selectedCategory === "All"
                          ? "any category"
                          : selectedCategory}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : null}
          {!canAddMoreApps && (
            <div className="text-center mt-6 lg:mt-8 p-4 bg-amber-50 rounded-xl">
              <p className="text-amber-800 text-sm lg:text-base">
                Maximum of 3 apps can be compared. Remove an app to add a
                different one.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
