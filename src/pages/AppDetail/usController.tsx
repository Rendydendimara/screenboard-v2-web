import AdminAuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import AppLikeAPI from "@/api/user/appLike/api";
import UserAuthAPI from "@/api/user/auth/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import ScreenAPI from "@/api/user/screen/api";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { logout, setCredentials } from "@/provider/slices/authSlice";
import {
  addToCompare,
  removeFromCompare,
} from "@/provider/slices/compareSlice";
import { RootState } from "@/provider/store";
import {
  adapterListAppBEToFEPublic,
  adapterSingleAppBEToFEPublic,
} from "@/utils/adapterBEToFE";
import { Globe, Monitor, Smartphone } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast as toastify } from "react-toastify";
import { AppPublic, ScreenPublic } from "../Home/useController";
import { TItemMenuFilter, TMenuFilter } from "@/types/filter";

const MENU_FILTER_CATEGORIES: TMenuFilter = {
  label: "Categories",
  items: [], // Empty because the data come from API
  value: [], // Default - multiple selection
  multiSelect: true,
};

const useController = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [selectedScreenCategory, setSelectedScreenCategory] =
    useState<string>("All");
  const [screenViewMode, setScreenViewMode] = useState<
    "grid" | "list" | "horizontal"
  >("list");
  const [selectedScreen, setSelectedScreen] = useState<ScreenPublic | null>(
    null
  );
  const [app, setApp] = useState<AppPublic | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const compareApps = useTypedSelector(
    (state: RootState) => state.compare.compareApps
  );
  const [listApp, setListApp] = useState<AppPublic[]>([]);
  const [categories, setCategories] = useState<TCategoryRes[]>([]);
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledCategories, setScrolledCategories] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterCategories, setFilterCategories] = useState<TMenuFilter>(
    MENU_FILTER_CATEGORIES
  );
  const containerMainRef = useRef<HTMLDivElement>(null);
  const [scrolledFilterMenu, setScrolledFilterMenu] = useState(false);

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
          dispatch(
            setCredentials({
              token: user.token,
              user: {
                ...user,
                appLikes: user.appLikes.filter((d) => d !== app.id),
              },
            })
          );
        } else {
          await AppLikeAPI.like({ appId: app.id });
          setApp({
            ...app,
            isLiked: !app.isLiked,
          });
          dispatch(
            setCredentials({
              token: user.token,
              user: {
                ...user,
                appLikes: [...user.appLikes, app.id],
              },
            })
          );
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
      // O(n) complexity
      const itemsFilterCategory: TItemMenuFilter[] = [];
      const uniqueCategories = new Map();

      data.screens.forEach((d) => {
        const categoryId = d?.category?._id ?? "";
        const categoryName = d?.category?.name ?? "";

        if (categoryId && !uniqueCategories.has(categoryId)) {
          uniqueCategories.set(categoryId, categoryName);
          itemsFilterCategory.push({
            label: categoryName,
            value: categoryId,
          });
        }
      });

      setFilterCategories({
        ...filterCategories,
        items: itemsFilterCategory,
        value: [],
      });
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
    dispatch(addToCompare(app));
  };

  const handleRemoveFromCompare = (appId: string) => {
    dispatch(removeFromCompare(appId));
  };

  // Group by kategori agar bisa ditampilkan per section
  const groupedScreensFilter = useMemo(() => {
    const categoryValues = Array.isArray(filterCategories.value)
      ? filterCategories.value
      : [];

    const screensFiltered =
      categoryValues.length === 0
        ? app?.screens
        : app?.screens?.filter((s) =>
            categoryValues.includes(s.category?._id)
          );

    return screensFiltered?.reduce((acc, screen) => {
      const categoryName = screen.category?.name || "Uncategorized";
      if (!acc[categoryName]) acc[categoryName] = [];
      acc[categoryName].push(screen);
      return acc;
    }, {} as Record<string, any[]>);
  }, [app?.screens, filterCategories.value]);

  const getListApp = async () => {
    try {
      const res = await UserAppAPI.getAll();
      const dataAdpt = adapterListAppBEToFEPublic(res.data);
      setListApp(dataAdpt);
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
      const res = await CategoryAPI.getAll();
      const dataCategory: TCategoryRes[] = res?.data ?? [];

      setCategories(dataCategory);
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

  const handleChangeCategory = useCallback((category: string) => {
    setSelectedScreenCategory(category);
    toastify.info(`Change to category ${category}`);
  }, []);

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

  const handleAddCompare = useCallback(() => {
    const ids = compareApps.map((d) => d.id);
    if (ids.includes(app.id)) return;
    handleAddToCompare(app);
    setShowCompare(true);
  }, [compareApps, app]);

  const handleDownloadScreens = async (categoryId?: string) => {
    try {
      setIsDownloading(true);

      const filter: { app?: string; category?: string } = { app: id };

      // If category is selected and not "All", filter by category
      if (categoryId && selectedScreenCategory !== "All") {
        filter.category = categoryId;
      }

      await ScreenAPI.download(filter);

      const categoryName = app?.screens.find(
        (s) => s.category?._id === categoryId
      )?.category?.name;

      toast({
        title: "Download Started",
        description: categoryName
          ? `Downloading screens from ${categoryName} category...`
          : `Downloading all screens from ${app?.name}...`,
      });
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

  const handleChangeFilterCategories = useCallback(
    (value: string) => {
      const currentValues = Array.isArray(filterCategories.value)
        ? filterCategories.value
        : [];

      // Toggle the value in the array
      const newValue = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      const newFilterCategories: TMenuFilter = {
        ...filterCategories,
        value: newValue,
      };
      setFilterCategories(newFilterCategories);
    },
    [filterCategories]
  );

  useEffect(() => {
    getAppDetail();
  }, []);

  useEffect(() => {
    getListApp();
    getListDataCategory();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 200;

      const shouldFixMenu =
        containerMainRef?.current?.getBoundingClientRect().top <= 85;
      setScrolledFilterMenu(shouldFixMenu);

      setScrolled(isMobile ? window.scrollY > 20 : window.scrollY > 20);
      setScrolledCategories(
        isMobile ? window.scrollY > 400 : window.scrollY > 300
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    // States
    app,
    isLoadingDetail,
    selectedScreenCategory,
    screenViewMode,
    selectedScreen,
    showCompare,
    compareApps,
    listApp,
    categories,
    isOpenAuth,
    scrolled,
    scrolledCategories,
    isDownloading,
    mobileMenuOpen,
    user,
    screenCategories,
    filteredScreens,
    groupedScreens,
    groupedScreensFilter,
    getListCategoryFiltered,
    setSelectedScreenCategory,
    setScreenViewMode,
    setSelectedScreen,
    setShowCompare,
    setIsOpenAuth,
    setMobileMenuOpen,
    getPlatformIcon,
    toggleLike,
    handleScreenChange,
    handleLogout,
    handleAddToCompare,
    handleRemoveFromCompare,
    onCloseOpenAuth,
    handleChangeCategory,
    handleOpenAuthModal,
    handleAddCompare,
    handleDownloadScreens,
    navigate,
    filterCategories,
    containerMainRef,
    scrolledFilterMenu,
    handleChangeFilterCategories,
  };
};

export default useController;
