import { Badge } from "@/components/ui/badge";
import React from "react";

interface IProps {
  onClickBtn: () => void;
  onClickExplore?: () => void;
  isLogin?: boolean;
}
export const HeroSectionModule: React.FC<IProps> = ({
  onClickBtn,
  onClickExplore,
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
          <div className="w-full justify-center flex items-start">
            <div className="w-full  max-w-[739px] flex flex-col items-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_621_9401)">
                  <path
                    d="M34.2859 20C35.4811 20.6199 36.5005 21.5315 37.2496 22.6503C37.9988 23.769 38.4535 25.0588 38.5716 26.4C38.5716 31.9143 30.2573 36.4 20.0001 36.4C9.743 36.4 1.42871 31.9429 1.42871 26.4286C1.54214 25.0823 1.99466 23.7867 2.74406 22.6626C3.49347 21.5385 4.51536 20.6225 5.71443 20"
                    stroke="#323638"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.6574 6.42858C5.9431 13.5714 17.3717 16.4286 11.6574 23.5714M20.0002 3.57144C14.286 10.7143 25.7145 19.2857 20.0002 26.4286M28.3431 6.42858C22.6288 13.5714 34.0574 16.4286 28.3431 23.5714"
                    stroke="#323638"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_621_9401">
                    <rect width="40" height="40" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="flex flex-col items-start gap-6 w-full">
                {/* Main Heading */}
                <h1 className="w-full  max-w-[739px] text-center md:w-[812px] h-auto md:h-[152px] leading-[32px] text-[32px] md:text-[64px] font-extrabold text-[#323638] md:leading-[72px] !tracking-[0%] align-middle font-secondary">
                  Explore Design Patterns by Module
                </h1>
                {/* Subtitle */}
                <p className="font-medium max-w-[739px] text-center text-[20px] leading-[100%]  md:text-xl text-[#464C4F] font-secondary md:!leading-[100%] tracking-[0%] align-middle w-full md:w-[832px]">
                  Browse product design patterns organized by modules like
                  onboarding, checkout, search, and more.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 mt-10 w-full">
                <div className="flex flex-col justify-center w-full md:flex-row items-center gap-5 ">
                  <Badge
                    onClick={isLogin ? onClickExplore : onClickBtn}
                    className="hover:cursor-pointer w-full md:w-auto z-20 bg-gradient-to-r md:h-[58px] rounded-[20px] from-blue-500 to-purple-600 border-0 px-8 py-3 flex justify-center items-center gap-2"
                  >
                    <svg
                      width="14"
                      height="19"
                      viewBox="0 0 14 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3.39913 0.5C3.53413 0.195833 3.83497 0 4.1683 0H10.8158C11.4408 0 11.8483 0.658333 11.5683 1.21833L9.67747 5H12.4758C13.2258 5 13.6008 5.90667 13.0708 6.43667L3.10997 16.3975C2.48164 17.0258 1.43497 16.3792 1.71664 15.5367L3.83997 9.16667H0.841635C0.701422 9.16666 0.563432 9.13163 0.440198 9.06475C0.316964 8.99787 0.212391 8.90126 0.135977 8.7837C0.0595628 8.66614 0.0137284 8.53135 0.00263747 8.39158C-0.00845349 8.2518 0.0155503 8.11147 0.0724683 7.98333L3.39913 0.5Z"
                        fill="#F8B303"
                      />
                    </svg>
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
                      className="font-bold text-[18px] w-full md:w-auto z-20  text-center text-[#1B1B1B] md:min-h-[58px] hover:bg-transparent hover:cursor-pointer  md:max-h-[58px] flex justify-center items-center  opacity-100 rounded-[20px] px-8 py-3  bg-[#FFFFFF] [box-shadow:0px_10px_15px_-3px_#0000001A]"
                    >
                      Explore
                    </button>
                  )}
                </div>
                {isLogin ? null : (
                  <p className="font-secondary text-center font-normal text-[14px] leading-[125%] tracking-[0%] text-[#565D61]">
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
