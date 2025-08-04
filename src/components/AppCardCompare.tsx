import { Button } from "@/components/ui/button";
import { AppPublic } from "@/pages/Index";
import { TSelect } from "@/types";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import ScrollGallery, { ScrollGalleryList } from "./ScrollGallery";
import ImageWithFallback from "./ui/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AppCardProps {
  app: AppPublic;
  viewMode: "grid" | "list";
  onRemoveApp?: (id: string) => void;
}

export const AppCardCompare: React.FC<AppCardProps> = ({
  app,
  viewMode,
  onRemoveApp,
}) => {
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [indexInitialImageOpen, setIndexInitialImageOpen] = useState(0);
  const [selectedModuleFilter, setSelectedModulFilter] =
    useState<TSelect | null>(null);
  const [listCategory, setListCategory] = useState<TSelect[]>([]);

  const handleClickImage = useCallback((i: number) => {
    setIndexInitialImageOpen(i);
    setOpenDetailImage(true);
  }, []);

  const handleCloseImageDetail = useCallback(() => {
    setOpenDetailImage(false);
    // setShowCompare(true);
  }, []);

  const getListImageDetail = useMemo(() => {
    if (app) {
      const listImages: string[] = app.screens.map((d) => d.image) ?? [];
      const slides = listImages.map((src) => ({ src }));
      return slides;
    }
    return [];
  }, [app]);

  const getScreensCategory = () => {
    const categories = Array.from(
      new Set(
        app?.screens
          ?.map((d) => d?.category?.name)
          .filter((item): item is string => item !== null && item !== undefined)
      )
    );
    const options: TSelect[] = categories.map((d) => {
      return {
        label: d,
        value: d,
      };
    });
    setListCategory(options);
  };
  const handleChangeModul = useCallback(
    (id: string) => {
      const temp = listCategory.find((d) => d.value === id);
      setSelectedModulFilter(temp);
    },
    [listCategory]
  );

  const getScreenFiltered = useMemo(() => {
    let result = app?.screens;
    if (selectedModuleFilter?.value) {
      result = app?.screens?.filter(
        (d) => d?.category?.name === selectedModuleFilter?.value
      );
    }
    return result;
  }, [selectedModuleFilter, app.screens]);

  useEffect(() => {
    getScreensCategory();
  }, []);

  return (
    <div
      key={app.id}
      className={`bg-white border border-slate-200 rounded-xl overflow-hidden ${
        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      {viewMode === "grid" ? (
        <>
          <div className="p-4 lg:p-6 border-b border-slate-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <ImageWithFallback
                  src={app?.image ?? "https://source.unsplash.com/400x300?game"}
                  fallbackSrc="https://placehold.co/400"
                  alt={app.name}
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-base lg:text-lg truncate">
                    {app.name}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">
                    {app.company}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveApp(app.id)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* <div className="flex items-center justify-center mb-4">
                        <Badge
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          {getPlatformIcon(app.platform)}
                          <span className="text-xs lg:text-sm">
                            {app.platform}
                          </span>
                        </Badge>
                      </div> */}
          </div>
          <div className="flex-1 sm:flex-none w-full p-4">
            <Select
              value={selectedModuleFilter?.value}
              onValueChange={handleChangeModul}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value={null}>All</SelectItem>
                {listCategory.map((category, i) => (
                  <SelectItem key={i} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4 lg:p-6">
            <h4 className="font-medium mb-3 text-sm lg:text-base">
              Screens ({getScreenFiltered?.length ?? 0})
            </h4>
            <ScrollGallery
              screens={getScreenFiltered}
              handleClickImage={handleClickImage}
            />
          </div>
        </>
      ) : (
        <>
          <div className="w-full sm:w-32 lg:w-40 h-32 flex-shrink-0">
            <ImageWithFallback
              src={app?.image ?? "https://source.unsplash.com/400x300?game"}
              fallbackSrc="https://placehold.co/400"
              alt={app.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-4 lg:p-6">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base lg:text-lg truncate">
                  {app.name}
                </h3>
                <p className="text-sm text-slate-500 truncate">{app.company}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveApp(app.id)}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 ml-2 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 sm:flex-none w-full p-4">
              <Select
                value={selectedModuleFilter?.value}
                onValueChange={handleChangeModul}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value={null}>All</SelectItem>
                  {listCategory.map((category, i) => (
                    <SelectItem key={i} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-3">
              {/* <Badge
                          variant="secondary"
                          className="flex items-center space-x-1 w-fit"
                        >
                          {getPlatformIcon(app.platform)}
                          <span className="text-xs lg:text-sm">
                            {app.platform}
                          </span>
                        </Badge> */}
              <span className="text-sm text-slate-600">
                {getScreenFiltered?.length ?? 0} screens
              </span>
            </div>
            <ScrollGalleryList
              screens={getScreenFiltered}
              handleClickImage={handleClickImage}
            />
          </div>
        </>
      )}
      <Lightbox
        open={openDetailImage}
        close={handleCloseImageDetail}
        slides={getListImageDetail}
        index={indexInitialImageOpen}
        className="z-[100]" // ⬅️ Lebih tinggi dari Dialog utama
      />
    </div>
  );
};
