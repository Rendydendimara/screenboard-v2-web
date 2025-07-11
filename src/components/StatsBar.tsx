
import React from 'react';
import { Smartphone, Star, TrendingUp, Layout } from 'lucide-react';

interface StatsBarProps {
  totalApps: number;
  featuredCount: number;
  trendingCount: number;
  totalScreens: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalApps,
  featuredCount,
  trendingCount,
  totalScreens,
}) => {
  const stats = [
    { icon: Smartphone, label: 'Total Apps', value: totalApps, color: 'text-blue-600' },
    { icon: Star, label: 'Featured', value: featuredCount, color: 'text-yellow-600' },
    { icon: TrendingUp, label: 'Trending', value: trendingCount, color: 'text-green-600' },
    { icon: Layout, label: 'Screens', value: totalScreens, color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`p-2 rounded-lg bg-white shadow-sm ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{stat.value.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
