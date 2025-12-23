import { AppPublic } from "@/pages/Home/useController";
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
import UserAppAPI from "@/api/user/app/api";
import { adapterSingleAppBEToFEPublic } from "@/utils/adapterBEToFE";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

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
  const [loadingGetDetail, setLoadingGetDetail] = useState(false);
  const [appDetail, setAppDetail] = useState<AppPublic>();
  const [indexInitialImageOpen, setIndexInitialImageOpen] = useState(0);
  const [selectedModuleFilter, setSelectedModulFilter] =
    useState<TSelect | null>(null);
  const [listCategory, setListCategory] = useState<TSelect[]>([]);
  const { toast } = useToast();

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
    if (appDetail) {
      const listImages: string[] = appDetail.screens.map((d) => d.image) ?? [];
      const slides = listImages.map((src) => ({ src }));
      return slides;
    }
    return [];
  }, [appDetail]);

  const getScreensCategory = (appDetail: AppPublic) => {
    const categories = Array.from(
      new Set(
        appDetail?.screens
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
    let result = appDetail?.screens;
    if (selectedModuleFilter?.value) {
      result = appDetail?.screens?.filter(
        (d) => d?.category?.name === selectedModuleFilter?.value
      );
    }
    return result ?? [];
  }, [selectedModuleFilter, appDetail?.screens]);

  const prevSlide = () =>
    setIndexInitialImageOpen((prev) =>
      prev === 0 ? getListImageDetail.length - 1 : prev - 1
    );

  const nextSlide = () =>
    setIndexInitialImageOpen((prev) =>
      prev === getListImageDetail.length - 1 ? 0 : prev + 1
    );

  const getDetailApp = async () => {
    try {
      setLoadingGetDetail(true);
      const res = await UserAppAPI.getDetail(app.id);
      const data = adapterSingleAppBEToFEPublic(res.data);
      setAppDetail(data);
      getScreensCategory(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoadingGetDetail(false);
    }
  };
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
    getDetailApp();
    // getScreensCategory();
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
          {loadingGetDetail ? (
            <div className="w-full flex rounded-2xl items-center gap-6 px-4 py-4 border border-solid border-[E0E1E1]">
              <div className="w-[122px] flex flex-col gap-8">
                <div className="flex flex-col items-end gap-[9px]">
                  <div className="flex flex-col items-end gap-4">
                    <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl" />
                    <div className="flex flex-col items-end gap-2 w-full">
                      <Skeleton className="h-5 lg:h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="w-full flex flex-col gap-2 max-h-[885px] overflow-y-auto">
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="w-full aspect-[9/16] rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex rounded-2xl items-center gap-6 px-4 border border-solid border-[E0E1E1]">
              <div className="w-[122px] flex flex-col gap-8">
                <div className="flex flex-col items-end gap-[9px]">
                  <div className="flex flex-col items-end gap-4">
                    <ImageWithFallback
                      src={
                        appDetail?.image ??
                        "https://source.unsplash.com/400x300?game"
                      }
                      fallbackSrc="https://placehold.co/400"
                      alt={appDetail?.name}
                      containerClassName="w-10 h-10 lg:w-12 lg:h-12"
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-contain flex-shrink-0"
                    />
                    <div className="flex flex-col items-end">
                      <h3 className="font-semibold text-base lg:text-lg text-right">
                        {appDetail?.name}
                      </h3>
                      <p className="text-sm text-right">{appDetail?.company}</p>
                    </div>
                  </div>
                  <p
                    onClick={() => onRemoveApp(appDetail?.id)}
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
              <div className="w-full flex flex-col gap-2 max-h-[885px] overflow-y-auto">
                <ScrollGallery
                  screens={getScreenFiltered}
                  handleClickImage={handleClickImage}
                  hideInfo
                  classNameFirstImage="mt-4"
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {loadingGetDetail ? (
            <div className="w-full flex rounded-2xl items-center gap-6 p-4 border border-solid border-[E0E1E1]">
              <div className="w-[122px] flex flex-col gap-8">
                <div className="flex flex-col items-end gap-[9px]">
                  <div className="flex flex-col items-end gap-4">
                    <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl" />
                    <div className="flex flex-col items-end gap-2 w-full">
                      <Skeleton className="h-5 lg:h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="w-full max-w-[846px] flex gap-2 h-[453px] overflow-x-auto">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-full w-[250px] rounded-2xl flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full flex rounded-2xl items-center gap-6 p-4 border border-solid border-[E0E1E1]">
              <div className="w-[122px] flex flex-col gap-8">
                <div className="flex flex-col items-end gap-[9px]">
                  <div className="flex flex-col items-end gap-4">
                    <ImageWithFallback
                      src={
                        appDetail?.image ??
                        "https://source.unsplash.com/400x300?game"
                      }
                      fallbackSrc="https://placehold.co/400"
                      alt={appDetail?.name}
                      containerClassName="w-10 h-10 lg:w-12 lg:h-12"
                      className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-contain flex-shrink-0"
                    />
                    <div className="flex flex-col items-end">
                      <h3 className="font-semibold text-base lg:text-lg text-right">
                        {appDetail?.name}
                      </h3>
                      <p className="text-sm text-right">{appDetail?.company}</p>
                    </div>
                  </div>
                  <p
                    onClick={() => onRemoveApp(appDetail?.id)}
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
          )}
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
              <ImageWithFallback
                src={getListImageDetail[indexInitialImageOpen].src}
                fallbackSrc={getListImageDetail[indexInitialImageOpen].src}
                className="max-h-[90vh] mx-auto rounded-lg"
                containerClassName="max-h-[90vh]"
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
