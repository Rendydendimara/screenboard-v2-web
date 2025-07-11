import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  GitCompare,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppCard } from "@/components/AppCard";
import { CompareModal } from "@/components/CompareModal";
import { HeroSection } from "@/components/HeroSection";
import { FavoritesModal } from "@/components/FavoritesModal";
import { useFavorites } from "@/hooks/useFavorites";
import { AuthModal } from "@/components/AuthModal";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import AuthAPI from "@/api/admin/auth/api";
import { logout } from "@/provider/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import UserAppAPI from "@/api/user/app/api";
import { adapterListAppBEToFEPublic } from "@/utils/adapterBEToFE";

export interface ScreenPublic {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  appName: string;
  modul: string;
}

export interface AppPublic {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  image: string;
  screenshots: string[];
  screens: ScreenPublic[];
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

// const mockScreens: ScreenPublic[] = [
//   {
//     id: "1",
//     name: "Homepage",
//     category: "UI",
//     image: "https://source.unsplash.com/900x1600?home",
//     description: "Main screen of the app",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "2",
//     name: "Settings",
//     category: "Settings",
//     image: "https://source.unsplash.com/900x1600?settings",
//     description: "AppPublic settings page",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "3",
//     name: "Profile",
//     category: "Profile",
//     image: "https://source.unsplash.com/900x1600?profile",
//     description: "User profile screen",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "4",
//     name: "Dashboard",
//     category: "Dashboard",
//     image: "https://source.unsplash.com/900x1600?dashboard",
//     description: "Main dashboard view",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "5",
//     name: "Product Details",
//     category: "E-commerce",
//     image: "https://source.unsplash.com/900x1600?ecommerce",
//     description: "Details of a product",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "6",
//     name: "Checkout",
//     category: "E-commerce",
//     image: "https://source.unsplash.com/900x1600?checkout",
//     description: "Checkout process screen",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "7",
//     name: "Article View",
//     category: "Blog",
//     image: "https://source.unsplash.com/900x1600?blog",
//     description: "Viewing a blog article",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "8",
//     name: "Contact Us",
//     category: "Contact",
//     image: "https://source.unsplash.com/900x1600?contact",
//     description: "Contact form screen",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "9",
//     name: "Image Gallery",
//     category: "Media",
//     image: "https://source.unsplash.com/900x1600?gallery",
//     description: "Display of images",
//     appName: "AwesomeApp",
//   },
//   {
//     id: "10",
//     name: "Video Player",
//     category: "Media",
//     image: "https://source.unsplash.com/900x1600?video",
//     description: "Video playback screen",
//     appName: "AwesomeApp",
//   },
// ];

// const listApp: AppPublic[] = [
//   {
//     id: 1,
//     name: "AwesomeApp",
//     category: "Productivity",
//     subcategory: "Task Management",
//     platform: "iOS",
//     image: "https://source.unsplash.com/400x300?app",
//     screenshots: [],
//     screens: mockScreens.slice(0, 5),
//     description: "An awesome app for managing your tasks.",
//     downloads: "10K+",
//     rating: 4.5,
//     tags: ["productivity", "ios", "task management"],
//     color: "#4CAF50",
//     isLiked: false,
//     featured: true,
//     trending: true,
//     company: "Acme Inc.",
//     lastUpdated: "2023-01-01",
//   },
//   {
//     id: 2,
//     name: "CoolGame",
//     category: "Entertainment",
//     subcategory: "Action",
//     platform: "Android",
//     image: "https://source.unsplash.com/400x300?game",
//     screenshots: [],
//     screens: mockScreens.slice(2, 7),
//     description: "A cool game for killing time.",
//     downloads: "1M+",
//     rating: 4.8,
//     tags: ["entertainment", "android", "action"],
//     color: "#F44336",
//     isLiked: true,
//     featured: false,
//     trending: true,
//     company: "Beta Games",
//     lastUpdated: "2023-02-15",
//   },
//   {
//     id: 3,
//     name: "SmartStudy",
//     category: "Education",
//     subcategory: "Learning",
//     platform: "Both",
//     image: "https://source.unsplash.com/400x300?education",
//     screenshots: [],
//     screens: mockScreens.slice(4, 9),
//     description: "A smart app for studying.",
//     downloads: "500K+",
//     rating: 4.2,
//     tags: ["education", "ios", "android", "learning"],
//     color: "#2196F3",
//     isLiked: false,
//     featured: true,
//     trending: false,
//     company: "Gamma Education",
//     lastUpdated: "2023-03-20",
//   },
//   {
//     id: 4,
//     name: "HealthTrack",
//     category: "Health & Fitness",
//     subcategory: "Tracking",
//     platform: "iOS",
//     image: "https://source.unsplash.com/400x300?health",
//     screenshots: [],
//     screens: mockScreens.slice(1, 6),
//     description: "An app for tracking your health and fitness.",
//     downloads: "100K+",
//     rating: 4.6,
//     tags: ["health", "fitness", "ios", "tracking"],
//     color: "#9C27B0",
//     isLiked: true,
//     featured: false,
//     trending: false,
//     company: "Delta Health",
//     lastUpdated: "2023-04-01",
//   },
//   {
//     id: 5,
//     name: "MoneyWise",
//     category: "Finance",
//     subcategory: "Management",
//     platform: "Android",
//     image: "https://source.unsplash.com/400x300?finance",
//     screenshots: [],
//     screens: mockScreens.slice(3, 8),
//     description: "A wise app for managing your money.",
//     downloads: "250K+",
//     rating: 4.0,
//     tags: ["finance", "android", "management"],
//     color: "#FF9800",
//     isLiked: false,
//     featured: false,
//     trending: false,
//     company: "Epsilon Finance",
//     lastUpdated: "2023-05-05",
//   },
//   {
//     id: 6,
//     name: "TravelMate",
//     category: "Travel",
//     subcategory: "Planning",
//     platform: "Both",
//     image: "https://source.unsplash.com/400x300?travel",
//     screenshots: [],
//     screens: mockScreens.slice(0, 4),
//     description: "Your best mate for travel planning.",
//     downloads: "50K+",
//     rating: 4.3,
//     tags: ["travel", "ios", "android", "planning"],
//     color: "#795548",
//     isLiked: true,
//     featured: false,
//     trending: false,
//     company: "Zeta Travel",
//     lastUpdated: "2023-06-10",
//   },
// ];

const Index = () => {
  const [listApp, setListApp] = useState<AppPublic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareApps, setCompareApps] = useState<AppPublic[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<ScreenPublic | null>(
    null
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isLoadingGet, setIsLoadingGet] = useState(true);
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const { favorites: favoriteScreens, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(listApp.map((app) => app.category))];
  }, [listApp]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredApps = listApp.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLike = (appId: string) => {
    listApp.find((app) => app.id === appId)!.isLiked = !listApp.find(
      (app) => app.id === appId
    )!.isLiked;
  };

