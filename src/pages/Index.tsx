import AdminAuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import UserAuthAPI from "@/api/user/auth/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import { AppCard } from "@/components/AppCard";
import { AuthModal } from "@/components/AuthModal";
import { CompareModal } from "@/components/CompareModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { HeroSection } from "@/components/HeroSection";
import SEO from "@/components/SEO";
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
import { Link, useNavigate } from "react-router-dom";

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
  const [scrolledSearch, setScrolledSearch] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isLoadingGet, setIsLoadingGet] = useState(true);
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const { favorites: favoriteScreens, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);
  const navigate = useNavigate();
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
      compareApps.length < 2 &&
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
      let res;
      if (user.userType === "administrator") {
        res = await AdminAuthAPI.logout();
      } else {
        res = await UserAuthAPI.logout();
      }
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

  const gotoDetail = useCallback((id: string) => {
    navigate(`/app/${id}`);
  }, []);

  const getListData = async () => {
    try {
      setIsLoadingGet(true);
      const res = await UserAppAPI.getAll();
      const dataAdpt = adapterListAppBEToFEPublic(res.data);
      setListApp([
        ...dataAdpt,
        ...dataAdpt,
        ...dataAdpt,
        ...dataAdpt,
        ...dataAdpt,
      ]);
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
      setScrolled(window.scrollY > 80);
      setScrolledSearch(window.scrollY > 680);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <SEO
        title="Screenboard"
        description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
      />
      <div className="min-h-screen bg-white">
        {/* Fixed Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              scrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm"
                : "bg-transparent"
            }`}
          >
            <div className="container px-0">
              <div className="flex items-center justify-between h-16 lg:h-20">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm lg:text-base">
                      S
                    </span>
                  </div>
                  <p className="hidden sm:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Screenboard
                  </p>
                </div>

                {/* Search Bar - Responsive */}
                {scrolledSearch && (
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
                    onClick={() => setShowCompare(true)}
                    className="relative"
                  >
                    <GitCompare className="h-4 w-4" />
                    {compareApps.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {compareApps.length}
                      </Badge>
                    )}
                    <span className="hidden lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle">
                      Compare
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCompare(true)}
                    className="relative"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66667 8L5.33333 6.53334L5.73333 5.86667M4 3.33333H12L14 6.66667L8.33333 13C8.28988 13.0443 8.23802 13.0796 8.18078 13.1036C8.12355 13.1277 8.06209 13.1401 8 13.1401C7.93792 13.1401 7.87645 13.1277 7.81922 13.1036C7.76198 13.0796 7.71012 13.0443 7.66667 13L2 6.66667L4 3.33333Z"
                        stroke="black"
                        stroke-width="1.3"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <span className="hidden lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle">
                      Join Us
                    </span>
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
                      {user.userType === "administrator" && (
                        <Link to="/admin">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hidden sm:flex items-center space-x-2"
                          >
                            Admin
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <></>
                    // <Button
                    //   variant="ghost"
                    //   size="sm"
                    //   onClick={() => setIsOpenAuth(true)}
                    //   className="hidden sm:flex items-center space-x-2"
                    // >
                    //   Login
                    // </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSection />
          </div>
        </section>
        {/* Main Content */}
        <main className="container px-0 py-8 lg:py-12">
          {/* Search and Filters - Mobile Responsive */}
          <div className="mb-8 lg:mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
              {/* Search Bar - Desktop */}
              {!scrolledSearch && (
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search apps..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-[6px]"
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
              {/* <p className="text-sm text-slate-600">
                Showing {filteredApps.length} of {listApp.length} apps
                {selectedCategory !== null && ` in ${selectedCategory?.name}`}
              </p> */}

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
            <div className="relative">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                    : "space-y-4 lg:space-y-6"
                }
              >
                {filteredApps.map((app, i) => (
                  <AppCard
                    key={i}
                    app={app}
                    viewMode={viewMode}
                    onLike={() => handleLike(app.id)}
                    onClick={() => setSelectedApp(app)}
                    onDetail={() => gotoDetail(app.id)}
                    onAddToCompare={() => handleAddToCompare(app)}
                    isInCompare={compareApps.some(
                      (compareApp) => compareApp.id === app.id
                    )}
                  />
                ))}
              </div>
              {!user && (
                <div className="absolute h-[872px] bottom-0 w-full bg-[linear-gradient(180deg,_rgba(255,_255,_255,_0)_4.01%,_#FFFFFF_62.21%)]">
                  <div className="flex flex-col w-full gap-[25px] absolute bottom-16">
                    <div className="flex flex-col gap-3 items-center">
                      <h5 className="font-['Inter'] font-black text-[80px] leading-[125%] tracking-[0%] text-center bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                        Join and get more inspiration from real product
                      </h5>
                      <p className="font-[Inter] font-semibold text-[20px] leading-[155%] tracking-[0%] align-middle">
                        We believe real design give more sense to your design
                        process
                      </p>
                      <Button
                        variant={viewMode === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsOpenAuth(true)}
                        className="w-[163px] gap-2 h-[48px] bg-[linear-gradient(90deg,_#2563EB_0%,_#9333EA_100%)] [box-shadow:0px_10px_15px_-3px_rgba(0,_0,_0,_0.1),_0px_4px_6px_-4px_rgba(0,_0,_0,_0.1)] rounded-[6px] font-[Inter] font-bold text-[17.6px] leading-[28px] tracking-[0%] text-center align-middle"
                      >
                        <div className="w-6 h-4">
                          <svg
                            width="25"
                            height="16"
                            viewBox="0 0 25 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_13_1021)">
                              <path
                                d="M3.16674 9.33328C3.04059 9.33371 2.9169 9.29833 2.81005 9.23126C2.70319 9.1642 2.61757 9.06818 2.56311 8.95438C2.50865 8.84059 2.4876 8.71367 2.50241 8.58838C2.51721 8.4631 2.56726 8.34459 2.64674 8.24661L9.24674 1.44661C9.29625 1.38947 9.36372 1.35085 9.43806 1.3371C9.51241 1.32335 9.58923 1.33529 9.6559 1.37095C9.72257 1.40661 9.77513 1.46388 9.80497 1.53335C9.8348 1.60283 9.84013 1.68038 9.82008 1.75328L8.54008 5.76661C8.50233 5.86763 8.48966 5.97629 8.50314 6.08328C8.51662 6.19028 8.55585 6.2924 8.61747 6.3809C8.67909 6.46939 8.76126 6.54162 8.85693 6.59139C8.95259 6.64115 9.05891 6.66696 9.16674 6.66661H13.8334C13.9596 6.66618 14.0833 6.70156 14.1901 6.76863C14.297 6.8357 14.3826 6.93171 14.437 7.04551C14.4915 7.15931 14.5125 7.28622 14.4977 7.41151C14.4829 7.53679 14.4329 7.65531 14.3534 7.75328L7.75341 14.5533C7.7039 14.6104 7.63644 14.649 7.56209 14.6628C7.48774 14.6765 7.41093 14.6646 7.34426 14.6289C7.27759 14.5933 7.22502 14.536 7.19519 14.4665C7.16535 14.3971 7.16002 14.3195 7.18008 14.2466L8.46008 10.2333C8.49782 10.1323 8.5105 10.0236 8.49702 9.91661C8.48354 9.80962 8.4443 9.70749 8.38268 9.619C8.32106 9.5305 8.23889 9.45827 8.14323 9.40851C8.04756 9.35874 7.94125 9.33293 7.83341 9.33328H3.16674Z"
                                stroke="white"
                                stroke-width="1.33333"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_13_1021">
                                <rect
                                  width="16"
                                  height="16"
                                  fill="white"
                                  transform="translate(0.5)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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

        <AuthModal
          initialMode="login"
          isOpen={isOpenAuth}
          onClose={onCloseOpenAuth}
        />

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
    </>
  );
};

export default Index;
