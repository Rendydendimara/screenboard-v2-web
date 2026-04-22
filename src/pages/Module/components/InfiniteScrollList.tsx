import { TModulRes } from "@/api/user/modul/type";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import clsx from "clsx";
import { memo, useCallback, useEffect, useRef } from "react";
import CardModule from "./CardModule";

interface InfiniteScrollListProps {
  moduls: TModulRes[];
  hasMoreItems: boolean;
  loadMoreItems: () => void;
  isLoading?: boolean;
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

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
      <motion.div
        className={clsx(
          "w-full mb-20",
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        )}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.07 } },
        }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={index} variants={cardVariant}>
                <Skeleton className="h-[200px] w-full rounded-[20px]" />
              </motion.div>
            ))
          : moduls.map((modul, index) => (
              <motion.div key={modul._id} variants={cardVariant}>
                <CardModule modul={modul} index={index} />
              </motion.div>
            ))}
      </motion.div>

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