  const [selectedApp, setSelectedApp] = useState<AppPublic | null>(null);

  const handleAddToCompare = (app: AppPublic) => {
    if (
      compareApps.length < 3 &&
      !compareApps.some((compareApp) => compareApp.id === app.id)
    ) {
      setCompareApps([...compareApps, app]);
    }
  };

  const handleRemoveFromCompare = (appId: string) => {
    setCompareApps(compareApps.filter((app) => app.id !== appId));
  };

  const handleLogout = async () => {
    try {
      const res = await AuthAPI.logout();
      if (res.success) {
        dispatch(logout());
        window.location.reload();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
      });
    }
  };

  const getListData = async () => {
    try {
      setIsLoadingGet(true);
      const res = await UserAppAPI.getAll();
      console.log("res", res.data);
      const dataAdpt = adapterListAppBEToFEPublic(res.data);
      setListApp(dataAdpt);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGet(false);
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Fixed Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">
                  A
                </span>
              </div>
              <span className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AppGallery
              </span>
            </div>

            {/* Search Bar - Responsive */}
            {scrolled && (
              <div className="flex-1 max-w-md mx-4 lg:mx-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search apps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-white/80 backdrop-blur-sm border-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavorites(true)}
                className="hidden sm:flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden lg:inline">Favorites</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCompare(true)}
                className="relative"
              >
                <GitCompare className="h-4 w-4" />
                {compareApps.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {compareApps.length}
                  </Badge>
                )}
                <span className="hidden lg:inline ml-2">Compare</span>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFavorites(true)}
                className="sm:hidden"
              >
                <Heart className="h-4 w-4" />
              </Button>
              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="hidden sm:flex items-center space-x-2"
                  >
                    Logout
                  </Button>
                  <Link to="/admin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex items-center space-x-2"
                    >
                      Admin
                    </Button>
                  </Link>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpenAuth(true)}
                  className="hidden sm:flex items-center space-x-2"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-16 lg:pt-20">
        <HeroSection />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Search and Filters - Mobile Responsive */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            {/* Search Bar - Desktop */}
            {!scrolled && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search apps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            )}

            {/* Filters and View Controls */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              {/* Category Filter */}
              <div className="flex-1 sm:flex-none sm:min-w-[200px]">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1 sm:flex-none"
                >
                  <Grid className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                  <span className="sm:hidden lg:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1 sm:flex-none"
                >
                  <List className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                  <span className="sm:hidden lg:inline">List</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-slate-600">
              Showing {filteredApps.length} of {listApp.length} apps
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>

            {/* Active Filters */}
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>Search: {searchTerm}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {selectedCategory !== "All" && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>Category: {selectedCategory}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory("All")}
                  />
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Apps Grid/List - Responsive */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-12 lg:py-20">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 lg:h-12 lg:w-12 text-slate-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-semibold text-slate-600 mb-2">
              No apps found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                : "space-y-4 lg:space-y-6"
            }
          >
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                viewMode={viewMode}
                onLike={() => handleLike(app.id)}
                onClick={() => setSelectedApp(app)}
                onAddToCompare={() => handleAddToCompare(app)}
                isInCompare={compareApps.some(
                  (compareApp) => compareApp.id === app.id
                )}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CompareModal
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        apps={compareApps}
        onRemoveApp={handleRemoveFromCompare}
        onAddApp={handleAddToCompare}
        availableApps={listApp}
      />

      <AuthModal isOpen={isOpenAuth} onClose={onCloseOpenAuth} />

      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
        favoriteScreens={favoriteScreens}
        onRemoveFavorite={toggleFavorite}
        onScreenClick={setSelectedScreen}
      />

      {/* ScreenPublic Detail Modal */}
      {selectedScreen && (
        <Dialog
          open={!!selectedScreen}
          onOpenChange={() => setSelectedScreen(null)}
        >
          <DialogContent className="max-w-sm sm:max-w-md lg:max-w-lg max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-lg lg:text-xl">
                {selectedScreen.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-[9/16] rounded-lg overflow-hidden bg-slate-100">
                <img
                  src={selectedScreen.image}
                  alt={selectedScreen.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <Badge variant="outline">{selectedScreen.category}</Badge>
                <p className="text-sm text-slate-600">
                  {selectedScreen.description}
                </p>
                <p className="text-xs text-slate-500">
                  From: {selectedScreen.appName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavorite(selectedScreen)}
                  className="flex-1"
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      favoriteScreens.some(
                        (fav) => fav.id === selectedScreen.id
                      )
                        ? "fill-red-500 text-red-500"
                        : "text-slate-400"
                    }`}
                  />
                  {favoriteScreens.some((fav) => fav.id === selectedScreen.id)
                    ? "Remove"
                    : "Add to"}{" "}
                  Favorites
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;
