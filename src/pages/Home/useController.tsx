import AdminAuthAPI from "@/api/admin/auth/api";
import { TSubcategoryRes } from "@/api/admin/subcategory/type";
import UserAppAPI from "@/api/user/app/api";
import AppLikeAPI from "@/api/user/appLike/api";
import UserAuthAPI from "@/api/user/auth/api";
import CategoryAPI from "@/api/user/category/api";
import { TCategoryRes } from "@/api/user/category/type";
import ScreenAPI from "@/api/user/screen/api";
import SubcategoryAPI from "@/api/user/subcategory/api";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { useFavorites } from "@/hooks/useFavorites";
import { useDebounce } from "@/hooks/useDebounce";
import { logout, setCredentials } from "@/provider/slices/authSlice";
import {
  addToCompare,
  removeFromCompare,
} from "@/provider/slices/compareSlice";
import { RootState } from "@/provider/store";
import { TItemMenuFilter, TMenuFilter } from "@/types/filter";
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

const MENU_FILTER_SORT_BY: TMenuFilter = {
  label: "Sort by",
  items: [
    {
      label: "Newest",
      value: "newest",
    },
    {
      label: "Oldest",
      value: "oldest",
    },
  ],
  value: "", // Default - single selection
  multiSelect: false,
};
const MENU_FILTER_CATEGORIES: TMenuFilter = {
  label: "Categories",
  items: [], // Empty because the data come from API
  value: ["All"], // Default - multiple selection
  multiSelect: true,
};
const MENU_FILTER_SUB_CATEGORIES: TMenuFilter = {
  label: "Sub Categories",
  items: [], // Empty because the data come from API
  value: ["All"], // Default - multiple selection
  multiSelect: true,
};
const MENU_FILTER_MARKET: TMenuFilter = {
  label: "Market",
  items: [], // Empty because the data result from calculate
  value: ["All"], // Default - multiple selection
  multiSelect: true,
};
const ITEMS_PER_PAGE = 20; // Jumlah item yang di-load per batch

