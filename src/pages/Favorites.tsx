import AdminAuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import AppLikeAPI from "@/api/user/appLike/api";
import UserAuthAPI from "@/api/user/auth/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import { AppCard } from "@/components/AppCard";
import { AuthModal } from "@/components/AuthModal";
import { CompareModal } from "@/components/CompareModal";
import { FavoritesModal } from "@/components/FavoritesModal";
import { HeroSectionFavorites } from "@/components/HeroSectionFavorites";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
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
import { GitCompare, Heart, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Header } from "@/components/molecules";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

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
  countries?: string[];
}

const FavoritesPage = () => {
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
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isLoadingGetListFavorit, setIsLoadingGetListFavorit] = useState(true);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
      setIsLoadingGetListFavorit(true);
      const res = await UserAppAPI.getListFavorites();
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
      setIsLoadingGetListFavorit(false);
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
      setScrolled(window.scrollY > 80);
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
          <Header
            scrolled={scrolled}
            onOpenAuthModal={handleOpenAuthModal}
            onShowCompare={() => setShowCompare(true)}
            transparentBg={true}
          />

          {/* Hero Section */}
          <div className="pt-16 lg:pt-20">
            <HeroSectionFavorites />
          </div>
        </section>
        {/* Main Content */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
            <main className="px-4 py-6 md:px-0 md:py-8 lg:py-12">
              {/* Apps Grid/List - Responsive */}
              {isLoadingGetListFavorit ? (
                <div className="relative">
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
                        : "space-y-4 lg:space-y-6"
                    }
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={
                          viewMode === "grid"
                            ? "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            : "bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                        }
                      >
                        {viewMode === "grid" ? (
                          <div className="p-4 space-y-4">
                            <div className="flex items-start gap-4">
                              <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
                              <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-6 w-20 rounded-full" />
                              <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-16 w-full" />
                            <div className="flex gap-2">
                              <Skeleton className="h-9 flex-1 rounded-md" />
                              <Skeleton className="h-9 flex-1 rounded-md" />
                              <Skeleton className="h-9 w-12 rounded-md" />
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 flex gap-4">
                            <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
                            <div className="flex-1 space-y-3">
                              <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                              <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                                <Skeleton className="h-6 w-24 rounded-full" />
                              </div>
                              <Skeleton className="h-12 w-full" />
                              <div className="flex gap-2">
                                <Skeleton className="h-9 w-24 rounded-md" />
                                <Skeleton className="h-9 w-28 rounded-md" />
                                <Skeleton className="h-9 w-12 rounded-md" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredApps.length === 0 ? (
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
                        type="favorite"
                      />
                    ))}
                  </div>
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
                  <ImageWithFallback
                    src={selectedScreen.image}
                    fallbackSrc={selectedScreen.image}
                    alt={selectedScreen.name}
                    containerClassName="w-full h-full"
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

export default FavoritesPage;
