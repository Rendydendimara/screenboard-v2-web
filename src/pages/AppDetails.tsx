import UserAppAPI from "@/api/user/app/api";
import CModalDialogLoading from "@/components/modal-dialog-loading";
import { ScreenImageModal } from "@/components/ScreenImageModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils";
import { adapterSingleAppBEToFEPublic } from "@/utils/adapterBEToFE";
import {
  ArrowLeft,
  Building,
  Calendar,
  ChevronRight,
  ExternalLink,
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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppPublic, ScreenPublic } from "./Index";

const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedScreenCategory, setSelectedScreenCategory] =
    useState<string>("All");
  const [screenViewMode, setScreenViewMode] = useState<
    "grid" | "list" | "horizontal"
  >("grid");
  const [selectedScreen, setSelectedScreen] = useState<ScreenPublic | null>(
    null
  );
  const [app, setApp] = useState<AppPublic | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

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
    ...new Set(app?.screens.map((screen) => screen.category)),
  ];

  const filteredScreens =
    selectedScreenCategory === "All"
      ? app?.screens
      : app?.screens.filter(
          (screen) => screen.category === selectedScreenCategory
        );

  const groupedScreens = app?.screens.reduce((acc, screen) => {
    if (!acc[screen.category]) {
      acc[screen.category] = [];
    }
    acc[screen.category].push(screen);
    return acc;
  }, {} as Record<string, ScreenPublic[]>);

  const toggleLike = () => {
    toast({
      title: app?.isLiked ? "Removed from favorites" : "Added to favorites",
      description: `${app?.name} has been ${
        app?.isLiked ? "removed from" : "added to"
      } your favorites.`,
    });
  };

  const handleScreenChange = (newScreen: ScreenPublic) => {
    setSelectedScreen(newScreen);
  };

  const getAppDetail = async () => {
    setIsLoadingDetail(true);
    try {
      const res = await UserAppAPI.getDetail(id);
      const data = adapterSingleAppBEToFEPublic(res.data);
      setApp(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    getAppDetail();
  }, []);

  if (isLoadingDetail) {
    return (
      <div>
        <CModalDialogLoading isOpen={isLoadingDetail} onClose={() => null} />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            App Not Found
          </h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Apps
          </Button>
        </div>

        {/* App Overview */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={app.image}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: app.color }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {app.name}
                </h1>
                <div className="flex items-center space-x-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1 text-sm px-3 py-1"
                  >
                    {getPlatformIcon(app.platform)}
                    <span>{app.platform}</span>
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {app.category?.name ?? "-"}
                  </Badge>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {app.subcategory?.name ?? "-"}
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
                onClick={toggleLike}
                className="h-10"
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    app.isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {app.isLiked ? "Liked" : "Like"}
              </Button>
              <Button variant="outline" size="sm" className="h-10">
                <GitCompare className="h-4 w-4 mr-2" />
                Compare
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
        </div>

        {/* About Section */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-8">
          <h2 className="font-bold text-2xl mb-4 text-slate-900 border-b border-slate-200 pb-2">
            About {app.name}
          </h2>
          <p className="text-slate-700 leading-relaxed text-lg">
            {app.description}
          </p>
        </div>

        {/* App Screenshots */}
        <div className="mb-8">
          <h2 className="font-bold text-2xl mb-6 text-slate-900 border-b border-slate-200 pb-2">
            App Thumbnail
          </h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {app.screenshots.map((screenshot, index) => (
              <div key={index} className="flex-shrink-0">
                <img
                  src={getImageUrl(screenshot)}
                  alt={`Screenshot ${index + 1}`}
                  className="w-48 h-96 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* UI Screens Collection */}
        <div className="mb-8">
          <h2 className="font-bold text-2xl mb-6 text-slate-900 border-b border-slate-200 pb-2">
            UI Screens Collection
          </h2>

          {/* Scr Filters */}
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
              <Button
                variant={screenViewMode === "horizontal" ? "default" : "ghost"}
                size="sm"
                onClick={() => setScreenViewMode("horizontal")}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Screens Grid/List/Horizontal */}
          {screenViewMode === "horizontal" ? (
            <div className="space-y-8">
              {Object.entries(groupedScreens).map(([category, screens]) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                    <span>{category}</span>
                    <Badge variant="outline" className="text-sm">
                      {screens.length} screen{screens.length !== 1 ? "s" : ""}
                    </Badge>
                  </h3>
                  <ScrollArea className="w-full whitespace-nowrap rounded-lg">
                    <div className="flex w-max space-x-4 p-4">
                      {screens.map((screen) => (
                        <div
                          key={screen.id}
                          className="group cursor-pointer w-64 flex-shrink-0"
                          onClick={() => setSelectedScreen(screen)}
                        >
                          <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                            <div className="aspect-[9/16] overflow-hidden relative">
                              <img
                                src={screen.image}
                                alt={screen.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <p className="text-white text-sm line-clamp-3">
                                    {screen.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-slate-900 truncate">
                                  {screen.name}
                                </h4>
                                <Badge
                                  variant="outline"
                                  className="text-xs flex-shrink-0"
                                >
                                  {screen.modul}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-xs flex-shrink-0"
                                >
                                  {screen.category}
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
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              ))}
            </div>
          ) : (
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
                      <img
                        src={screen.image}
                        alt={screen.name}
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
                          {screen.modul}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {screen.category}
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
          )}
        </div>

        {/* App Tags */}
        <div className="mb-8">
          <h2 className="font-bold text-2xl mb-6 text-slate-900 border-b border-slate-200 pb-2">
            Related Tags
          </h2>
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

      {/* Scr Image Modal */}
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
    </div>
  );
};

export default AppDetails;
