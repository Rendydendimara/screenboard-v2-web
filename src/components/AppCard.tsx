import React from "react";
import {
  Heart,
  Star,
  Download,
  Smartphone,
  ExternalLink,
  GitCompare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AppPublic } from "@/pages/Index";

interface AppCardProps {
  app: AppPublic;
  viewMode: "grid" | "list";
  onLike: () => void;
  onClick: () => void;
  onAddToCompare?: () => void;
  isInCompare?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  viewMode,
  onLike,
  onClick,
  onAddToCompare,
  isInCompare = false,
}) => {
  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCompare?.();
  };

  if (viewMode === "list") {
    return (
      <div
        className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <div className="flex p-4 lg:p-6">
          <div className="flex-shrink-0 mr-4 lg:mr-6">
            <div className="relative">
              <img
                src={app.image}
                alt={app.name}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover group-hover:scale-105 transition-transform"
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
              <div className="flex-1 min-w-0 mb-2 lg:mb-0">
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

              <div className="flex items-center space-x-2 lg:ml-4">
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
                  className="h-8 w-8 p-0 hover:bg-red-50"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      app.isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>{app.rating}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>{app.downloads}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>{app.platform}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {app.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white rounded-2xl lg:rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 aspect-[4/3]">
        <img
          src={app.image}
          alt={app.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 lg:top-4 left-3 lg:left-4 flex items-center space-x-2">
          {app.featured && (
            <Badge className="bg-yellow-500 text-white border-0 text-xs">
              Featured
            </Badge>
          )}
          {app.trending && (
            <Badge className="bg-green-500 text-white border-0 text-xs">
              Trending
            </Badge>
          )}
        </div>

        <div className="absolute top-3 lg:top-4 right-3 lg:right-4 flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCompareClick}
            className={`h-8 w-8 p-0 bg-white/90 backdrop-blur-sm ${
              isInCompare ? "bg-blue-100 text-blue-600" : "hover:bg-white"
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

        <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4">
          <Link to={`/app/${app.id}`}>
            <Button
              size="sm"
              className="bg-white/90 text-slate-900 hover:bg-white shadow-lg backdrop-blur-sm"
            >
              <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="text-xs lg:text-sm">View</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 truncate mb-1">
              {app.name}
            </h3>
            <p className="text-sm text-slate-600 truncate">{app.company}</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 mb-4 line-clamp-2">
          {app.description}
        </p>

        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>{app.rating}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{app.downloads}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>{app.platform}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {app.screens.slice(0, 4).map((screen) => (
            <div
              key={screen.id}
              className="aspect-[9/16] rounded-lg overflow-hidden relative"
            >
              <img
                src={screen.image}
                alt={screen.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white p-2 text-xs">
                {screen.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
