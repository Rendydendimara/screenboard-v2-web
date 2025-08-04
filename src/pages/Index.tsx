import AuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import { AppCard } from "@/components/AppCard";
import { AuthModal } from "@/components/AuthModal";
import { CompareModal } from "@/components/CompareModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { HeroSection } from "@/components/HeroSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { useFavorites } from "@/hooks/useFavorites";
import { logout } from "@/provider/slices/authSlice";
import { RootState } from "@/provider/store";
import { adapterListAppBEToFEPublic } from "@/utils/adapterBEToFE";
import { GitCompare, Grid, Heart, List, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export interface ScreenPublic {
  id: string;
  name: string;
  category?: {
    name: string;
    _id: string;
  };
  image: string;
  description: string;
  appName: string;
  modul: string;
}

export interface AppPublic {
  id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
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

const Index = () => {
  const [listApp, setListApp] = useState<AppPublic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TCategoryRes | null>(
    null
  );
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
  const [categories, setCategories] = useState<TCategoryRes[]>([]);

  const filteredApps = listApp.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === null || app?.category?._id === selectedCategory?._id;
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

  const getListDataCategory = async () => {
    try {
      setIsLoadingGet(true);
      const dataRes = await CategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGet(false);
    }
  };

  const handleChangeCategory = useCallback(
    (id: string) => {
      if (id !== "All") {
        const temp = categories.find((d) => d._id === id);
        setSelectedCategory(temp);
      } else {
        setSelectedCategory(null);
      }
    },
    [categories]
  );

  useEffect(() => {
    getListData();
    getListDataCategory();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
                  value={selectedCategory?._id}
                  onValueChange={handleChangeCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="All">All</SelectItem>
                    {categories.map((category, i) => (
                      <SelectItem key={i} value={category._id}>
                        {category.name}
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
              {selectedCategory !== null && ` in ${selectedCategory?.name}`}
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
              {selectedCategory !== null && (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>Category: {selectedCategory?.name}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCategory(null)}
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
        setShowCompare={setShowCompare}
        onClose={() => setShowCompare(false)}
        apps={compareApps}
        onRemoveApp={handleRemoveFromCompare}
        onAddApp={handleAddToCompare}
        availableApps={listApp}
        categories={categories}
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
                {/* <Badge variant="outline">{selectedScreen.category}</Badge> */}
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
