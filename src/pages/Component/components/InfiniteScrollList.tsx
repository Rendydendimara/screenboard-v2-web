import { TGlobalComponentRes } from "@/api/user/globalComponent/type";
import clsx from "clsx";
import { memo, useCallback, useEffect, useRef } from "react";
import ComponentCard from "./ComponentCard";

interface InfiniteScrollListProps {
  components: TGlobalComponentRes[];
  onDetail: (appId: string) => void;
  hasMoreItems: boolean;
  loadMoreItems: () => void;
  isLoading?: boolean;
}

const InfiniteScrollListComponent = ({
  components,
  onDetail,
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
      rootMargin: "400px", // Load sebelum user sampai ke bottom
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
      <div className={clsx("w-full space-y-10")}>
        {components.map((component) => (
          <ComponentCard
            key={component._id}
            component={component}
            onDetail={onDetail}
          />
        ))}
      </div>

      {/* Intersection Observer Target - Only show if has more items */}
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

// Memoize component untuk mencegah re-render yang tidak perlu
export const InfiniteScrollList = memo(InfiniteScrollListComponent);
