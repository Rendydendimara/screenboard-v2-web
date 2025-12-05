import { Skeleton } from "@/components/ui/skeleton";

interface AppCardSkeletonProps {
  viewMode: "grid" | "list";
}

export const AppCardSkeleton: React.FC<AppCardSkeletonProps> = ({
  viewMode,
}) => {
  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex p-4 lg:p-5">
          {/* Image skeleton */}
          <div className="flex-shrink-0 mr-4 lg:mr-6">
            <Skeleton className="w-[114px] h-[72px] rounded-[8px]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3">
              <div className="flex-1 w-fit max-w-[300px] mb-2 lg:mb-0">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-32 mb-1" />
                {/* Company skeleton */}
                <Skeleton className="h-4 w-24 mb-2" />
                {/* Description skeleton */}
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Screens skeleton */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    className="w-[200px] min-w-[200px] h-[200px] rounded-lg"
                  />
                ))}
              </div>

              {/* Action buttons skeleton */}
              <div className="flex items-center space-x-2 lg:ml-4">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-16 rounded" />
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="flex items-center space-x-4 mb-3">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-5 gap-4 flex-col flex min-h-[680px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E2E8F0] rounded-[24px]">
      <div className="flex flex-col items-start gap-5 px-4">
        {/* Header section skeleton */}
        <div className="flex items-center gap-6 w-full">
          {/* App icon skeleton */}
          <Skeleton className="w-[114px] h-[72px] rounded-[8px]" />
          <div className="flex flex-col items-start gap-1">
            {/* App name skeleton */}
            <Skeleton className="h-7 w-32" />
            {/* Company name skeleton */}
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Description and actions section */}
        <div className="flex flex-col w-full items-start gap-2">
          {/* Description skeleton */}
          <div className="flex items-center h-[67px] w-full">
            <div className="w-full space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Bottom info skeleton */}
          <div className="flex flex-row justify-between w-full items-center gap-[8px]">
            <div className="flex items-center w-full justify-between gap-4 flex-col md:flex-row">
              <div className="flex items-center gap-4">
                {/* Category skeleton */}
                <Skeleton className="h-5 w-20" />
              </div>

              <div className="flex items-center gap-4">
                {/* Country skeleton */}
                <Skeleton className="h-5 w-24" />
                {/* Action buttons skeleton */}
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots skeleton */}
      <div className="pl-4 flex items-start gap-[10px] overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="w-[190px] min-w-[190px] h-[417px] rounded-[8px]"
          />
        ))}
      </div>
    </div>
  );
};
