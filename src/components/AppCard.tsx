import { Badge } from "@/components/ui/badge";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { AppPublic, ScreenPublic } from "@/pages/Home/useController";
import { RootState } from "@/provider/store";
import clsx from "clsx";
import { Globe, Heart, Monitor, Smartphone, Star } from "lucide-react";
import React from "react";
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
                className="w-[114px] h-[72px] rounded-[8px] object-contain group-hover:scale-105 transition-transform"
              />
              {app.featured && (
                <div className="absolute -top-2 -right-2 w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-start gap-3 justify-between mb-3">
              <div className="flex-1 w-fit max-w-[300px] mb-2 lg:mb-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-secondary not-italic font-bold text-[16px] leading-[28px] text-[#191919] truncate">
                    {app.name}
                  </h3>
                  {app.trending && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="font-secondary not-italic font-normal text-[12px] leading-[20px] text-[#475569] mb-2 truncate">
                  {app.company}
                </p>
                <p className="font-secondary not-italic font-normal text-[12px] leading-[20px] text-[#475569] line-clamp-2">
                  {app.description}
                </p>
              </div>

              <ScrollContainer
                horizontal
                vertical={false}
                className="flex items-center gap-2 overflow-y-auto max-w-[2000px]"
              >
                {app.screens.slice(0, 4).map((screen, i) => (
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
                    {i + 1 === 4 && (
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
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={handleCompareClick}
                className={clsx(
                  "h-4 w-4 p-0 bg-transparent",
                  isInCompare && "opacity-100"
                )}
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
                    stroke={isInCompare ? "#2563EB" : "#44546A"}
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                    stroke={isInCompare ? "#2563EB" : "#44546A"}
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.66667 4H10.6667C11.0203 4 11.3594 4.14048 11.6095 4.39052C11.8595 4.64057 12 4.97971 12 5.33333V10"
                    stroke={isInCompare ? "#2563EB" : "#44546A"}
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.33333 12H5.33333C4.97971 12 4.64057 11.8595 4.39052 11.6095C4.14048 11.3594 4 11.0203 4 10.6667V6"
                    stroke={isInCompare ? "#2563EB" : "#44546A"}
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
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
                    d="M5.66666 6.33329C6.03485 6.33329 6.33333 6.03482 6.33333 5.66663C6.33333 5.29844 6.03485 4.99996 5.66666 4.99996C5.29847 4.99996 5 5.29844 5 5.66663C5 6.03482 5.29847 6.33329 5.66666 6.33329Z"
                    fill="black"
                  />
                  <path
                    d="M5.66666 6.33329C6.03485 6.33329 6.33333 6.03482 6.33333 5.66663C6.33333 5.29844 6.03485 4.99996 5.66666 4.99996C5.29847 4.99996 5 5.29844 5 5.66663C5 6.03482 5.29847 6.33329 5.66666 6.33329Z"
                    stroke="#44546A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.66666 4.66663V7.23929C2.66666 7.59729 2.80866 7.94063 3.062 8.19396L8.47266 13.6046C8.59803 13.73 8.74686 13.8295 8.91066 13.8973C9.07446 13.9652 9.25003 14.0001 9.42733 14.0001C9.60463 14.0001 9.7802 13.9652 9.944 13.8973C10.1078 13.8295 10.2566 13.73 10.382 13.6046L13.6047 10.382C13.73 10.2566 13.8295 10.1078 13.8974 9.94396C13.9652 9.78016 14.0001 9.60459 14.0001 9.42729C14.0001 9.24999 13.9652 9.07443 13.8974 8.91062C13.8295 8.74682 13.73 8.59799 13.6047 8.47263L8.19333 3.06196C7.94029 2.80896 7.59716 2.66676 7.23933 2.66663H4.66666C4.13623 2.66663 3.62752 2.87734 3.25245 3.25241C2.87738 3.62749 2.66666 4.13619 2.66666 4.66663Z"
                    stroke="#44546A"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-secondary not-italic font-normal text-[12px] leading-[125%] flex items-center text-[#44546A]">
                  {app?.category?.name}
                </p>
              </div>
              <div>
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
                    <p className="text-[#44546A] font-secondary font-normal text-[12px] leading-[125%] overflow-hidden text-ellipsis break-words [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]">
                      {app.countries.length > 1
                        ? `${app.countries[0]} +${app.countries.length - 1}`
                        : app.countries.join(", ")}
                    </p>
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
            className="w-[48px] h-[48px] rounded-[8px] object-contain group-hover:scale-105 transition-transform"
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
