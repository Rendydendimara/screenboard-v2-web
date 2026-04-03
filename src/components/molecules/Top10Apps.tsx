import { AppPublic } from "@/pages/Home/useController";
import ScrollContainer from "react-indiana-drag-scroll";
import ImageWithFallback from "../ui/ImageWithFallback";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface IProps {
  apps: AppPublic[];
  isLoading?: boolean;
}

export const Top10Apps = ({ apps, isLoading }: IProps) => {
  return (
    <div className="h-[801px] gap-[32px] flex items-center flex-col py-[80px] bg-[linear-gradient(180deg,_#020202_0%,_#353535_100%)]">
      <div className="flex flex-col gap-4 items-center  px-[64px]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.33333 14.4V9.33333H6.66667V10.6667C6.66667 11.5111 6.91111 12.2724 7.4 12.9507C7.88889 13.6289 8.53333 14.112 9.33333 14.4ZM22.6667 14.4C23.4667 14.1111 24.1111 13.6276 24.6 12.9493C25.0889 12.2711 25.3333 11.5102 25.3333 10.6667V9.33333H22.6667V14.4ZM14.6667 25.3333V21.2C13.5778 20.9556 12.6058 20.4947 11.7507 19.8173C10.8956 19.14 10.2676 18.2898 9.86667 17.2667C8.2 17.0667 6.80578 16.3391 5.684 15.084C4.56222 13.8289 4.00089 12.3564 4 10.6667V9.33333C4 8.6 4.26133 7.97244 4.784 7.45067C5.30667 6.92889 5.93422 6.66756 6.66667 6.66667H9.33333C9.33333 5.93333 9.59467 5.30578 10.1173 4.784C10.64 4.26222 11.2676 4.00089 12 4H20C20.7333 4 21.3613 4.26133 21.884 4.784C22.4067 5.30667 22.6676 5.93422 22.6667 6.66667H25.3333C26.0667 6.66667 26.6947 6.928 27.2173 7.45067C27.74 7.97333 28.0009 8.60089 28 9.33333V10.6667C28 12.3556 27.4387 13.828 26.316 15.084C25.1933 16.34 23.7991 17.0676 22.1333 17.2667C21.7333 18.2889 21.1058 19.1391 20.2507 19.8173C19.3956 20.4956 18.4231 20.9564 17.3333 21.2V25.3333H21.3333C21.7111 25.3333 22.028 25.4613 22.284 25.7173C22.54 25.9733 22.6676 26.2898 22.6667 26.6667C22.6658 27.0436 22.5378 27.3604 22.2827 27.6173C22.0276 27.8742 21.7111 28.0018 21.3333 28H10.6667C10.2889 28 9.97244 27.872 9.71733 27.616C9.46222 27.36 9.33422 27.0436 9.33333 26.6667C9.33244 26.2898 9.46044 25.9733 9.71733 25.7173C9.97422 25.4613 10.2907 25.3333 10.6667 25.3333H14.6667Z"
            fill="#F8B303"
          />
        </svg>
        <div className="flex gap-1 flex-col items-center">
          <p
            className="
              text-[32px]
              font-bold
              font-secondary
              leading-none
              bg-gradient-to-r from-blue-600 to-purple-600
              bg-clip-text
              text-transparent
            "
          >
            Top 10 UI this month
          </p>
          <p className="text-[#B9B9B9] font-secondary font-medium text-[18px] leading-[100%] tracking-[0%]">
            Curated apps with cool design for this month
          </p>
        </div>
      </div>
      <ScrollContainer
        horizontal
        vertical={false}
        className="w-full flex gap-4 items-center px-6"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-[218px] shrink-0 rounded-[24px] pt-px pb-px bg-[#2B2828] animate-pulse"
              >
                <div className="flex w-full items-center gap-3 py-2 px-4">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-[#3a3a3a]" />
                  <div className="flex-1">
                    <div className="h-4 bg-[#3a3a3a] rounded mb-1 w-24" />
                    <div className="h-3 bg-[#3a3a3a] rounded w-16" />
                  </div>
                </div>
                <div className="pt-[8px] pr-[16px] pb-[16px] pl-[16px]">
                  <div className="w-[186px] h-[412px] rounded-[12px] bg-[#3a3a3a]" />
                </div>
              </div>
            ))
          : apps.map((app, i) => (
              <div
                key={i}
                className="w-[218px] min-h-[497px] max-h-[497px] rounded-[24px] pt-px pb-px bg-[#2B2828]"
              >
                <Link className="hover:cursor-pointer" to={`/app/${app.id}`}>
                  <div className="flex w-full items-center gap-3 py-2 px-4">
                    <div className="w-[32px] h-[32px]">
                      <ImageWithFallback
                        src={
                          app?.image ??
                          "https://source.unsplash.com/400x300?game"
                        }
                        fallbackSrc="https://placehold.co/400"
                        alt={app.name}
                        containerClassName="w-[32px] h-[32px]"
                        className="w-[32px] h-[32px] rounded-[8px] object-contain transition-transform"
                      />
                    </div>
                    <div className="max-w-[142px] min-w-0 overflow-hidden">
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <h5 className="font-secondary not-italic font-bold text-[16px] truncate leading-[28px] text-[#FFFFFF]">
                            {app.name}
                          </h5>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="center"
                          hidden={app.name.length < 19}
                        >
                          <h5 className="font-secondary not-italic font-bold text-[16px] truncate leading-[28px] text-black">
                            {app.name}
                          </h5>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                          <p className="font-secondary truncate not-italic font-normal text-[12px] text-[#CBCBCB]">
                            {app.company}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="center"
                          hidden={app.company.length < 20}
                        >
                          <p className="font-secondary truncate not-italic font-normal text-[12px] text-black">
                            {app.company}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </Link>
                <div className="min-w-[186px] h-full pt-[8px] pr-[16px] pb-[16px] pl-[16px]">
                  <ImageWithFallback
                    src={
                      app.screens[0]?.image ??
                      "https://source.unsplash.com/400x300?game"
                    }
                    fallbackSrc={"https://source.unsplash.com/400x300?game"}
                    containerClassName="min-w-[186px] min-h-[412px]  max-h-[412px] rounded-[12px]"
                    className="min-w-[186px] min-h-[412px]  max-h-[412px] object-cover rounded-[12px]"
                  />
                </div>
              </div>
            ))}
      </ScrollContainer>
    </div>
  );
};
