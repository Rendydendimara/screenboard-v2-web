import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { AppPublic, ScreenPublic } from "@/pages/Home/useController";
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
import ScrollContainer from "react-indiana-drag-scroll";

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
      <div className="group  bg-[#F6F6F6] rounded-[20px] border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl  overflow-hidden">
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
                containerClassName="min-w-[114px] h-[72px]"
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

              <div className="flex items-center gap-2 overflow-y-auto max-w-[2000px]">
                {app.screens.slice(0, 5).map((screen) => (
                  <div
                    onClick={() => setSelectedScreen(screen)}
                    key={screen.id}
                    className="rounded-lg relative h-[357px]"
                  >
                    <ImageWithFallback
                      src={screen.image}
                      fallbackSrc={screen.image}
                      alt={screen.name}
                      containerClassName="min-w-[200px] w-[200px] h-[357px]"
                      className="min-w-[200px] w-[200px] rounded-lg h-[357px] hover:cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center mb-3">
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
                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white"
              >
                <Heart
                  className={`h-4 w-4 ${
                    app.isLiked ? "fill-red-500 text-red-500" : "text-slate-600"
                  }`}
                />
              </Button>
            </div>
            <div className="flex items-center w-full gap-3 flex-col md:flex-row">
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
                  {app?.category?.name}
                </p>
              </div>
              <div>
                {app.countries && app.countries.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <div className="w-[14px] h-[14px]">
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
                    </div>
                    <span
                      className="font-['Inter'] not-italic font-normal text-[13.3px] leading-[20px] items-center text-[#64748B]  overflow-hidden 
            text-ellipsis 
            break-words 
            [display:-webkit-box] 
            [-webkit-line-clamp:1] 
            [-webkit-box-orient:vertical]"
                    >
                      {app.countries.length > 1
                        ? `${app.countries[0]} +${app.countries.length - 1}`
                        : app.countries.join(", ")}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-[1px] flex-col flex bg-[#F6F6F6]  rounded-[20px]">
      {/* Header */}
      <div className="w-full flex gap-2 flex-col py-4 pr-5 pb-2 pl-4">
        <div
          onClick={onDetail}
          className="flex items-center gap-3 hover:cursor-pointer"
        >
          <ImageWithFallback
            src={app?.image ?? "https://source.unsplash.com/400x300?game"}
            fallbackSrc="https://placehold.co/400"
            alt={app.name}
            containerClassName="w-[48px] h-[48px]"
            className="w-[48px] h-[48px] rounded-[8px] object-cover group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col items-start">
            <h5 className="font-secondary not-italic font-bold text-[16px] leading-[28px] items-center text-[#19191]9">
              {app.name}
            </h5>
            <h6 className="font-secondary not-italic font-normal text-[12px] leading-[20px] flex items-center text-[#475569]">
              {app.company}
            </h6>
          </div>
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-3">
            {/* Categories */}
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.66666 6.33329C6.03485 6.33329 6.33333 6.03482 6.33333 5.66663C6.33333 5.29844 6.03485 4.99996 5.66666 4.99996C5.29847 4.99996 5 5.29844 5 5.66663C5 6.03482 5.29847 6.33329 5.66666 6.33329Z"
                  fill="black"
                />
                <path
                  d="M5.66666 6.33329C6.03485 6.33329 6.33333 6.03482 6.33333 5.66663C6.33333 5.29844 6.03485 4.99996 5.66666 4.99996C5.29847 4.99996 5 5.29844 5 5.66663C5 6.03482 5.29847 6.33329 5.66666 6.33329Z"
                  stroke="#44546A"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2.66666 4.66663V7.23929C2.66666 7.59729 2.80866 7.94063 3.062 8.19396L8.47266 13.6046C8.59803 13.73 8.74686 13.8295 8.91066 13.8973C9.07446 13.9652 9.25003 14.0001 9.42733 14.0001C9.60463 14.0001 9.7802 13.9652 9.944 13.8973C10.1078 13.8295 10.2566 13.73 10.382 13.6046L13.6047 10.382C13.73 10.2566 13.8295 10.1078 13.8974 9.94396C13.9652 9.78016 14.0001 9.60459 14.0001 9.42729C14.0001 9.24999 13.9652 9.07443 13.8974 8.91062C13.8295 8.74682 13.73 8.59799 13.6047 8.47263L8.19333 3.06196C7.94029 2.80896 7.59716 2.66676 7.23933 2.66663H4.66666C4.13623 2.66663 3.62752 2.87734 3.25245 3.25241C2.87738 3.62749 2.66666 4.13619 2.66666 4.66663Z"
                  stroke="#44546A"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p className="font-secondary not-italic font-normal text-[12px] leading-[125%] flex items-center text-[#44546A]">
                {app?.category?.name}
              </p>
            </div>
            {/* Countries */}
            {app.countries && app.countries.length > 0 ? (
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1.33337C4.324 1.33337 1.33333 4.32404 1.33333 8.00004C1.33333 11.676 4.324 14.6667 8 14.6667C11.676 14.6667 14.6667 11.676 14.6667 8.00004C14.6667 4.32404 11.676 1.33337 8 1.33337ZM2.66667 8.00004C2.66667 7.40071 2.77067 6.82537 2.954 6.28737L4 7.33337L5.33333 8.66671V10L6.66667 11.3334L7.33333 12V13.2874C4.70733 12.9574 2.66667 10.7147 2.66667 8.00004ZM12.22 11.2487C11.7847 10.898 11.1247 10.6667 10.6667 10.6667V10C10.6667 9.64642 10.5262 9.30728 10.2761 9.05723C10.0261 8.80718 9.68695 8.66671 9.33333 8.66671H6.66667V6.66671C7.02029 6.66671 7.35943 6.52623 7.60947 6.27618C7.85952 6.02613 8 5.687 8 5.33337V4.66671H8.66667C9.02029 4.66671 9.35943 4.52623 9.60947 4.27618C9.85952 4.02613 10 3.687 10 3.33337V3.05937C11.952 3.85204 13.3333 5.76671 13.3333 8.00004C13.3331 9.17648 12.9414 10.3194 12.22 11.2487Z"
                    fill="#44546A"
                  />
                </svg>
                <p className="text-[#44546A] font-secondary font-normal text-[12px] leading-[125%]">
                  {app.countries.length > 1
                    ? `${app.countries[0]} +${app.countries.length - 1}`
                    : app.countries.join(", ")}
                </p>
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {/* Compare */}
            <button
              onClick={handleCompareClick}
              className={clsx("h-4 w-4 p-0 bg-transparent")}
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
                  stroke="#44546A"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                  stroke="#44546A"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.66667 4H10.6667C11.0203 4 11.3594 4.14048 11.6095 4.39052C11.8595 4.64057 12 4.97971 12 5.33333V10"
                  stroke="#44546A"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.33333 12H5.33333C4.97971 12 4.64057 11.8595 4.39052 11.6095C4.14048 11.3594 4 11.0203 4 10.6667V6"
                  stroke="#44546A"
                  stroke-width="1.33333"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="h-4 w-4 p-0 bg-transparent"
            >
              <Heart
                className={`h-4 w-4 ${
                  app.isLiked ? "fill-red-500 text-red-500" : "text-slate-600"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <ScrollContainer
        horizontal
        vertical={false}
        className="w-full gap-2  flex items-center pt-2 pr-4 pb-4 pl-4"
      >
        {app.screens.slice(0, 3).map((screen, i) => (
          <div className="relative w-[161px] aspect-[9/20] flex-shrink-0">
            <ImageWithFallback
              src={screen.image}
              fallbackSrc={screen.image}
              alt={screen.name}
              containerClassName="w-full h-full rounded-[10px] border-[0.5px] border-[solid] border-[#CECECE]"
              className="w-full h-full rounded-[10px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {i + 1 === 3 && (
              <div
                onClick={onDetail}
                className="absolute inset-0 hover:cursor-pointer flex justify-center items-center rounded-[10px] bg-[linear-gradient(180deg,_rgba(255,_255,_255,_0.3)_0%,_#FFFFFF_100%)] border-[0.5px] border-[solid] border-[#CECECE]"
              >
                <p className="font-secondary font-semibold text-[16px] leading-[100%] tracking-[0%] align-middle">
                  See More
                </p>
              </div>
            )}
          </div>
        ))}
      </ScrollContainer>
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
