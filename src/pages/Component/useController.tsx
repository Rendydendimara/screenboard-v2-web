import AdminAuthAPI from "@/api/admin/auth/api";
import UserAuthAPI from "@/api/user/auth/api";
import GlobalComponentAPI from "@/api/user/globalComponent/api";
import { TGlobalComponentRes } from "@/api/user/globalComponent/type";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { useDebounce } from "@/hooks/useDebounce";
import { logout } from "@/provider/slices/authSlice";
import { removeFromCompare } from "@/provider/slices/compareSlice";
import { RootState } from "@/provider/store";
import { TItemMenuFilter, TMenuFilter } from "@/types/filter";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const MENU_FILTER_CATEGORIES: TMenuFilter = {
  label: "Categories",
  items: [], // Empty because the data come from API
  value: "", // Default
};

const ITEMS_PER_PAGE = 20; // Jumlah item yang di-load per batch

const useController = () => {
  const [listComponent, setListsComponent] = useState<TGlobalComponentRes[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledSearch, setScrolledSearch] = useState(false);
  const [scrolledCategories, setScrolledCategories] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [displayedItemsCount, setDisplayedItemsCount] =
    useState(ITEMS_PER_PAGE);
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const compareApps = useTypedSelector(
    (state: RootState) => state.compare.compareApps
  );
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);
  const navigate = useNavigate();
  const [filterCategories, setFilterCategories] = useState<TMenuFilter>(
    MENU_FILTER_CATEGORIES
  );
  const containerMainRef = useRef<HTMLDivElement>(null);
  const [scrolledFilterMenu, setScrolledFilterMenu] = useState(false);
  // Debounce search term untuk performa lebih baik
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  // Filtered component (semua data yang match filter)
  const allFilteredComponent = useMemo(() => {
    const result = listComponent.filter((component) => {
      const matchesSearch = component.name
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = filterCategories.value
        ? component?.category?._id === filterCategories.value
        : true;

      return matchesSearch && matchesCategory;
    });

    return result;
  }, [listComponent, filterCategories, debouncedSearchTerm]);

  // Apps yang ditampilkan (dengan pagination untuk infinite scroll)
  const filteredComponent = useMemo(() => {
    return allFilteredComponent.slice(0, displayedItemsCount);
  }, [allFilteredComponent, displayedItemsCount]);

  // Reset displayed items ketika filter berubah
  useEffect(() => {
    setDisplayedItemsCount(ITEMS_PER_PAGE);
  }, [debouncedSearchTerm, filterCategories.value]);

  // Function untuk load more items
  const loadMoreItems = useCallback(() => {
    if (displayedItemsCount < allFilteredComponent.length) {
      setDisplayedItemsCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, allFilteredComponent.length)
      );
    }
  }, [displayedItemsCount, allFilteredComponent.length]);

  const hasMoreItems = displayedItemsCount < allFilteredComponent.length;

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
    console.log("id", id);
    navigate(`/component/${id}`);
  }, []);

  const getListData = async () => {
    try {
      setIsLoadingGet(true);
      const res = await GlobalComponentAPI.getAll();
      const data: TGlobalComponentRes[] = res?.data ?? [];
      const uniqCategory = [
        ...new Map(data.map((d) => [d.category._id, d.category])).values(),
      ];
      const itemFilterCategories: TItemMenuFilter[] = [];
      uniqCategory.map((d) => {
        itemFilterCategories.push({
          label: d.name,
          value: d._id,
        });
      });
      setFilterCategories({
        ...filterCategories,
        items: itemFilterCategories,
      });
      setListsComponent(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message ?? err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGet(false);
    }
  };

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

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
    showCompare,
    setShowCompare,
    scrolled,
    scrolledSearch,
    scrolledCategories,
    mobileMenuOpen,
    setMobileMenuOpen,
    isOpenAuth,
    setIsOpenAuth,
    isLoadingGet,
    user,
    compareApps,
    onCloseOpenAuth,
    filteredComponent,
    allFilteredComponent,
    loadMoreItems,
    hasMoreItems,
    handleRemoveFromCompare,
    handleLogout,
    gotoDetail,
    handleOpenAuthModal,
    filterCategories,
    handleChangeFilterCategories,
    containerMainRef,
    scrolledFilterMenu,
  };
};

export default useController;
