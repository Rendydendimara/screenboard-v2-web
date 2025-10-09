import { AppPublic } from "@/pages/Index";
import { TSelect } from "@/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import ScrollGallery from "./ScrollGallery";
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
  onLightboxOpenChange?: (isOpen: boolean) => void;
}

export const AppCardCompare: React.FC<AppCardProps> = ({
  app,
  viewMode,
  onRemoveApp,
  onLightboxOpenChange,
}) => {
  const [openDetailImage, setOpenDetailImage] = useState(false);
  const [indexInitialImageOpen, setIndexInitialImageOpen] = useState(0);
  const [selectedModuleFilter, setSelectedModulFilter] =
    useState<TSelect | null>(null);
  const [listCategory, setListCategory] = useState<TSelect[]>([]);

  const handleClickImage = useCallback(
    (i: number) => {
      setIndexInitialImageOpen(i);
      setOpenDetailImage(true);
      onLightboxOpenChange?.(true);
    },
    [onLightboxOpenChange]
  );

  const handleCloseImageDetail = useCallback(() => {
    setOpenDetailImage(false);
    onLightboxOpenChange?.(false);
  }, [onLightboxOpenChange]);

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

  const prevSlide = () =>
    setIndexInitialImageOpen((prev) =>
      prev === 0 ? getListImageDetail.length - 1 : prev - 1
    );

  const nextSlide = () =>
    setIndexInitialImageOpen((prev) =>
      prev === getListImageDetail.length - 1 ? 0 : prev + 1
    );

  // Keyboard navigation
  useEffect(() => {
    if (!openDetailImage) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.stopPropagation();
        prevSlide();
      }
      if (e.key === "ArrowRight") {
        e.stopPropagation();
        nextSlide();
      }
      if (e.key === "Escape") {
        e.stopPropagation();
        handleCloseImageDetail();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openDetailImage]);

  useEffect(() => {
    getScreensCategory();
  }, []);

  return (
    <div
      key={app.id}
      className={`overflow-hidden ${
        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      {viewMode === "grid" ? (
        <>
          <div className="w-full flex rounded-2xl items-center gap-6 px-4 border border-solid border-[E0E1E1]">
            <div className="w-[122px] flex flex-col gap-8">
              <div className="flex flex-col items-end gap-[9px]">
                <div className="flex flex-col items-end gap-4">
                  <ImageWithFallback
                    src={
                      app?.image ?? "https://source.unsplash.com/400x300?game"
                    }
                    fallbackSrc="https://placehold.co/400"
                    alt={app.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col items-end">
                    <h3 className="font-semibold text-base lg:text-lg text-right">
                      {app.name}
                    </h3>
                    <p className="text-sm text-right">{app.company}</p>
                  </div>
                </div>
                <p
                  onClick={() => onRemoveApp(app.id)}
                  className="hover:cursor-pointer font-[Inter] font-normal text-[14px] leading-[155%] tracking-[-0.2%] align-middle underline [text-decoration-style:solid] [text-decoration-skip-ink:auto]"
                >
                  Remove
                </p>
              </div>

              <div className="flex-1 sm:flex-none sm:min-w-[122px]">
                <Select
                  value={selectedModuleFilter?.value}
                  onValueChange={handleChangeModul}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="All category" />
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
                    {listCategory.map((category, i) => (
                      <SelectItem
                        className="!items-start !py-[9px] !px-2 truncate"
                        key={i}
                        value={category.value}
                        isRemoveCheckIndocator
                        withRoundedEdge
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-[328px] flex flex-col gap-2 max-h-[885px] overflow-y-auto">
              <ScrollGallery
                screens={getScreenFiltered}
                handleClickImage={handleClickImage}
                hideInfo
                classNameFirstImage="mt-4"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex rounded-2xl items-center gap-6 p-4 border border-solid border-[E0E1E1]">
            <div className="w-[122px] flex flex-col gap-8">
              <div className="flex flex-col items-end gap-[9px]">
                <div className="flex flex-col items-end gap-4">
                  <ImageWithFallback
                    src={
                      app?.image ?? "https://source.unsplash.com/400x300?game"
                    }
                    fallbackSrc="https://placehold.co/400"
                    alt={app.name}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col items-end">
                    <h3 className="font-semibold text-base lg:text-lg text-right">
                      {app.name}
                    </h3>
                    <p className="text-sm text-right">{app.company}</p>
                  </div>
                </div>
                <p
                  onClick={() => onRemoveApp(app.id)}
                  className="hover:cursor-pointer font-[Inter] font-normal text-[14px] leading-[155%] tracking-[-0.2%] align-middle underline [text-decoration-style:solid] [text-decoration-skip-ink:auto]"
                >
                  Remove
                </p>
              </div>

              <div className="flex-1 sm:flex-none sm:min-w-[122px]">
                <Select
                  value={selectedModuleFilter?.value}
                  onValueChange={handleChangeModul}
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="All category" />
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
                    {listCategory.map((category, i) => (
                      <SelectItem
                        className="!items-start !py-[9px] !px-2 truncate"
                        key={i}
                        value={category.value}
                        isRemoveCheckIndocator
                        withRoundedEdge
                      >
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="w-full max-w-[846px] flex gap-2 h-[453px] overflow-x-auto">
              <ScrollGallery
                viewMode={viewMode}
                screens={getScreenFiltered}
                handleClickImage={handleClickImage}
                hideInfo
              />
            </div>
          </div>
        </>
      )}

      {/* Lightbox */}
      {openDetailImage &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-[999999] bg-black/90 flex items-center justify-center pointer-events-auto">
            {/* Close button */}
            <button
              onClick={handleCloseImageDetail}
              className="absolute z-[100000] top-10 right-10 text-white text-2xl"
            >
              <FaTimes />
            </button>

            {/* Prev button */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white"
            >
              <FaChevronLeft size={20} />
            </button>

            {/* Next button */}
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white"
            >
              <FaChevronRight size={20} />
            </button>

            {/* Image */}
            <div className="text-center max-w-4xl px-4">
              <img
                src={getListImageDetail[indexInitialImageOpen].src}
                // alt={getListImageDetail[indexInitialImageOpen].title}
                className="max-h-[90vh] mx-auto rounded-lg"
              />
              {/* <h3 className="mt-4 text-xl font-semibold text-white">
                    {getListImageDetail[indexInitialImageOpen].title}
                  </h3> */}
              {/* <p className="text-gray-300 text-sm">{getListImageDetail[indexInitialImageOpen].caption}</p> */}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
