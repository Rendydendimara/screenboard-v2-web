
import React from 'react';
import { Star, Smartphone, Monitor, Globe, TrendingUp, Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface App {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  platform: 'iOS' | 'Android' | 'Both';
  trending: boolean;
  featured: boolean;
  screens: any[];
}

interface FilterSidebarProps {
  categories: string[];
  platforms: string[];
  selectedCategory: string;
  selectedPlatform: string;
  showFeatured: boolean;
  showTrending: boolean;
  onCategoryChange: (category: string) => void;
  onPlatformChange: (platform: string) => void;
  onFeaturedChange: (featured: boolean) => void;
  onTrendingChange: (trending: boolean) => void;
  apps: App[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  platforms,
  selectedCategory,
  selectedPlatform,
  showFeatured,
  showTrending,
  onCategoryChange,
  onPlatformChange,
  onFeaturedChange,
  onTrendingChange,
  apps,
}) => {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'iOS':
        return <Smartphone className="h-4 w-4" />;
      case 'Android':
        return <Monitor className="h-4 w-4" />;
      case 'Both':
        return <Globe className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return apps.length;
    return apps.filter(app => app.category === category).length;
  };

  const getPlatformCount = (platform: string) => {
    if (platform === 'All') return apps.length;
    return apps.filter(app => app.platform === platform).length;
  };

  const subcategories = apps
    .filter(app => selectedCategory === 'All' || app.category === selectedCategory)
    .reduce((acc, app) => {
      if (!acc.includes(app.subcategory)) {
        acc.push(app.subcategory);
      }
      return acc;
    }, [] as string[]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 sticky top-32 backdrop-blur-sm">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-md opacity-90"></div>
        </div>
        <h3 className="font-bold text-xl text-slate-900">Filters</h3>
      </div>
      
      {/* Quick Filters */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Quick Filters</h4>
        <div className="space-y-3">
          <Button
            variant={showFeatured ? "default" : "outline"}
            size="sm"
            onClick={() => onFeaturedChange(!showFeatured)}
            className="w-full justify-start h-11 rounded-xl"
          >
            <Star className="h-4 w-4 mr-3" />
            Featured Apps
            <Badge variant="secondary" className="ml-auto">
              {apps.filter(app => app.featured).length}
            </Badge>
          </Button>
          
          <Button
            variant={showTrending ? "default" : "outline"}
            size="sm"
            onClick={() => onTrendingChange(!showTrending)}
            className="w-full justify-start h-11 rounded-xl"
          >
            <TrendingUp className="h-4 w-4 mr-3" />
            Trending Now
            <Badge variant="secondary" className="ml-auto">
              {apps.filter(app => app.trending).length}
            </Badge>
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Categories */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => onCategoryChange(category)}
              className="w-full justify-start text-sm h-10 rounded-xl"
            >
              <span className="flex-1 text-left">{category}</span>
              <Badge variant="outline" className="text-xs">
                {getCategoryCount(category)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && selectedCategory !== 'All' && (
        <>
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Subcategories</h4>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((subcategory) => (
                <Badge key={subcategory} variant="outline" className="text-xs px-3 py-1 rounded-full">
                  {subcategory}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6" />
        </>
      )}

      {/* Platforms */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Platforms</h4>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? "default" : "ghost"}
              size="sm"
              onClick={() => onPlatformChange(platform)}
              className="w-full justify-start text-sm h-10 rounded-xl"
            >
              {getPlatformIcon(platform)}
              <span className="ml-3 flex-1 text-left">{platform}</span>
              <Badge variant="outline" className="text-xs">
                {getPlatformCount(platform)}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Insights */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Insights</h4>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Screens</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {apps.reduce((acc, app) => acc + app.screens.length, 0)}
          </p>
          <p className="text-xs text-blue-700 mt-1">Across all apps</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Updated</span>
          </div>
          <p className="text-sm font-semibold text-green-900">Daily</p>
          <p className="text-xs text-green-700 mt-1">Fresh content</p>
        </div>
      </div>
    </div>
  );
};
