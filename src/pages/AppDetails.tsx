import CModalDialogLoading from "@/components/modal-dialog-loading";
import { ScreenImageModal } from "@/components/ScreenImageModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
import UserAppAPI from "@/api/user/app/api";
import { adapterSingleAppBEToFEPublic } from "@/utils/adapterBEToFE";
import { getImageUrl } from "@/utils";

// interface Screen {
//   id: string;
//   name: string;
//   category: string;
//   image: string;
//   description: string;
// }

// interface App {
//   id: number;
//   name: string;
//   category: string;
//   subcategory: string;
//   platform: 'iOS' | 'Android' | 'Both';
//   image: string;
//   screenshots: string[];
//   screens: Screen[];
//   description: string;
//   downloads: string;
//   rating: number;
//   tags: string[];
//   color: string;
//   isLiked: boolean;
//   featured: boolean;
//   trending: boolean;
//   company: string;
//   lastUpdated: string;
// }

// Expanded mock data with more apps and detailed content
// const mockApps: App[] = [
//   {
//     id: 1,
//     name: "Spotify",
//     category: "Music & Audio",
//     subcategory: "Music Streaming",
//     platform: "Both",
//     image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=400&h=300&fit=crop",
//     screenshots: [
//       "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop&brightness=0.8",
//       "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop&contrast=1.2"
//     ],
//     screens: [
//       { id: "1", name: "Home Feed", category: "Discovery", image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=600&fit=crop", description: "Main discovery interface with personalized recommendations based on your listening history and preferences" },
//       { id: "2", name: "Search Results", category: "Discovery", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop", description: "Comprehensive search results for music, artists, albums, playlists, and podcasts with smart filtering" },
//       { id: "3", name: "Browse Categories", category: "Discovery", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=600&fit=crop", description: "Browse music by genre, mood, activity, and curated collections from Spotify editors" },
//       { id: "4", name: "New Releases", category: "Discovery", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop&brightness=0.8", description: "Latest music releases, new albums, and trending tracks updated weekly" },
//       { id: "5", name: "Daily Mix", category: "Discovery", image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=600&fit=crop&saturation=1.2", description: "Personalized daily music mixes combining your favorite tracks with new discoveries" },
//       { id: "6", name: "Player Interface", category: "Playback", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop&contrast=1.2", description: "Full-screen music player with lyrics, queue management, and social sharing features" },
//       { id: "7", name: "Queue Management", category: "Playback", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=600&fit=crop&brightness=0.9", description: "Manage your playing queue, reorder tracks, and see what's coming up next" },
//       { id: "8", name: "Playlist Creation", category: "Library", image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=600&fit=crop&hue=30", description: "Create and customize playlists with drag-and-drop functionality and smart suggestions" },
//       { id: "9", name: "Your Library", category: "Library", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop&sepia=0.3", description: "Access all your saved music, playlists, podcasts, and recently played content" },
//       { id: "10", name: "Profile Settings", category: "Profile", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=600&fit=crop&saturation=0.8", description: "Customize your profile, privacy settings, and social sharing preferences" },
//       { id: "11", name: "Friend Activity", category: "Social", image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=600&fit=crop&brightness=1.1", description: "See what your friends are listening to and discover music through social connections" },
//       { id: "12", name: "Collaborative Playlists", category: "Social", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop&contrast=0.8", description: "Create and manage collaborative playlists with friends and family members" }
//     ],
//     description: "Spotify is a comprehensive music streaming platform that offers millions of songs, podcasts, and playlists. With advanced recommendation algorithms, social features, and cross-platform synchronization, it provides a personalized audio experience. The app features high-quality streaming, offline downloads, and seamless integration across all your devices. Whether you're discovering new artists or enjoying your favorite tracks, Spotify adapts to your taste and lifestyle.",
//     downloads: "1B+",
//     rating: 4.8,
//     tags: ["Music", "Streaming", "Social", "Playlists", "Podcasts", "Discovery", "Audio", "Entertainment"],
//     color: "#1DB954",
//     isLiked: false,
//     featured: true,
//     trending: true,
//     company: "Spotify Technology S.A.",
//     lastUpdated: "2024-01-15"
//   },
//   {
//     id: 2,
//     name: "Instagram",
//     category: "Social",
//     subcategory: "Photo Sharing",
//     platform: "Both",
//     image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop",
//     screenshots: [
//       "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=300&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=600&fit=crop"
//     ],
//     screens: [
//       { id: "13", name: "Feed", category: "Discovery", image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=300&h=600&fit=crop", description: "Personalized photo and video feed from accounts you follow" },
//       { id: "14", name: "Stories", category: "Content", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=600&fit=crop", description: "View and create temporary stories that disappear after 24 hours" },
//       { id: "15", name: "Camera", category: "Creation", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=600&fit=crop", description: "Built-in camera with filters, effects, and editing tools" }
//     ],
//     description: "Instagram is the world's leading photo and video sharing social network, connecting billions of users through visual storytelling. Create and share moments with powerful editing tools, discover trending content, and connect with friends and creators worldwide.",
//     downloads: "2B+",
//     rating: 4.6,
//     tags: ["Social", "Photography", "Video", "Stories", "Reels", "Filters"],
//     color: "#E4405F",
//     isLiked: true,
//     featured: true,
//     trending: false,
//     company: "Meta Platforms Inc.",
//     lastUpdated: "2024-01-20"
//   },
//   {
//     id: 3,
//     name: "WhatsApp",
//     category: "Communication",
//     subcategory: "Messaging",
//     platform: "Both",
//     image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
//     screenshots: [
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=600&fit=crop",
//       "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=600&fit=crop"
//     ],
//     screens: [
//       { id: "16", name: "Chat List", category: "Communication", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=600&fit=crop", description: "Overview of all your conversations and group chats" },
//       { id: "17", name: "Chat Interface", category: "Communication", image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=600&fit=crop", description: "Send messages, photos, videos, and voice notes with end-to-end encryption" }
//     ],
//     description: "WhatsApp is a secure messaging app trusted by over 2 billion users worldwide. Send messages, make voice and video calls, share photos and documents, all with end-to-end encryption to keep your conversations private and secure.",
//     downloads: "5B+",
//     rating: 4.5,
//     tags: ["Messaging", "Calls", "Security", "Groups", "Business", "Voice Notes"],
//     color: "#25D366",
//     isLiked: false,
//     featured: false,
//     trending: true,
//     company: "Meta Platforms Inc.",
//     lastUpdated: "2024-01-18"
//   }
// ];

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
      console.log("dataddd", data);
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
            App Screenshots
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
          onImageUpdate={(newImage) => {
            console.log("Update image:", newImage);
          }}
          allScreens={filteredScreens}
          onScreenChange={handleScreenChange}
        />
      )}
    </div>
  );
};

export default AppDetails;
