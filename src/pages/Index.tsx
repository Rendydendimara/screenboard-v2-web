import AdminAuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import AppLikeAPI from "@/api/user/appLike/api";
import UserAuthAPI from "@/api/user/auth/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import ScreenAPI from "@/api/user/screen/api";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { useFavorites } from "@/hooks/useFavorites";
import { logout, setCredentials } from "@/provider/slices/authSlice";
import {
  addToCompare,
  removeFromCompare,
} from "@/provider/slices/compareSlice";
import { RootState } from "@/provider/store";
import { adapterListAppBEToFEPublic } from "@/utils/adapterBEToFE";
import clsx from "clsx";
import {
  GitCompare,
  Grid,
  Heart,
  List,
  Menu,
  Search,
  X,
  Zap,
} from "lucide-react";
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
  order?: number;
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
  countries?: string[];
  linkPlayStore?: string;
  linkAppStore?: string;
  linkWebsite?: string;
}

const Index = () => {
  const [listApp, setListApp] = useState<AppPublic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TCategoryRes>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<ScreenPublic | null>(
    null
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledSearch, setScrolledSearch] = useState(false);
  const [scrolledCategories, setScrolledCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isLoadingGet, setIsLoadingGet] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const compareApps = useTypedSelector(
    (state: RootState) => state.compare.compareApps
  );
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
    const matchesCategory = selectedCategory
      ? app?.category?._id === selectedCategory?._id
      : true;
    return matchesSearch && matchesCategory;
  });

  const handleLike = async (appId: string, isLike: boolean) => {
    try {
      if (user) {
        const currentIndex = listApp.findIndex((s) => s.id === appId);
        const listAppAny: any = listApp;
        if (isLike) {
          await AppLikeAPI.dislike({ appId: appId });
          dispatch(
            setCredentials({
              token: user.token,
              user: {
                ...user,
                appLikes: user.appLikes.filter((d) => d !== appId),
              },
            })
          );
        } else {
          await AppLikeAPI.like({ appId: appId });

          dispatch(
            setCredentials({
              token: user.token,
              user: {
                ...user,
                appLikes: [...user.appLikes, appId],
              },
            })
          );
        }
        setListApp([
          ...listAppAny.slice(0, currentIndex),
          {
            ...listAppAny[currentIndex],
            isLiked: !isLike,
          },
          ...listAppAny.slice(currentIndex + 1, listAppAny.length),
        ]);
        toast({
          title: listAppAny[currentIndex]?.isLiked
            ? "Removed from favorites"
            : "Added to favorites",
          description: `${listAppAny[currentIndex]?.name} has been ${
            listAppAny[currentIndex]?.isLiked ? "removed from" : "added to"
          } your favorites.`,
        });
      } else {
        setIsOpenAuth(true);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response.data.message || error.message,
        variant: "destructive",
      });
    }
  };

  const [selectedApp, setSelectedApp] = useState<AppPublic | null>(null);

  const handleAddToCompare = (app: AppPublic) => {
    dispatch(addToCompare(app));
  };

  const handleRemoveFromCompare = (appId: string) => {
    dispatch(removeFromCompare(appId));
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
        // ...dataAdpt,
        // ...dataAdpt,
        // ...dataAdpt,
        // ...dataAdpt,
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
      if (id === selectedCategory?._id) {
        setSelectedCategory(null);
      } else {
        if (id !== "All") {
          const temp = categories.find((d) => d._id === id);
          setSelectedCategory(temp);
        } else {
          setSelectedCategory(null);
        }
      }
    },
    [categories, selectedCategory]
  );

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

  const handleDownloadScreens = async () => {
    try {
      setIsDownloading(true);

      // Download by category if selected, otherwise prompt user
      if (selectedCategory) {
        await ScreenAPI.download({ category: selectedCategory._id });
        toast({
          title: "Download Started",
          description: `Downloading screens from ${selectedCategory.name} category...`,
        });
      } else {
        toast({
          title: "Select a Category",
          description: "Please select a category first to download screens.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download screens",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getListCategoryFiltered = useMemo(() => {
    const categoriesApp = listApp.map((app) => app.category._id);
    return categories.filter((cat) => {
      return categoriesApp.includes(cat._id);
    });
  }, [categories, listApp]);

  useEffect(() => {
    getListDataCategory();
  }, []);

  useEffect(() => {
    getListData();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 375;

      setScrolled(isMobile ? window.scrollY > 80 : window.scrollY > 80);
      setScrolledSearch(isMobile ? window.scrollY > 400 : window.scrollY > 680);
      setScrolledCategories(
        isMobile ? window.scrollY > 500 : window.scrollY > 680
      );
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
              scrolled
                ? "bg-white/90 backdrop-blur-md shadow-sm"
                : "bg-transparent"
            }`}
          >
            <div className="px-0">
              <div className="w-full flex justify-center items-center">
                <div className="w-full max-w-[1200px]">
                  <div className="flex w-full items-center justify-between h-16 lg:h-20 px-4 md:px-6 lg:px-0">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-sm lg:text-base">
                          S
                        </span>
                      </div>
                    </div>

                    {/* Search Bar - Responsive */}
                    <div
                      className={clsx(
                        "flex-1 max-w-md mx-4 lg:mx-8 transition-all duration-300 ease-in-out overflow-hidden",
                        scrolledSearch
                          ? "max-w-md opacity-100 translate-x-0"
                          : "max-w-0 opacity-0 -translate-x-4 pointer-events-none"
                      )}
                    >
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

                    {/* Action Buttons - Desktop */}
                    <div className="hidden md:flex items-center gap-[10px]">
                      {user && (
                        <Link to="/favorites">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleOpenAuthModal}
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
                                d="M12.6666 9.33333C13.66 8.36 14.6666 7.19333 14.6666 5.66667C14.6666 4.69421 14.2803 3.76158 13.5927 3.07394C12.9051 2.38631 11.9724 2 11 2C9.82665 2 8.99998 2.33333 7.99998 3.33333C6.99998 2.33333 6.17331 2 4.99998 2C4.02752 2 3.09489 2.38631 2.40725 3.07394C1.71962 3.76158 1.33331 4.69421 1.33331 5.66667C1.33331 7.2 2.33331 8.36667 3.33331 9.33333L7.99998 14L12.6666 9.33333Z"
                                stroke="#94A3B8"
                                stroke-width="1.33333"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                              Favorites ({user.appLikes.length})
                            </span>
                          </Button>{" "}
                        </Link>
                      )}
                      {user && (
                        <Link to="/subscription">
                          <Button
                            variant="ghost"
                            size="sm"
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
                                d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70725 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947618 11.2811 0.666668 11.9594 0.666668 12.6667V14M13.3333 5.33333V9.33333M15.3333 7.33333H11.3333M8.33333 4.66667C8.33333 6.13943 7.13943 7.33333 5.66667 7.33333C4.19391 7.33333 3 6.13943 3 4.66667C3 3.19391 4.19391 2 5.66667 2C7.13943 2 8.33333 3.19391 8.33333 4.66667Z"
                                stroke="#94A3B8"
                                stroke-width="1.33333"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>

                            <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                              Subscription
                            </span>
                          </Button>
                        </Link>
                      )}
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
                        <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                          Compare
                        </span>
                      </Button>
                      {!user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleOpenAuthModal}
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

                          <span className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                            Join Us
                          </span>
                        </Button>
                      )}
                      {user && (
                        <div className="flex items-center gap-2 px-3">
                          <Link to="/profile">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center space-x-2"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                                  stroke="black"
                                  stroke-width="1.33333"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                              <p className="font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle text-[#020817]">
                                {user.username}
                              </p>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="hidden sm:flex items-center space-x-2 font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle underline [text-decoration-style:solid] [text-decoration-skip-ink:auto] !text-[#4475EE]"
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
                        </div>
                      )}
                    </div>

                    {/* Mobile Menu Button */}
                    <Sheet
                      open={mobileMenuOpen}
                      onOpenChange={setMobileMenuOpen}
                    >
                      <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="sm">
                          <Menu className="h-6 w-6" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="right"
                        className="w-[300px] sm:w-[350px]"
                      >
                        <div className="flex flex-col gap-4 mt-8">
                          {user ? (
                            <>
                              <div className="flex items-center gap-2 pb-4 border-b">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                                    stroke="black"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <p className="font-[Inter] font-semibold text-[16px]">
                                  {user.username}
                                </p>
                              </div>

                              <Link
                                to="/favorites"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start gap-2"
                                >
                                  <Heart className="h-5 w-5" />
                                  Favorites ({user.appLikes.length})
                                </Button>
                              </Link>

                              <Link
                                to="/subscription"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start gap-2"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70725 10 8 10H3.33333C2.62609 10 1.94781 10.281 1.44772 10.781C0.947618 11.2811 0.666668 11.9594 0.666668 12.6667V14M13.3333 5.33333V9.33333M15.3333 7.33333H11.3333M8.33333 4.66667C8.33333 6.13943 7.13943 7.33333 5.66667 7.33333C4.19391 7.33333 3 6.13943 3 4.66667C3 3.19391 4.19391 2 5.66667 2C7.13943 2 8.33333 3.19391 8.33333 4.66667Z"
                                      stroke="currentColor"
                                      strokeWidth="1.33333"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Subscription
                                </Button>
                              </Link>

                              <Link
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start gap-2"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                  >
                                    <path
                                      d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H9.33333C10.0406 10 10.7189 10.281 11.219 10.781C11.719 11.2811 12 11.9594 12 12.6667V14M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61448 7.05238 7.29276 7.33333 8 7.33333C8.70724 7.33333 9.38552 7.05238 9.88562 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88562 2.78105C9.38552 2.28095 8.70724 2 8 2C7.29276 2 6.61448 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
                                      stroke="currentColor"
                                      strokeWidth="1.33333"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  Profile
                                </Button>
                              </Link>

                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setShowCompare(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full justify-start gap-2 relative"
                              >
                                <GitCompare className="h-5 w-5" />
                                Compare
                                {compareApps.length > 0 && (
                                  <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {compareApps.length}
                                  </Badge>
                                )}
                              </Button>

                              {user.userType === "administrator" && (
                                <Link
                                  to="/admin"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2"
                                  >
                                    Admin Panel
                                  </Button>
                                </Link>
                              )}

                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleLogout();
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full justify-start mt-4"
                              >
                                Logout
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  setShowCompare(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full justify-start gap-2 relative"
                              >
                                <GitCompare className="h-5 w-5" />
                                Compare
                                {compareApps.length > 0 && (
                                  <Badge className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {compareApps.length}
                                  </Badge>
                                )}
                              </Button>

                              <Button
                                onClick={() => {
                                  setIsOpenAuth(true);
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="mr-2"
                                >
                                  <path
                                    d="M6.66667 8L5.33333 6.53334L5.73333 5.86667M4 3.33333H12L14 6.66667L8.33333 13C8.28988 13.0443 8.23802 13.0796 8.18078 13.1036C8.12355 13.1277 8.06209 13.1401 8 13.1401C7.93792 13.1401 7.87645 13.1277 7.81922 13.1036C7.76198 13.0796 7.71012 13.0443 7.66667 13L2 6.66667L4 3.33333Z"
                                    stroke="currentColor"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                Join Us
                              </Button>
                            </>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              {scrolledCategories && (
                <div className="w-full border-t-[1px] border-b-[1px] border-solid border-[#E0E1E1]" />
              )}
              {/* border-t-[1px] border-b-[1px] border-solid border-[#E0E1E1] */}
              <div className="w-full flex justify-center items-center">
                <div className="w-full max-w-[1200px]">
                  <div
                    className={clsx(
                      "w-full transition-all duration-300 ease-in-out overflow-hidden px-4 md:px-0",
                      scrolledCategories
                        ? "max-h-[300px] py-4 opacity-100 translate-y-0"
                        : "max-h-0 py-0 opacity-0 -translate-y-4 pointer-events-none"
                    )}
                  >
                    <div className="w-full flex items-start md:items-center flex-col md:flex-row gap-4 md:gap-0  justify-between">
                      <div className="flex items-center gap-4 w-full flex-wrap">
                        {getListCategoryFiltered.map((cat, i) => (
                          <div
                            onClick={() => handleChangeCategory(cat._id)}
                            className={clsx(
                              "hover:cursor-pointer gap-[10px] px-[16px] py-[8px] rounded-[12px] border border-solid border-[rgba(167,170,172,1)] font-[Inter] font-semibold text-[14px] leading-[20px] tracking-[-0.2%] align-middle",
                              cat._id === selectedCategory?._id
                                ? "bg-[#0F172A] text-white"
                                : " text-[#565D61]"
                            )}
                            key={i}
                          >
                            {cat.name}
                          </div>
                        ))}
                      </div>
                      {/* Filters and View Controls */}
                      <div className="flex flex-row md:flex-col sm:flex-row gap-4 lg:gap-6">
                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={
                              viewMode === "grid" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="flex-1 sm:flex-none"
                          >
                            <Grid className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                            <span className="sm:hidden lg:inline">Grid</span>
                          </Button>
                          <Button
                            variant={
                              viewMode === "list" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="flex-1 sm:flex-none"
                          >
                            <List className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                            <span className="sm:hidden lg:inline">List</span>
                          </Button>
                        </div>
                        {/* Download Button */}
                        {/* {selectedCategory && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadScreens}
                        disabled={isDownloading}
                        className="flex-1 sm:flex-none"
                      >
                        {isDownloading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                        )}
                        <span className="sm:hidden lg:inline">
                          {isDownloading ? "Downloading..." : "Download"}
                        </span>
                      </Button>
                    )} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSection handleStartExploring={handleOpenAuthModal} />
          </div>
        </section>
        {/* Main Content */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-[1200px]">
            <main className="px-4 py-6 md:px-0 md:py-8 lg:py-12">
              {/* Search and Filters - Mobile Responsive */}
              <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                  {/* Search Bar - Desktop */}
                  <div
                    className={clsx(
                      "flex-1 max-w-md transition-all duration-300 ease-in-out overflow-hidden",
                      !scrolledSearch
                        ? "max-h-[100px] opacity-100 translate-y-0"
                        : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                    )}
                  >
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

                  {/* Filters and View Controls */}
                  <div className="flex flex-row md:flex-col sm:flex-row gap-4 lg:gap-6">
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
                    {/* Download Button */}
                    {/* {selectedCategory && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadScreens}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none"
                  >
                    {isDownloading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2 sm:mr-0 lg:mr-2" />
                    )}
                    <span className="sm:hidden lg:inline">
                      {isDownloading ? "Downloading..." : "Download"}
                    </span>
                  </Button>
                )} */}
                  </div>
                </div>

                {/* Results Count */}
                <div
                  className={clsx(
                    "mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2",
                    !searchTerm && "hidden"
                  )}
                >
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

              {/* Category Filter */}
              <div className="flex items-center gap-3 mb-4 flex-wrap w-full">
                <div
                  onClick={() => setSelectedCategory(null)}
                  className={clsx(
                    "hover:cursor-pointer gap-[10px] px-3 py-1 rounded-[12px] border border-solid border-[#E2E8F0] font-[Inter] text-body-4 leading-[20px] tracking-[-0.2%] align-middle",
                    !selectedCategory
                      ? "bg-[#0F172A] text-white font-semibold"
                      : " text-[#565D61] font-normal"
                  )}
                >
                  All
                </div>
                {getListCategoryFiltered.map((cat, i) => (
                  <div
                    onClick={() => handleChangeCategory(cat._id)}
                    className={clsx(
                      "hover:cursor-pointer gap-[10px] px-3 py-1 rounded-[12px] border border-solid border-[#E2E8F0] font-[Inter] text-body-4 leading-[20px] tracking-[-0.2%] align-middle",
                      cat._id === selectedCategory?._id
                        ? "bg-[#0F172A] text-white font-semibold"
                        : " text-[#565D61] font-normal"
                    )}
                    key={i}
                  >
                    {cat.name}
                  </div>
                ))}
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
                        onLike={() => handleLike(app.id, app.isLiked)}
                        onClick={() => setSelectedApp(app)}
                        onDetail={() => gotoDetail(app.id)}
                        onAddToCompare={() => handleAddToCompare(app)}
                        isInCompare={compareApps.some(
                          (compareApp) => compareApp.id === app.id
                        )}
                        setSelectedScreen={setSelectedScreen}
                      />
                    ))}
                  </div>
                  {!user && (
                    <div
                      className={clsx(
                        "absolute h-[872px] bottom-0 w-full bg-[linear-gradient(180deg,_rgba(255,_255,_255,_0)_4.01%,_#FFFFFF_62.21%)]",
                        filteredApps.length < 3 && "top-0"
                      )}
                    >
                      <div className="flex flex-col w-full gap-[25px] absolute bottom-16">
                        <div className="flex justify-center items-center w-full">
                          <div className="flex flex-col gap-3 items-center w-full md:w-[889px]">
                            <h5 className="font-['Inter'] font-semibold text-[32px] md:text-[64px] leading-[125%] tracking-[0%] text-center bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                              Join and get more inspiration from real product
                            </h5>
                            <p className="font-[Inter] font-normal text:[16px] md:text-[20px] text-[#464C4F] leading-[155%] tracking-[0%] align-middle">
                              We believe real design give more sense to your
                              design process
                            </p>
                            <div
                              onClick={() => setIsOpenAuth(true)}
                              className="flex justify-center mb-6 lg:mb-8 hover:!cursor-pointer z-[10]"
                            >
                              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-8 py-3 text-sm font-[Inter] font-bold text-[17.6px] leading-[28px] tracking-[0%] text-center align-middle">
                                <Zap className="h-4 w-4 mr-1" />
                                Join to Unlock Everything
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Modals */}
        <CompareModal
          isOpen={showCompare}
          setShowCompare={setShowCompare}
          onClose={() => setShowCompare(false)}
          apps={compareApps}
          onRemoveApp={handleRemoveFromCompare}
          onAddApp={handleAddToCompare}
          availableApps={listApp}
          categories={getListCategoryFiltered}
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
