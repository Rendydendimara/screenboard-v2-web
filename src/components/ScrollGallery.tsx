import { ScreenPublic } from "@/pages/Index";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge";

type Props = {
  screens: ScreenPublic[];
  handleClickImage: (i: number) => void;
  hideInfo?: boolean;
  viewMode?: "grid" | "list";
  classNameFirstImage?: string;
};

const ScrollGallery = ({
  screens,
  handleClickImage,
  hideInfo = false,
  viewMode = "grid",
  classNameFirstImage,
}: Props) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 6, screens.length));
  }, [visibleCount, setVisibleCount, screens]);

  const visibleScreens = useMemo(() => {
    return screens.slice(0, visibleCount);
  }, [visibleCount, screens]);

  useEffect(() => {
    setVisibleCount(6);
  }, [screens]);

  return (
    <div
      className={clsx(
        "styled-scrollbar-black w-full",
        viewMode === "grid"
          ? "grid grid-cols-1 gap-2 max-h-[90vh] overflow-y-auto pb-4"
          : "flex items-center gap-2 overflow-x-auto"
      )}
    >
      {visibleScreens.map((screen, i) => (
        <div
          key={screen.id}
          className={clsx(
            "group cursor-pointer",
            i === 0 && classNameFirstImage
          )}
        >
          <div
            className={clsx(
              "bg-slate-100 rounded-lg overflow-hidden",
              // viewMode === "grid" ? "aspect-[9/16]" : "",
              !hideInfo && "mb-2",
              viewMode === "grid" ? "w-full h-full" : "w-[205px] h-[453px]"
            )}
          >
            <img
              src={screen.image}
              alt={screen.name}
              className={clsx(
                "rounded-[8px]", //  group-hover:scale-105 transition-transform hover:cursor-pointer
                viewMode === "grid"
                  ? "w-[328px] h-[723px]"
                  : "w-[205px] h-[453px]"
              )}
              onClick={() => handleClickImage(i)}
            />
          </div>
          {!hideInfo && (
            <div className="text-center">
              <p className="text-xs font-medium text-slate-900 truncate">
                {screen.name}
              </p>
              <Badge variant="outline" className="text-xs mt-1 mr-2">
                {screen.modul}
              </Badge>
              <Badge variant="outline" className="text-xs mt-1">
                {screen?.category?.name ?? "-"}
              </Badge>
            </div>
          )}
        </div>
      ))}

      {visibleCount < screens.length && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Load More (+{screens.length - visibleCount})
          </button>
        </div>
      )}

      {visibleScreens.length >= screens.length && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-400">
            Semua screen telah ditampilkan
          </span>
        </div>
      )}
    </div>
  );
};

export default ScrollGallery;

const ScrollGalleryList = ({ screens, handleClickImage }: Props) => {
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 6, screens.length));
  }, [visibleCount, setVisibleCount]);

  const visibleScreens = useMemo(() => {
    return screens.slice(0, visibleCount);
  }, [visibleCount, screens]);

  useEffect(() => {
    setVisibleCount(6);
  }, [screens]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {visibleScreens.map((screen, i) => (
        <div key={screen.id} className="group cursor-pointer">
          <div
            key={screen.id}
            className="aspect-[9/16] bg-slate-100 rounded overflow-hidden"
          >
            <img
              src={screen.image}
              alt={screen.name}
              className="w-full h-full object-cover hover:cursor-pointer"
              onClick={() => handleClickImage(i)}
            />
          </div>
        </div>
      ))}

      {visibleCount < screens.length && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            Load More (+{screens.length - visibleCount})
          </button>
        </div>
      )}

      {visibleScreens.length >= screens.length && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-400">
            Semua screen telah ditampilkan
          </span>
        </div>
      )}
    </div>
  );
};

export { ScrollGalleryList };
