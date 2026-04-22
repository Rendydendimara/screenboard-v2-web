import { AppCard } from "@/components/AppCard";
import { AppPublic, ScreenPublic } from "../useController";
import { useEffect, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface InfiniteScrollListProps {
  apps: AppPublic[];
  viewMode: "grid" | "list";
  onLike: (appId: string, isLiked: boolean) => void;
  onAppClick: (app: AppPublic) => void;
  onDetail: (appId: string) => void;
  onAddToCompare: (app: AppPublic) => void;
  compareApps: AppPublic[];
  setSelectedScreen: (screen: ScreenPublic | null) => void;
  hasMoreItems: boolean;
  loadMoreItems: () => void;
  isLoading?: boolean;
}

const InfiniteScrollListComponent = ({
  apps,
  viewMode,
  onLike,
  onAppClick,
  onDetail,
  onAddToCompare,
  compareApps,
  setSelectedScreen,
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
      <motion.div
        className={clsx(
          "w-full",
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
            : "space-y-4 lg:space-y-8"
        )}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {apps.map((app) => (
          <motion.div
            key={app.id}
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            <AppCard
              app={app}
              viewMode={viewMode}
              onLike={() => onLike(app.id, app.isLiked)}
              onClick={() => onAppClick(app)}
              onDetail={() => onDetail(app.id)}
              onAddToCompare={() => onAddToCompare(app)}
              isInCompare={compareApps.some(
                (compareApp) => compareApp.id === app.id
              )}
              setSelectedScreen={setSelectedScreen}
            />
          </motion.div>
        ))}
      </motion.div>

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
