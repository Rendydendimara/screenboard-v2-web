
import React from 'react';
import { Smartphone, Zap, TrendingUp, Globe } from 'lucide-react';

interface CategoryHeroProps {
  selectedCategory: string;
  totalApps: number;
}

export const CategoryHero: React.FC<CategoryHeroProps> = ({
  selectedCategory,
  totalApps,
}) => {
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'Music & Audio':
        return {
          icon: '🎵',
          gradient: 'from-purple-500 to-pink-500',
          description: 'Discover innovative music streaming and audio apps'
        };
      case 'Social Networking':
        return {
          icon: '👥',
          gradient: 'from-blue-500 to-cyan-500',
          description: 'Explore social platforms and communication apps'
        };
      case 'Finance':
        return {
          icon: '💳',
          gradient: 'from-green-500 to-emerald-500',
          description: 'Financial technology and payment solutions'
        };
      case 'Travel & Local':
        return {
          icon: '✈️',
          gradient: 'from-orange-500 to-red-500',
          description: 'Travel, accommodation, and local discovery apps'
        };
      case 'Productivity':
        return {
          icon: '⚡',
          gradient: 'from-indigo-500 to-purple-500',
          description: 'Tools for productivity and workspace management'
        };
      default:
        return {
          icon: '📱',
          gradient: 'from-slate-600 to-slate-800',
          description: 'Discover amazing mobile app designs and interfaces'
        };
    }
  };

  const categoryInfo = getCategoryInfo(selectedCategory);

  return (
    <div className="text-center mb-16">
      <div className="mb-8">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${categoryInfo.gradient} mb-6 shadow-lg`}>
          <span className="text-3xl">{categoryInfo.icon}</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
          {selectedCategory === 'All' ? (
            <>
              Discover Amazing
              <span className={`block bg-gradient-to-r ${categoryInfo.gradient} bg-clip-text text-transparent`}>
                Mobile Apps
              </span>
            </>
          ) : (
            <>
              <span className={`bg-gradient-to-r ${categoryInfo.gradient} bg-clip-text text-transparent`}>
                {selectedCategory}
              </span>
              <span className="block text-slate-700">Collection</span>
            </>
          )}
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {categoryInfo.description}
        </p>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-slate-500">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>{totalApps} Apps</span>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>iOS & Android</span>
          </div>
          <div className="h-4 w-px bg-slate-300"></div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Updated Daily</span>
          </div>
        </div>
      </div>
    </div>
  );
};
