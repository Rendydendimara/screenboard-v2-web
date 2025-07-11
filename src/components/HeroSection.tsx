
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Heart, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 lg:py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6 lg:mb-8">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 text-sm lg:text-base">
              <Sparkles className="h-4 w-4 mr-2" />
              Discover Amazing Apps
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Find Your Perfect
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
              App Experience
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 mb-8 lg:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Explore thousands of carefully curated mobile applications. 
            Compare features, discover UI patterns, and find inspiration for your next project.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 lg:mb-16 px-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 text-base lg:text-lg font-semibold w-full sm:w-auto"
            >
              <Heart className="h-5 w-5 mr-2" />
              View Favorites
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">1000+</div>
              <div className="text-sm lg:text-base text-slate-600">Apps Curated</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">50+</div>
              <div className="text-sm lg:text-base text-slate-600">Categories</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">5000+</div>
              <div className="text-sm lg:text-base text-slate-600">UI Screens</div>
            </div>
            <div className="text-center p-4 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center mb-2">
                <div className="text-2xl lg:text-3xl font-bold text-slate-900 mr-2">4.9</div>
                <Star className="h-5 w-5 lg:h-6 lg:w-6 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-sm lg:text-base text-slate-600">User Rating</div>
            </div>
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
    </section>
  );
};