const useController = () => {
  const [listApp, setListApp] = useState<AppPublic[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TCategoryRes>();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
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
  const [isLoadingGetApp, setIsLoadingGetApp] = useState(true);
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
  const [subCategories, setSubCategories] = useState<TSubcategoryRes[]>([]);
  const [filterSortBy, setFilterSortBy] =
    useState<TMenuFilter>(MENU_FILTER_SORT_BY);
  const [filterCategories, setFilterCategories] = useState<TMenuFilter>(
    MENU_FILTER_CATEGORIES
  );
  const [filterSubCategories, setFilterSubCategories] = useState<TMenuFilter>(
    MENU_FILTER_SUB_CATEGORIES
  );
  const [filterMarket, setFilterMarket] =
    useState<TMenuFilter>(MENU_FILTER_MARKET);
  const containerMainRef = useRef<HTMLDivElement>(null);
  const [scrolledFilterMenu, setScrolledFilterMenu] = useState(false);

  // Debounce search term untuk performa lebih baik
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Filtered apps (semua data yang match filter)
  const allFilteredApps = useMemo(() => {
    const result = listApp.filter((app) => {
      const matchesSearch = app.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());

      // Handle multiple category selection
      const categoryValues = Array.isArray(filterCategories.value)
        ? filterCategories.value.filter((v) => v !== "All")
        : [];
      const matchesCategory =
        categoryValues.length === 0
          ? true
          : categoryValues.includes(app?.category?._id);

      // Handle multiple subcategory selection
      const subCategoryValues = Array.isArray(filterSubCategories.value)
        ? filterSubCategories.value.filter((v) => v !== "All")
        : [];
      const matchesSubCategory =
        subCategoryValues.length === 0
          ? true
          : subCategoryValues.includes(app?.subcategory?._id);

      // Handle multiple market/country selection
      const marketValues = Array.isArray(filterMarket.value)
        ? filterMarket.value.filter((v) => v !== "All")
        : [];
      const hasAllOption = Array.isArray(filterMarket.value)
        ? filterMarket.value.includes("All")
        : false;
      const matchesCountry =
        marketValues.length === 0
          ? true
          : (app?.countries?.length === 0 && hasAllOption) ||
            app?.countries?.some((countryName) =>
              marketValues.includes(countryName)
            );

      return (
        matchesSearch && matchesCategory && matchesCountry && matchesSubCategory
      );
    });

    return filterSortBy.value
      ? filterSortBy.value === "newest"
        ? sortByDate(result, "desc")
        : sortByDate(result, "asc")
      : result;
  }, [
    listApp,
    filterCategories,
    filterSortBy,
    filterSubCategories,
    filterMarket,
    debouncedSearchTerm,
    selectedCountries,
  ]);

  // Apps yang ditampilkan (dengan pagination untuk infinite scroll)
  const filteredApps = useMemo(() => {
    return allFilteredApps.slice(0, displayedItemsCount);
  }, [allFilteredApps, displayedItemsCount]);

  // Reset displayed items ketika filter berubah
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [
    debouncedSearchTerm,
    filterCategories.value,
    filterSubCategories.value,
    filterMarket.value,
    filterSortBy.value,
  ]);

  // Function untuk load more items
  const loadMoreItems = useCallback(() => {
    if (displayedItemsCount < allFilteredApps.length) {
      setDisplayedItemsCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, allFilteredApps.length)
      );
    }
  }, [displayedItemsCount, allFilteredApps.length]);

  const hasMoreItems = displayedItemsCount < allFilteredApps.length;

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
      setIsLoadingGetApp(true);
      const res = await UserAppAPI.getAll();
      const dataAdpt = adapterListAppBEToFEPublic(res.data);
      const listCountries: string[] = [
        ...dataAdpt.flatMap((item) => item.countries ?? []),
      ];
      setListApp(dataAdpt);

      const itemsFilterMarket: TItemMenuFilter[] = [
        {
          label: "All",
          value: "All",
        },
      ];
      listCountries.map((d) => {
        itemsFilterMarket.push({
          label: d,
          value: d,
        });
      });
      setFilterMarket({
        ...filterMarket,
        items: itemsFilterMarket,
        value: ["All"],
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message ?? err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGetApp(false);
    }
  };

  const getListDataCategory = async () => {
    try {
      setIsLoadingGetCategory(true);
      const res = await Promise.all([
        CategoryAPI.getAll(),
        SubcategoryAPI.getAll(),
      ]);
      const dataCategory: TCategoryRes[] = res[0]?.data ?? [];
      const dataSubCategory: TSubcategoryRes[] = res[1]?.data ?? [];
      const itemsFilterCategory: TItemMenuFilter[] = [
        {
          label: "All",
          value: "All",
        },
      ];
      const itemsFilterSubCategory: TItemMenuFilter[] = [
        {
          label: "All",
          value: "All",
        },
      ];
      dataCategory.map((d) => {
        itemsFilterCategory.push({
          label: d.name,
          value: d._id,
        });
      });
      dataSubCategory.map((d) => {
        itemsFilterSubCategory.push({
          label: d.name,
          value: d._id,
        });
      });
      setCategories(dataCategory);
      setSubCategories(dataSubCategory);
      setFilterCategories({
        ...filterCategories,
        items: itemsFilterCategory,
        value: ["All"],
      });
      setFilterSubCategories({
        ...filterSubCategories,
        items: itemsFilterSubCategory,
        value: ["All"],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGetCategory(false);
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

  const handleChangeFilterSortBy = useCallback(
    (value: string) => {
      const newFilter: TMenuFilter = {
        ...filterSortBy,
        value: value === filterSortBy.value ? "" : value,
      };
      setFilterSortBy(newFilter);
    },
    [filterSortBy]
  );

  const handleChangeFilterCategories = useCallback(
    (value: string) => {
      const currentValues = Array.isArray(filterCategories.value)
        ? filterCategories.value
        : [];

      let newValue: string[];

      if (value === "All") {
        // Jika memilih "All", set hanya "All" atau toggle off jika sudah ada
        newValue = currentValues.includes("All") ? [] : ["All"];
      } else {
        // Jika memilih selain "All"
        if (currentValues.includes(value)) {
          // Jika value sudah ada, hapus value tersebut
          newValue = currentValues.filter((v) => v !== value);
        } else {
          // Jika value belum ada, tambahkan dan hapus "All" jika ada
          newValue = [...currentValues.filter((v) => v !== "All"), value];
        }
      }

      const newFilterCategories: TMenuFilter = {
        ...filterCategories,
        value: newValue,
      };

      // Update subcategories based on selected categories
      const categoryValuesFiltered = newValue.filter((v) => v !== "All");
      const newItemsFilterSubCategory: TItemMenuFilter[] = [
        {
          label: "All",
          value: "All",
        },
        ...subCategories
          .filter((d) =>
            categoryValuesFiltered.length === 0
              ? true
              : categoryValuesFiltered.includes(d.categoryId._id)
          )
          .map((d) => {
            return {
              label: d.name,
              value: d._id,
            };
          }),
      ];

      setFilterCategories(newFilterCategories);

      // Update subcategories filter
      const currentSubValues = Array.isArray(filterSubCategories.value)
        ? filterSubCategories.value
        : [];
      const validSubValues = currentSubValues.filter((subValue) =>
        newItemsFilterSubCategory.some((item) => item.value === subValue)
      );

      setFilterSubCategories({
        ...filterSubCategories,
        items: newItemsFilterSubCategory,
        value: validSubValues,
      });
    },
    [filterCategories, filterSubCategories, subCategories]
  );

  const handleChangeFilterSubCategories = useCallback(
    (value: string) => {
      const currentValues = Array.isArray(filterSubCategories.value)
        ? filterSubCategories.value
        : [];

      let newValue: string[];

      if (value === "All") {
        // Jika memilih "All", set hanya "All" atau toggle off jika sudah ada
        newValue = currentValues.includes("All") ? [] : ["All"];
      } else {
        // Jika memilih selain "All"
        if (currentValues.includes(value)) {
          // Jika value sudah ada, hapus value tersebut
          newValue = currentValues.filter((v) => v !== value);
        } else {
          // Jika value belum ada, tambahkan dan hapus "All" jika ada
          newValue = [...currentValues.filter((v) => v !== "All"), value];
        }
      }

      const newFilterSubCategories: TMenuFilter = {
        ...filterSubCategories,
        value: newValue,
      };
      setFilterSubCategories(newFilterSubCategories);
    },
    [filterSubCategories]
  );

  const handleChangeFilterMarket = useCallback(
    (value: string) => {
      const currentValues = Array.isArray(filterMarket.value)
        ? filterMarket.value
        : [];

      let newValue: string[];

      if (value === "All") {
        // Jika memilih "All", set hanya "All" atau toggle off jika sudah ada
        newValue = currentValues.includes("All") ? [] : ["All"];
      } else {
        // Jika memilih selain "All"
        if (currentValues.includes(value)) {
          // Jika value sudah ada, hapus value tersebut
          newValue = currentValues.filter((v) => v !== value);
        } else {
          // Jika value belum ada, tambahkan dan hapus "All" jika ada
          newValue = [...currentValues.filter((v) => v !== "All"), value];
        }
      }

      const newFilterMarket: TMenuFilter = {
        ...filterMarket,
        value: newValue,
      };
      setFilterMarket(newFilterMarket);
    },
    [filterMarket]
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
    listApp,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    selectedCountries,
    setSelectedCountries,
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
    handleLike,
    handleAddToCompare,
    handleRemoveFromCompare,
    handleLogout,
    gotoDetail,
    handleChangeCategory,
    handleOpenAuthModal,
    handleDownloadScreens,
    filterCategories,
    filterSubCategories,
    filterSortBy,
    filterMarket,
    handleChangeFilterSortBy,
    handleChangeFilterCategories,
    handleChangeFilterSubCategories,
    handleChangeFilterMarket,
    containerMainRef,
    scrolledFilterMenu,
  };
};

export default useController;

// DESC (terbaru dulu): B, A, C
// ASC (terlama dulu): C, A, B
const sortByDate = <T extends { createdAt: string }>(
  data: T[],
  order: "asc" | "desc" = "desc"
): T[] => {
  return data.sort((a, b) =>
    order === "desc"
      ? b.createdAt.localeCompare(a.createdAt)
      : a.createdAt.localeCompare(b.createdAt)
  );
};
