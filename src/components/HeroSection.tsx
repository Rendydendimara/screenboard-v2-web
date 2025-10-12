import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Heart, Star } from "lucide-react";

export const HeroSection: React.FC = ({
  handleStartExploring,
}: {
  handleStartExploring: () => void;
}) => {
  return (
    <section className="py-12 lg:py-20 container px-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full">
        <div className="w-[786px] flex flex-col items-start gap-8">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-[72px] tracking-[0%] align-middle">
            Simple Site That Enhance Design Journey
          </h1>
          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-[Inter] font-normal sm:!leading-[32px] tracking-[0%] align-middle w-[650px]">
            Explore thousands of carefully curated mobile applications. Compare
            features, discover UI patterns, and find inspiration for your next
            project.
          </p>

          {/* Badge */}
          <div
            onClick={handleStartExploring}
            className="flex justify-center mb-6 lg:mb-8 hover:!cursor-pointer z-[10]"
          >
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm lg:text-base">
              <Zap className="h-5 w-5 mr-2" />
              Start Exploring
            </Badge>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
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
