import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { AppPublic, ScreenPublic } from "@/pages/Index";
import { RootState } from "@/provider/store";
import clsx from "clsx";
import {
  Download,
  ExternalLink,
  GitCompare,
  Globe,
  Heart,
  Monitor,
  Smartphone,
  Star,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import ImageWithFallback from "./ui/ImageWithFallback";

interface AppCardProps {
  app: AppPublic;
  viewMode: "grid" | "list";
  onLike: () => void;
  onClick: () => void;
  onAddToCompare?: () => void;
  isInCompare?: boolean;
  onDetail: () => void;
  setSelectedScreen: React.Dispatch<React.SetStateAction<ScreenPublic>>;
  type?: "favorite";
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  viewMode,
  onLike,
  onClick,
  onAddToCompare,
  isInCompare = false,
  onDetail,
  setSelectedScreen,
  type,
}) => {
  const user = useTypedSelector((state: RootState) => state.auth.user);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCompare?.();
  };

  if (viewMode === "list") {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl  overflow-hidden">
        <div className="flex p-4 lg:p-5">
          <div
            onClick={onDetail}
            className="flex-shrink-0 mr-4 lg:mr-6 hover:cursor-pointer"
          >
            <div className="relative">
              <ImageWithFallback
                src={app?.image ?? "https://source.unsplash.com/400x300?game"}
                fallbackSrc="https://placehold.co/400"
                alt={app.name}
                className="w-[114px] h-[72px] rounded-[8px] object-cover group-hover:scale-105 transition-transform"
              />
              {app.featured && (
                <div className="absolute -top-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3">
              <div className="flex-1 w-fit max-w-[300px] mb-2 lg:mb-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg lg:text-xl font-bold text-slate-900 truncate">
                    {app.name}
                  </h3>
                  {app.trending && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2 truncate">
                  {app.company}
                </p>
                <p className="text-sm text-slate-700 line-clamp-2">
                  {app.description}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {app.screens.slice(0, 4).map((screen) => (
                  <div
                    onClick={() => setSelectedScreen(screen)}
                    key={screen.id}
                    className="aspect-[9/16] rounded-lg overflow-hidden relative"
                  >
                    <img
                      src={screen.image}
                      alt={screen.name}
                      className="w-[200px] h-[200px] object-cover group-hover:scale-105 transition-transform duration-500 hover:cursor-pointer"
                    />
                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white p-2 text-xs">
                      {screen.name}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 lg:ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCompareClick}
                  className={`h-8 w-8 p-0 ${
                    isInCompare
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <GitCompare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike();
                  }}
                  className={clsx(
                    "h-8 w-8 p-0 hover:bg-red-50",
                    app.isLiked ? "!bg-[#9333EA] !text-white" : "text-slate-400"
                  )}
                >
                  {user ? (
                    <Heart className={"h-4 w-4"} />
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.3335 7.33333V4.66667C5.3335 3.95942 5.61445 3.28115 6.11454 2.78105C6.61464 2.28095 7.29292 2 8.00016 2C8.70741 2 9.38568 2.28095 9.88578 2.78105C10.3859 3.28115 10.6668 3.95942 10.6668 4.66667V7.33333M3.3335 8.66667C3.3335 8.31304 3.47397 7.97391 3.72402 7.72386C3.97407 7.47381 4.31321 7.33333 4.66683 7.33333H11.3335C11.6871 7.33333 12.0263 7.47381 12.2763 7.72386C12.5264 7.97391 12.6668 8.31304 12.6668 8.66667V12.6667C12.6668 13.0203 12.5264 13.3594 12.2763 13.6095C12.0263 13.8595 11.6871 14 11.3335 14H4.66683C4.31321 14 3.97407 13.8595 3.72402 13.6095C3.47397 13.3594 3.3335 13.0203 3.3335 12.6667V8.66667ZM7.3335 10.6667C7.3335 10.8435 7.40373 11.013 7.52876 11.1381C7.65378 11.2631 7.82335 11.3333 8.00016 11.3333C8.17697 11.3333 8.34654 11.2631 8.47157 11.1381C8.59659 11.013 8.66683 10.8435 8.66683 10.6667C8.66683 10.4899 8.59659 10.3203 8.47157 10.1953C8.34654 10.0702 8.17697 10 8.00016 10C7.82335 10 7.65378 10.0702 7.52876 10.1953C7.40373 10.3203 7.3335 10.4899 7.3335 10.6667Z"
                        stroke="black"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                </Button>

                <Link to={`/app/${app.id}`}>
                  <Button
                    size="sm"
                    className="bg-white/90 text-slate-900 hover:bg-white shadow-lg backdrop-blur-sm"
                  >
                    <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
                    <span className="text-xs lg:text-sm">View</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>{app.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>{app.downloads}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>{app.platform}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {app.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
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
        <div
          className="flex items-center gap-6 w-full hover:cursor-pointer relative"
          onClick={onDetail}
        >
          <ImageWithFallback
            src={app?.image ?? "https://source.unsplash.com/400x300?game"}
            fallbackSrc="https://placehold.co/400"
            alt={app.name}
            className="w-[114px] h-[72px] rounded-[8px] object-cover group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col items-start gap-1">
            <h5 className="font-['Inter'] not-italic font-bold text-[19.5px] leading-[28px] items-center text-[#0F172A]">
              {app.name}
            </h5>
            <h6 className="font-['Inter'] not-italic font-normal text-[13.2px] leading-[20px] flex items-center text-[#475569]">
              {app.company}
            </h6>
          </div>
          {type === "favorite" && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="absolute w-[32px] h-[32px] flex justify-center items-center hover:cursor-pointer right-0 z-[1000] rounded-full bg-[#EFF2FF]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.6667 3.99967V13.333C12.6667 13.6866 12.5262 14.0258 12.2761 14.2758C12.0261 14.5259 11.687 14.6663 11.3333 14.6663H4.66667C4.31304 14.6663 3.97391 14.5259 3.72386 14.2758C3.47381 14.0258 3.33333 13.6866 3.33333 13.333V3.99967M2 3.99967H14M5.33333 3.99967V2.66634C5.33333 2.31272 5.47381 1.97358 5.72386 1.72353C5.97391 1.47348 6.31304 1.33301 6.66667 1.33301H9.33333C9.68696 1.33301 10.0261 1.47348 10.2761 1.72353C10.5262 1.97358 10.6667 2.31272 10.6667 2.66634V3.99967"
                  stroke="#9333EA"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex flex-col w-full items-start gap-2">
          <div className="flex items-center h-[67px]">
            <p
              className="font-['Inter'] not-italic font-normal text-[14px] leading-[20px] text-[#334155] 
            overflow-hidden 
            text-ellipsis 
            break-words 
            [display:-webkit-box] 
            [-webkit-line-clamp:2] 
            [-webkit-box-orient:vertical]"
            >
              {app.description}
            </p>
          </div>
          <div className="flex flex-row justify-between w-full items-center gap-[8px]">
            <div className="flex items-center w-full justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.66675 6.33335C6.03494 6.33335 6.33341 6.03488 6.33341 5.66669C6.33341 5.2985 6.03494 5.00002 5.66675 5.00002C5.29856 5.00002 5.00008 5.2985 5.00008 5.66669C5.00008 6.03488 5.29856 6.33335 5.66675 6.33335Z"
                      fill="black"
                    />
                    <path
                      d="M5.66675 6.33335C6.03494 6.33335 6.33341 6.03488 6.33341 5.66669C6.33341 5.2985 6.03494 5.00002 5.66675 5.00002C5.29856 5.00002 5.00008 5.2985 5.00008 5.66669C5.00008 6.03488 5.29856 6.33335 5.66675 6.33335Z"
                      stroke="black"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.66675 4.66669V7.23935C2.66675 7.59735 2.80875 7.94069 3.06208 8.19402L8.47275 13.6047C8.59811 13.7301 8.74694 13.8295 8.91075 13.8974C9.07455 13.9652 9.25011 14.0002 9.42741 14.0002C9.60472 14.0002 9.78028 13.9652 9.94409 13.8974C10.1079 13.8295 10.2567 13.7301 10.3821 13.6047L13.6047 10.382C13.7301 10.2567 13.8296 10.1078 13.8974 9.94402C13.9653 9.78022 14.0002 9.60466 14.0002 9.42735C14.0002 9.25005 13.9653 9.07449 13.8974 8.91068C13.8296 8.74688 13.7301 8.59805 13.6047 8.47269L8.19341 3.06202C7.94037 2.80902 7.59724 2.66683 7.23941 2.66669H4.66675C4.13632 2.66669 3.62761 2.8774 3.25253 3.25247C2.87746 3.62755 2.66675 4.13625 2.66675 4.66669Z"
                      stroke="black"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p className="font-['Inter'] not-italic font-normal text-[13.3px] leading-[20px] flex items-center text-[#64748B]">
                    {app.category.name}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getPlatformIcon(app.platform)}
                  <p className="font-['Inter'] not-italic font-normal text-[13.3px] leading-[20px] flex items-center text-[#64748B]">
                    {app.platform}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {app.countries && app.countries.length > 0 ? (
                  <div className="flex items-center space-x-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66667 0C2.99067 0 0 2.99067 0 6.66667C0 10.3427 2.99067 13.3333 6.66667 13.3333C10.3427 13.3333 13.3333 10.3427 13.3333 6.66667C13.3333 2.99067 10.3427 0 6.66667 0ZM1.33333 6.66667C1.33333 6.06733 1.43733 5.492 1.62067 4.954L2.66667 6L4 7.33333V8.66667L5.33333 10L6 10.6667V11.954C3.374 11.624 1.33333 9.38133 1.33333 6.66667ZM10.8867 9.91533C10.4513 9.56467 9.79133 9.33333 9.33333 9.33333V8.66667C9.33333 8.31304 9.19286 7.97391 8.94281 7.72386C8.69276 7.47381 8.35362 7.33333 8 7.33333H5.33333V5.33333C5.68695 5.33333 6.02609 5.19286 6.27614 4.94281C6.52619 4.69276 6.66667 4.35362 6.66667 4V3.33333H7.33333C7.68695 3.33333 8.02609 3.19286 8.27614 2.94281C8.52619 2.69276 8.66667 2.35362 8.66667 2V1.726C10.6187 2.51867 12 4.43333 12 6.66667C11.9997 7.84311 11.608 8.98602 10.8867 9.91533Z"
                        fill="#475569"
                      />
                    </svg>
                    <span
                      className="font-['Inter'] not-italic font-normal text-[13.3px] leading-[20px] items-center text-[#64748B]  overflow-hidden 
            text-ellipsis 
            break-words 
            [display:-webkit-box] 
            [-webkit-line-clamp:1] 
            [-webkit-box-orient:vertical]"
                    >
                      {app.countries.join(", ")}
                    </span>
                  </div>
                ) : null}
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCompareClick}
                    className={`h-8 w-8 p-0 bg-white/90 backdrop-blur-sm ${
                      isInCompare
                        ? "bg-blue-100 text-blue-600"
                        : "hover:bg-white"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.66675 4H10.6667C11.0204 4 11.3595 4.14048 11.6096 4.39052C11.8596 4.64057 12.0001 4.97971 12.0001 5.33333V10"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.33333 12H5.33333C4.97971 12 4.64057 11.8595 4.39052 11.6095C4.14048 11.3594 4 11.0203 4 10.6667V6"
                        stroke="#020817"
                        stroke-width="1.33333"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </Button>
                  {type !== "favorite" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike();
                      }}
                      className={clsx(
                        "h-8 w-8 p-0 hover:bg-red-50",
                        app.isLiked
                          ? "!bg-[#9333EA] !text-white"
                          : "text-slate-400"
                      )}
                    >
                      {user ? (
                        <Heart className={"h-4 w-4"} />
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.3335 7.33333V4.66667C5.3335 3.95942 5.61445 3.28115 6.11454 2.78105C6.61464 2.28095 7.29292 2 8.00016 2C8.70741 2 9.38568 2.28095 9.88578 2.78105C10.3859 3.28115 10.6668 3.95942 10.6668 4.66667V7.33333M3.3335 8.66667C3.3335 8.31304 3.47397 7.97391 3.72402 7.72386C3.97407 7.47381 4.31321 7.33333 4.66683 7.33333H11.3335C11.6871 7.33333 12.0263 7.47381 12.2763 7.72386C12.5264 7.97391 12.6668 8.31304 12.6668 8.66667V12.6667C12.6668 13.0203 12.5264 13.3594 12.2763 13.6095C12.0263 13.8595 11.6871 14 11.3335 14H4.66683C4.31321 14 3.97407 13.8595 3.72402 13.6095C3.47397 13.3594 3.3335 13.0203 3.3335 12.6667V8.66667ZM7.3335 10.6667C7.3335 10.8435 7.40373 11.013 7.52876 11.1381C7.65378 11.2631 7.82335 11.3333 8.00016 11.3333C8.17697 11.3333 8.34654 11.2631 8.47157 11.1381C8.59659 11.013 8.66683 10.8435 8.66683 10.6667C8.66683 10.4899 8.59659 10.3203 8.47157 10.1953C8.34654 10.0702 8.17697 10 8.00016 10C7.82335 10 7.65378 10.0702 7.52876 10.1953C7.40373 10.3203 7.3335 10.4899 7.3335 10.6667Z"
                            stroke="black"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-4 flex items-start gap-[10px] overflow-x-auto">
        {app.screens.slice(0, 4).map((screen) => (
          // <div
          //   key={screen.id}
          //   className="aspect-[9/16] rounded-lg overflow-hidden relative"
          // >
          <img
            onClick={() => setSelectedScreen(screen)}
            src={screen.image}
            alt={screen.name}
            className="w-[190px] h-[417px] rounded-[8px] object-cover group-hover:scale-105 transition-transform duration-500 hover:cursor-pointer"
          />
          // </div>
        ))}
      </div>
    </div>
  );
};

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
