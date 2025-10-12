import AdminAuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import AppLikeAPI from "@/api/user/appLike/api";
import UserAuthAPI from "@/api/user/auth/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import { AuthModal } from "@/components/AuthModal";
import { CompareModal } from "@/components/CompareModal";
import CModalDialogLoading from "@/components/modal-dialog-loading";
import { ScreenImageModalV2 } from "@/components/ScreenImageModalV2";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/components/ui/CountryMultiSelect";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { logout } from "@/provider/slices/authSlice";
import { RootState } from "@/provider/store";
import {
  adapterListAppBEToFEPublic,
  adapterSingleAppBEToFEPublic,
} from "@/utils/adapterBEToFE";
import clsx from "clsx";
import {
  ArrowLeft,
  Building,
  Calendar,
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
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppPublic, ScreenPublic } from "./Index";

const AppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state: RootState) => state.auth.user);
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
  const [showCompare, setShowCompare] = useState(false);
  const [compareApps, setCompareApps] = useState<AppPublic[]>([]);
  const [listApp, setListApp] = useState<AppPublic[]>([]);
  const [categories, setCategories] = useState<TCategoryRes[]>([]);
  const [isOpenAuth, setIsOpenAuth] = useState(false);

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
    ...new Set(app?.screens.map((screen) => screen?.category?.name)),
  ];

  const filteredScreens =
    selectedScreenCategory === "All"
      ? app?.screens
      : app?.screens.filter(
          (screen) => screen?.category?.name === selectedScreenCategory
        );

  const groupedScreens = app?.screens.reduce((acc, screen) => {
    if (!acc[screen?.category?.name]) {
      acc[screen?.category?.name] = [];
    }
    acc[screen?.category?.name].push(screen);
    return acc;
  }, {} as Record<string, ScreenPublic[]>);

  const toggleLike = async () => {
    try {
      if (user) {
        if (app.isLiked) {
          await AppLikeAPI.dislike({ appId: app.id });
          setApp({
            ...app,
            isLiked: !app.isLiked,
          });
        } else {
          await AppLikeAPI.like({ appId: app.id });
          setApp({
            ...app,
            isLiked: !app.isLiked,
          });
        }
        toast({
          title: app?.isLiked ? "Removed from favorites" : "Added to favorites",
          description: `${app?.name} has been ${
            app?.isLiked ? "removed from" : "added to"
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

  // 🔹 Group by kategori agar bisa ditampilkan per section
  const groupedScreensFilter = filteredScreens?.reduce((acc, screen) => {
    const categoryName = screen.category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(screen);
    return acc;
  }, {} as Record<string, any[]>);

  useEffect(() => {
    getListData();
    getListDataCategory();
  }, []);

  const getListData = async () => {
    try {
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
    }
  };

  const getListDataCategory = async () => {
    try {
      const dataRes = await CategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    }
  };

  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  useEffect(() => {
    getAppDetail();
  }, [user]);

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
    <>
      <SEO
        title={`${app?.name} | Screenboard`}
        description="Discover and explore amazing mobile app designs. Get inspired by the world's best mobile apps."
      />

      {/* Navigation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-transparent">
          <div className="container px-0">
            <div className="flex items-center justify-between h-16 lg:h-20 px-4 md:px-0">
              {/* Logo */}
              <Link to="/">
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
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Button
                  onClick={() => setShowCompare(true)}
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <GitCompare className="h-4 w-4" />
                  {/* {compareApps.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {compareApps.length}
                      </Badge>
                    )} */}
                  <span className="lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle">
                    Compare
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpenAuth(true)}
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

                  <span className="lg:inline font-[Inter] font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle">
                    Join Us
                  </span>
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

        {/* App Overview */}
        <div className="mb-8 container px-4 md:px-0 pt-3 pb-10">
          <div className="flex items-center justify-between md:flex-row flex-col">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={
                      app?.image ?? "https://source.unsplash.com/400x300?game"
                    }
                    fallbackSrc="https://placehold.co/400"
                    alt={app.name}
                    className="w-full h-full object-contain shadow-2xl"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {app.name}
                </h1>
                <div className="flex mt-2 items-start gap-4 flex-col md:flex-row justify-start text-sm text-slate-600">
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
                {app.countries && app.countries.length > 0 && (
                  <div className="flex items-start gap-2 mt-3">
                    <Globe className="h-4 w-4 text-slate-600 mt-0.5" />
                    <div className="flex flex-wrap gap-1.5">
                      {app.countries.map((countryName) => {
                        const country = COUNTRIES.find(
                          (c) => c.name === countryName
                        );
                        if (!country) return null;
                        return (
                          <div
                            key={countryName}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-md text-xs border border-slate-200"
                          >
                            <span className="text-base">{country.flag}</span>
                            <span className="text-slate-700">
                              {country.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-start gap-2 mt-3 flex-wrap">
                  <Badge
                    variant="outline"
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
                <p className="text-slate-700 mt-6 max-w-[559px] leading-relaxed text-base font-normal">
                  {app.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-start items-center mt-4 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLike}
                className={clsx(
                  "h-10 rounded-[6px] py-[1px] px-[13px] font-normal",
                  app.isLiked && "!bg-[#9333EA] !text-white"
                )}
              >
                {user ? (
                  <Heart className="h-4 w-4" />
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.3335 7.33333V4.66667C5.3335 3.95942 5.61445 3.28115 6.11454 2.78105C6.61464 2.28095 7.29292 2 8.00016 2C8.70741 2 9.38568 2.28095 9.88578 2.78105C10.3859 3.28115 10.6668 3.95942 10.6668 4.66667V7.33333M3.3335 8.66667C3.3335 8.31304 3.47397 7.97391 3.72402 7.72386C3.97407 7.47381 4.31321 7.33333 4.66683 7.33333H11.3335C11.6871 7.33333 12.0263 7.47381 12.2763 7.72386C12.5264 7.97391 12.6668 8.31304 12.6668 8.66667V12.6667C12.6668 13.0203 12.5264 13.3594 12.2763 13.6095C12.0263 13.8595 11.6871 14 11.3335 14H4.66683C4.31321 14 3.97407 13.8595 3.72402 13.6095C3.47397 13.3594 3.3335 13.0203 3.3335 12.6667V8.66667ZM7.3335 10.6667C7.3335 10.8435 7.40373 11.013 7.52876 11.1381C7.65378 11.2631 7.82335 11.3333 8.00016 11.3333C8.17697 11.3333 8.34654 11.2631 8.47157 11.1381C8.59659 11.013 8.66683 10.8435 8.66683 10.6667C8.66683 10.4899 8.59659 10.3203 8.47157 10.1953C8.34654 10.0702 8.17697 10 8.00016 10C7.82335 10 7.65378 10.0702 7.52876 10.1953C7.40373 10.3203 7.3335 10.4899 7.3335 10.6667Z"
                      stroke="black"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
                {app.isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleAddToCompare(app);
                  setShowCompare(true);
                }}
                className="h-10 rounded-[6px] py-[1px] px-[13px] font-normal"
              >
                <GitCompare className="h-4 w-4" />
                Compare
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-[6px] py-[1px] px-[13px] font-normal"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                size="sm"
                className="h-10 rounded-[6px] py-[1px] px-[13px] font-normal"
              >
                <ExternalLink className="h-4 w-4" />
                View App
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="container px-4 md:px-0 py-12">
          {/* UI Screens Collection */}
          <div className="mb-8">
            {/* Scr Filters */}
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-0 md:items-center justify-between mb-9">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col md:flex-row items-start gap-2 md:gap-0 md:items-center md:space-x-2">
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
                        className={clsx(
                          "h-[38px] text-xs font-normal py-2 px-3 rounded-[6px]",
                          selectedScreenCategory === category
                            ? "!bg-[#0F172A]"
                            : "bg-transparent"
                        )}
                      >
                        {category}
                        <Badge
                          variant="secondary"
                          className={clsx(
                            "text-[10px] font-bold",
                            selectedScreenCategory === category
                              ? "!bg-[#9333EA] text-white"
                              : "!bg-[#F1F5F9] text-[#0F172A]"
                          )}
                        >
                          {category === "All"
                            ? app?.screens.length
                            : groupedScreens[category]?.length || 0}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center bg-white rounded-lg p-1 gap-2">
                <Button
                  variant={screenViewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setScreenViewMode("grid")}
                  className={clsx(
                    "h-9 p-3 rounded-[6px]",
                    screenViewMode === "grid"
                      ? "bg-[#0F172A]"
                      : "border border-solid border-[#E2E8F0]"
                  )}
                >
                  <Grid3X3 className="h-3 w-3" />
                  Grid
                </Button>
                <Button
                  variant={screenViewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setScreenViewMode("list")}
                  className={clsx(
                    "h-9 p-3 rounded-[6px]",
                    screenViewMode === "list"
                      ? "bg-[#0F172A]"
                      : "border border-solid border-[#E2E8F0]"
                  )}
                >
                  <List className="h-3 w-3" />
                  List
                </Button>
              </div>
            </div>
            {/* Screens Grid/List/Horizontal */}
            {screenViewMode === "list" ? (
              <div className="space-y-8">
                {Object.entries(groupedScreensFilter).map(
                  ([category, screens]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                        <span>{category}</span>
                        <Badge variant="outline" className="text-sm">
                          {screens.length} screen
                          {screens.length !== 1 ? "s" : ""}
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
                              </div>
                              <h4 className="font-[Inter] mt-1 font-medium text-[12px] leading-[100%] tracking-[0%] align-middle text-[#565D61]">
                                {screen.modul} - {screen?.category?.name} -{" "}
                                {screen.name}
                              </h4>
                            </div>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="flex gap-8 flex-col items-start  w-full">
                {Object.entries(groupedScreensFilter).map(([key, screens]) => (
                  <div
                    className="flex gap-4 flex-col items-start w-full"
                    key={key}
                  >
                    <div className="h-8 py-2 px-4 flex items-center justify-center font-[Inter] font-bold text-[16px] leading-[16px] tracking-[0%] text-[#020817] rounded-full border border-solid border-[#E2E8F0]">
                      {key}
                    </div>
                    <div className="flex items-start max-w-full pr-5 overflow-x-auto gap-7">
                      {screens.map((screen, i) => (
                        <div
                          key={i}
                          className="w-full flex flex-col items-start gap-1 hover:cursor-pointer"
                          onClick={() => setSelectedScreen(screen)}
                        >
                          <h4 className="font-[Inter] font-medium text-[12px] leading-[100%] tracking-[0%] align-middle text-[#565D61]">
                            {screen.modul} - {screen?.category?.name} -{" "}
                            {screen.name}
                          </h4>
                          <ImageWithFallback
                            src={
                              screen?.image ??
                              "https://source.unsplash.com/400x300?game"
                            }
                            fallbackSrc="https://placehold.co/400"
                            alt={screen.name}
                            className="min-w-[272px] max-w-[272px]  h-[603px] object-cover rounded-[8px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scr Image Modal */}
        {selectedScreen && (
          <ScreenImageModalV2
            screen={selectedScreen}
            isOpen={!!selectedScreen}
            onClose={() => setSelectedScreen(null)}
            onImageUpdate={(newImage) => {}}
            allScreens={filteredScreens}
            onScreenChange={handleScreenChange}
          />
        )}

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
      </div>

      <AuthModal
        initialMode="login"
        isOpen={isOpenAuth}
        onClose={onCloseOpenAuth}
      />
    </>
  );
};

export default AppDetails;
