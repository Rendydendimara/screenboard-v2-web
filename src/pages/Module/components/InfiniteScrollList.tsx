import { TModulRes } from "@/api/user/modul/type";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";
import { memo, useCallback, useEffect, useRef } from "react";
import CardModule from "./CardModule";

interface InfiniteScrollListProps {
  moduls: TModulRes[];
  hasMoreItems: boolean;
  loadMoreItems: () => void;
  isLoading?: boolean;
}

const InfiniteScrollListComponent = ({
  moduls,
  hasMoreItems,
  loadMoreItems,
  isLoading = false,
}: InfiniteScrollListProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMoreItems && !isLoading) {
        loadMoreItems();
      }
    },
    [hasMoreItems, loadMoreItems, isLoading]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: "400px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  return (
    <>
      <div
        className={clsx(
          "w-full mb-20",
          "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        )}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[120px] w-full rounded-[16px]" />
            ))
          : moduls.map((modul) => (
              <CardModule key={modul._id} modul={modul} />
            ))}
      </div>

      {/* Intersection Observer Target */}
      {hasMoreItems && (
        <div
          ref={observerTarget}
          className="w-full h-10 flex items-center justify-center mt-4"
        >
          <div className="text-sm text-slate-500">Loading more...</div>
        </div>
      )}
    </>
  );
};

export const InfiniteScrollList = memo(InfiniteScrollListComponent);
