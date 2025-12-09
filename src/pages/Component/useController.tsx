import AdminAuthAPI from "@/api/admin/auth/api";
import UserAppAPI from "@/api/user/app/api";
import AppLikeAPI from "@/api/user/appLike/api";
import UserAuthAPI from "@/api/user/auth/api";
import { TCategoryRes } from "@/api/user/category/type";
import { TGlobalComponentRes } from "@/api/user/globalComponent/type";
import ScreenAPI from "@/api/user/screen/api";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/useFavorites";
import { logout, setCredentials } from "@/provider/slices/authSlice";
import {
  addToCompare,
  removeFromCompare,
} from "@/provider/slices/compareSlice";
import { RootState } from "@/provider/store";
import { TMenuFilter } from "@/types/filter";
import { adapterListAppBEToFEPublic } from "@/utils/adapterBEToFE";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  createdAt: string;
  countries?: string[];
  linkPlayStore?: string;
  linkAppStore?: string;
  linkWebsite?: string;
}

const MENU_FILTER_CATEGORIES: TMenuFilter = {
  label: "Categories",
  items: [
    {
      label: "Marketplace",
      value: "Marketplace",
    },
    {
      label: "Utility",
      value: "Utility",
    },
    {
      label: "E Commerce",
      value: "E Commerce",
    },
    {
      label: "Reservation",
      value: "Reservation",
    },
  ], // Empty because the data come from API
  value: "", // Default
};

const ITEMS_PER_PAGE = 20; // Jumlah item yang di-load per batch

const useController = () => {
  const [listComponent, setListsComponent] = useState<TGlobalComponentRes[]>(
    []
  );
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
  const [isLoadingGetCategory, setIsLoadingGetCategory] = useState(true);
  const [isLoadingGetApp, setIsLoadingGetApp] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_PAGE);
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
  const [filterCategories, setFilterCategories] = useState<TMenuFilter>(
    MENU_FILTER_CATEGORIES
  );
  const containerMainRef = useRef<HTMLDivElement>(null);
  const [scrolledFilterMenu, setScrolledFilterMenu] = useState(false);

  // Debounce search term untuk performa lebih baik
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtered apps (semua data yang match filter)
  const allFilteredApps = useMemo(() => {
    const result = listComponent.filter((app) => {
      const matchesSearch = app.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = filterCategories.value
        ? app?.category?._id === filterCategories.value
        : true;

      return matchesSearch && matchesCategory;
    });

    return result;
  }, [listComponent, filterCategories, debouncedSearchTerm]);

  // Apps yang ditampilkan (dengan pagination untuk infinite scroll)
  const filteredApps = useMemo(() => {
    return allFilteredApps.slice(0, displayedItemsCount);
  }, [allFilteredApps, displayedItemsCount]);

  // Reset displayed items ketika filter berubah
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [debouncedSearchTerm, filterCategories.value]);

  // Function untuk load more items
  const loadMoreItems = useCallback(() => {
    if (displayedItemsCount < allFilteredApps.length) {
      setDisplayedItemsCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, allFilteredApps.length)
      );
    }
  }, [displayedItemsCount, allFilteredApps.length]);

  const hasMoreItems = displayedItemsCount < allFilteredApps.length;

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
    // try {
    //   setIsLoadingGetApp(true);
    //   const res = await UserAppAPI.getAll();
    //   const dataAdpt = adapterListAppBEToFEPublic(res.data);
    //   setListApp(dataAdpt);
    // } catch (err: any) {
    //   toast({
    //     title: "Error",
    //     description: err.message ?? err.response.data.message,
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoadingGetApp(false);
    // }
  };

  const getListDataCategory = async () => {
    // try {
    //   setIsLoadingGetCategory(true);
    //   const res = await Promise.all([
    //     CategoryAPI.getAll(),
    //     SubcategoryAPI.getAll(),
    //   ]);
    //   const dataCategory: TCategoryRes[] = res[0]?.data ?? [];
    //   const itemsFilterCategory: TItemMenuFilter[] = [];
    //   dataCategory.map((d) => {
    //     itemsFilterCategory.push({
    //       label: d.name,
    //       value: d._id,
    //     });
    //   });
    //   setCategories(dataCategory);
    //   setFilterCategories({
    //     ...filterCategories,
    //     items: itemsFilterCategory,
    //     value: "",
    //   });
    // } catch (error: any) {
    //   toast({
    //     title: "Error",
    //     description: error.message || error.response.data.message,
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoadingGetCategory(false);
    // }
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
    const categoriesApp = listComponent.map((app) => app.category._id);
    return categories.filter((cat) => {
      return categoriesApp.includes(cat._id);
    });
  }, [categories, listComponent]);

  const handleChangeFilterCategories = useCallback(
    (value: string) => {
      const newValue = value === filterCategories.value ? "" : value;
      const newFilterCategories: TMenuFilter = {
        ...filterCategories,
        value: newValue,
      };

      setFilterCategories(newFilterCategories);
    },
    [filterCategories]
  );

  useEffect(() => {
    getListDataCategory();
    getListData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 375;

      const shouldFixMenu =
        containerMainRef?.current?.getBoundingClientRect().top <= 85;
      setScrolledFilterMenu(shouldFixMenu);

      setScrolled(isMobile ? window.scrollY > 80 : window.scrollY > 80);
      setScrolledSearch(isMobile ? window.scrollY > 400 : window.scrollY > 680);
      setScrolledCategories(
        isMobile ? window.scrollY > 500 : window.scrollY > 680
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    listComponent,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    viewMode,
    setViewMode,
    showFilters,
    setShowFilters,
    showCompare,
    setShowCompare,
    selectedScreen,
    setSelectedScreen,
    showFavorites,
    setShowFavorites,
    scrolled,
    scrolledSearch,
    scrolledCategories,
    mobileMenuOpen,
    setMobileMenuOpen,
    isOpenAuth,
    setIsOpenAuth,
    isLoadingGetCategory,
    isLoadingGetApp,
    isDownloading,
    selectedApp,
    setSelectedApp,
    categories,
    user,
    compareApps,
    favoriteScreens,
    toggleFavorite,
    onCloseOpenAuth,
    filteredApps,
    allFilteredApps,
    loadMoreItems,
    hasMoreItems,
    getListCategoryFiltered,
    handleAddToCompare,
    handleRemoveFromCompare,
    handleLogout,
    gotoDetail,
    handleChangeCategory,
    handleOpenAuthModal,
    handleDownloadScreens,
    filterCategories,
    handleChangeFilterCategories,
    containerMainRef,
    scrolledFilterMenu,
  };
};

export default useController;
