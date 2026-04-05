import { Badge } from "@/components/ui/badge";
import React from "react";

interface IProps {
  onClickBtn: () => void;
  onClickExplore?: () => void;
  mainHeading: string;
  subtitle: string;
  isLogin?: boolean;
}
export const HeroSection: React.FC<IProps> = ({
  onClickBtn,
  onClickExplore,
  mainHeading,
  subtitle,
  isLogin,
}) => {
  return (
    <section className="py-10 md:py-12 lg:py-20 w-full min-h-[582px]  px-4 md:px-0 !pb-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="flex w-full justify-center items-center">
        <div className="max-w-[1200px] w-full">
          <div className="w-full justify-start flex items-start">
            <div className="w-full  max-w-[739px] flex flex-col items-start gap-[40px]">
              <div className="flex flex-col items-start gap-6 w-full">
                {/* Main Heading */}
                <h1 className="w-full md:w-[812px] h-auto md:h-[152px] leading-[32px] text-[32px] md:text-[64px] font-extrabold text-[#323638] md:leading-[72px] !tracking-[0%] align-middle font-secondary">
                  {mainHeading}
                </h1>
                {/* Subtitle */}
                <p className="font-medium max-w-[739px] text-[20px] leading-[100%]  md:text-xl text-[#464C4F] font-secondary md:!leading-[100%] tracking-[0%] align-middle w-full md:w-[832px]">
                  {subtitle}
                </p>
              </div>
              <div className="flex flex-col items-start w-full gap-3">
                <div className="flex flex-col justify-center md:justify-start w-full md:flex-row items-center gap-5 ">
                  <Badge
                    onClick={onClickBtn}
                    className="hover:cursor-pointer w-full md:w-auto z-20 bg-gradient-to-r md:h-[58px] rounded-[20px] from-blue-500 to-purple-600 border-0 px-8 py-3 flex justify-center items-center gap-2"
                  >
                    <div className="w-5 h-5">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.73666 2.16669C6.87166 1.86252 7.17249 1.66669 7.50583 1.66669H14.1533C14.7783 1.66669 15.1858 2.32502 14.9058 2.88502L13.015 6.66669H15.8133C16.5633 6.66669 16.9383 7.57335 16.4083 8.10335L6.44749 18.0642C5.81916 18.6925 4.77249 18.0459 5.05416 17.2034L7.17749 10.8334H4.17916C4.03895 10.8333 3.90096 10.7983 3.77772 10.7314C3.65449 10.6646 3.54992 10.5679 3.4735 10.4504C3.39709 10.3328 3.35125 10.198 3.34016 10.0583C3.32907 9.91849 3.35307 9.77816 3.40999 9.65002L6.73666 2.16669Z"
                          fill="#F8B303"
                        />
                      </svg>
                    </div>
                    {isLogin ? (
                      <p className="font-secondary font-bold text-[18px] text-[#FFFFFF]">
                        Explore
                      </p>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <p className="font-secondary font-bold text-[18px] text-[#FFFFFF]">
                          Join Membership
                        </p>
                        <p className="font-secondary font-[300] text-[12px] text-[#E1E1E1]">
                          Free Membership — This Month Only
                        </p>
                      </div>
                    )}
                  </Badge>
                  {isLogin ? null : (
                    <button
                      onClick={onClickExplore}
                      className="font-bold text-[18px] w-full md:w-auto z-20  text-center text-[#1B1B1B] md:min-h-[58px] hover:bg-transparent hover:cursor-pointer w-[114px] md:max-h-[58px] flex justify-center items-center  opacity-100 rounded-[20px] px-8 py-3  bg-[#FFFFFF] [box-shadow:0px_10px_15px_-3px_#0000001A]"
                    >
                      Explore
                    </button>
                  )}
                </div>
                {isLogin ? null : (
                  <p className="font-secondary font-normal text-[14px] leading-[125%] tracking-[0%] text-[#565D61]">
                    Get full access to the design gallery while the promotion
                    lasts.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-5 !left-[150px] opacity-20 animate-bounce delay-1000">
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_621_4998)">
            <rect x="24" y="24" width="80" height="80" rx="40" fill="#3B82F6" />
          </g>
          <defs>
            <filter
              id="filter0_f_621_4998"
              x="0"
              y="0"
              width="128"
              height="128"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12"
                result="effect1_foregroundBlur_621_4998"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="absolute top-1/4 left-4 sm:left-8 opacity-20 animate-bounce">
        <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-500 rounded-full"></div>
      </div>
      <div className="absolute top-3/4 right-4 sm:right-8 opacity-20 animate-bounce delay-1000">
        <div className="w-6 h-6 lg:w-10 lg:h-10 bg-purple-500 rounded-square rotate-45"></div>
      </div>
      <div className="absolute bottom-5 !left-[650px] sm:left-9 opacity-20 animate-bounce delay-1000">
        <svg
          width="144"
          height="144"
          viewBox="0 0 144 144"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_3_928)">
            <rect x="24" y="24" width="96" height="96" rx="48" fill="#6366F1" />
          </g>
          <defs>
            <filter
              id="filter0_f_3_928"
              x="0"
              y="0"
              width="144"
              height="144"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12"
                result="effect1_foregroundBlur_3_928"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="absolute top-1/4 right-2 sm:right-4 opacity-10 animate-bounce delay-1000">
        {/* <div className="bg-[rgba(168,_85,_247,_1)] backdrop-filter backdrop-blur-xl w-[128px] h-[128px] opacity-100 top-[160px] left-[1232px] rounded-full"></div> */}
        <svg
          width="176"
          height="176"
          viewBox="0 0 176 176"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_f_3_927)">
            <rect
              x="24"
              y="24"
              width="128"
              height="128"
              rx="64"
              fill="#A855F7"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_3_927"
              x="0"
              y="0"
              width="176"
              height="176"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="12"
                result="effect1_foregroundBlur_3_927"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </section>
  );
};
