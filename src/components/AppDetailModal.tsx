import { FlowchartModal } from "@/components/FlowchartModal";
import { ScreenImageModal } from "@/components/ScreenImageModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  GitBranch,
  GitCompare,
  Globe,
  Grid3X3,
  Heart,
  List,
  Monitor,
  Share2,
  Smartphone,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import ImageWithFallback from "./ui/ImageWithFallback";

interface Screen {
  id: string;
  name: string;
  category?: {
    _id: string;
    name: string;
  };
  image: string;
  description: string;
}

interface App {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  image: string;
  screenshots: string[];
  screens: Screen[];
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  isLiked: boolean;
  featured: boolean;
  trending: boolean;
  company: string;
  lastUpdated: string;
}

interface AppDetailModalProps {
  app: App;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onAddToCompare: () => void;
  isInCompare: boolean;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  isOpen,
  onClose,
  onLike,
  onAddToCompare,
  isInCompare,
}) => {
  const [selectedScreenCategory, setSelectedScreenCategory] =
    useState<string>("All");
  const [screenViewMode, setScreenViewMode] = useState<"grid" | "list">("grid");
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [showUserFlow, setShowUserFlow] = useState(false);

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

  const screenCategories = [
    "All",
    ...new Set(app.screens.map((screen) => screen?.category?.name)),
  ];

  const filteredScreens =
    selectedScreenCategory === "All"
      ? app.screens
      : app.screens.filter(
          (screen) => screen?.category?.name === selectedScreenCategory
        );

  const groupedScreens = app.screens.reduce((acc, screen) => {
    if (!acc[screen?.category?.name]) {
      acc[screen?.category?.name] = [];
    }
    acc[screen?.category?.name].push(screen);
    return acc;
  }, {} as Record<string, Screen[]>);

  const handleScreenChange = (newScreen: Screen) => {
    setSelectedScreen(newScreen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={
                      app?.image ?? "https://source.unsplash.com/400x300?game"
                    }
                    fallbackSrc="https://placehold.co/400"
                    alt={app.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: app.color }}
                />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold text-slate-900 mb-2">
                  {app.name}
                </DialogTitle>
                <DialogDescription className="text-lg text-slate-600 mb-3">
                  Detailed overview of {app.name} - {app.category} app by{" "}
                  {app.company}
                </DialogDescription>

                <div className="flex items-center space-x-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1 text-sm px-3 py-1"
                  >
                    {getPlatformIcon(app.platform)}
                    <span>{app.platform}</span>
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {app.category}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {app.subcategory}
                  </Badge>
                  {app.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{app.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated {new Date(app.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUserFlow(true)}
                className="h-10"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                User Flow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLike}
                className="h-10"
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    app.isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {app.isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                variant={isInCompare ? "default" : "outline"}
                size="sm"
                onClick={onAddToCompare}
                className="h-10"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                {isInCompare ? "In Compare" : "Compare"}
              </Button>
              <Button variant="outline" size="sm" className="h-10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="h-10">
                <ExternalLink className="h-4 w-4 mr-2" />
                View App
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-8">
          {/* App Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="font-bold text-2xl text-blue-900">
                {app.rating}
              </div>
              <div className="text-sm text-blue-700">App Rating</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <Download className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="font-bold text-2xl text-green-900">
                {app.downloads}
              </div>
              <div className="text-sm text-green-700">Downloads</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <Eye className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="font-bold text-2xl text-purple-900">
                {app?.screens?.length ?? 0}
              </div>
              <div className="text-sm text-purple-700">Screens</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-3 border-2 border-white shadow-lg"
                style={{ backgroundColor: app.color }}
              />
              <div className="font-bold text-sm text-orange-900">Brand</div>
              <div className="text-sm text-orange-700">Identity</div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-8">
            <h3 className="font-bold text-xl mb-4 text-slate-900">
              About {app.name}
            </h3>
            <p className="text-slate-700 leading-relaxed text-lg">
              {app.description}
            </p>
          </div>

          {/* Screen Filters */}
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-slate-700">
                  Category:
                </span>
                <div className="flex flex-wrap gap-2">
                  {screenCategories.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedScreenCategory === category
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedScreenCategory(category)}
                      className="h-8 text-xs"
                    >
                      {category}
                      {category !== "All" && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {groupedScreens[category]?.length || 0}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center bg-white rounded-lg p-1">
              <Button
                variant={screenViewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setScreenViewMode("grid")}
                className="h-7 w-7 p-0"
              >
                <Grid3X3 className="h-3 w-3" />
              </Button>
              <Button
                variant={screenViewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setScreenViewMode("list")}
                className="h-7 w-7 p-0"
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Screens Grid/List */}
          <div
            className={`grid gap-6 ${
              screenViewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredScreens.map((screen) => (
              <div
                key={screen.id}
                className="group cursor-pointer"
                onClick={() => setSelectedScreen(screen)}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="aspect-[9/16] overflow-hidden relative">
                    <ImageWithFallback
                      src={screen.image}
                      fallbackSrc={screen.image}
                      alt={screen.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm">
                          {screen.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900">
                        {screen.name}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {screen?.category?.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {screen.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-8">
            <h3 className="font-bold text-xl mb-4 text-slate-900">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {app.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-4 py-2 text-sm rounded-full"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>

      {/* User Flow Modal */}
      {showUserFlow && (
        <FlowchartModal
          isOpen={showUserFlow}
          onClose={() => setShowUserFlow(false)}
          screens={app.screens}
        />
      )}

      {/* Screen Image Modal */}
      {selectedScreen && (
        <ScreenImageModal
          screen={selectedScreen}
          isOpen={!!selectedScreen}
          onClose={() => setSelectedScreen(null)}
          onImageUpdate={(newImage) => {}}
          allScreens={filteredScreens}
          onScreenChange={handleScreenChange}
        />
      )}
    </Dialog>
  );
};
