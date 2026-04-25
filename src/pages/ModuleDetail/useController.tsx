import ModulAPI from "@/api/user/modul/api";
import { TModulApp, TModulAppScreen, TModulRes } from "@/api/user/modul/type";
import { useToast } from "@/hooks/use-toast";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import { TMenuFilter } from "@/types/filter";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ScreenPublic } from "../Home/useController";

const MENU_FILTER_CATEGORIES: TMenuFilter = {
  label: "Categories",
  items: [],
  value: [],
  multiSelect: true,
};

export const toScreenPublic = (
  screen: TModulAppScreen,
  appName: string
): ScreenPublic => ({
  id: screen._id,
  name: screen.name || "",
  category: screen.category ?? undefined,
  image: screen.image,
  description: screen.description || "",
  appName,
  modul: "",
  order: screen.order,
});

const useController = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();

  const [modulName, setModulName] = useState("");
  const [modulDescription, setModulDescription] = useState<string | null>(null);
  const [totalApps, setTotalApps] = useState(0);
  const [apps, setApps] = useState<TModulApp[]>([]);
  const [allModuls, setAllModuls] = useState<TModulRes[]>([]);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [selectedScreen, setSelectedScreen] = useState<ScreenPublic | null>(null);
  const [selectedScreenApp, setSelectedScreenApp] = useState<TModulApp | null>(null);

  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [filterCategories, setFilterCategories] =
    useState<TMenuFilter>(MENU_FILTER_CATEGORIES);
  const containerMainRef = useRef<HTMLDivElement>(null);
  const [scrolledFilterMenu, setScrolledFilterMenu] = useState(false);

  const getModulDetail = useCallback(async () => {
    if (!id) return;
    setIsLoadingDetail(true);
    try {
      const res = await ModulAPI.getDetail(id);
      const data = res.data;

      setModulName(data.modul.name);
      setModulDescription(data.modul.description);
      setTotalApps(data.apps.length);
      setApps(data.apps);

      // Build category filter from app categories
      const categoriesMap = new Map<string, string>();
      data.apps.forEach((app: TModulApp) => {
        if (app.category?._id && !categoriesMap.has(app.category._id)) {
          categoriesMap.set(app.category._id, app.category.name);
        }
      });

      setFilterCategories({
        ...MENU_FILTER_CATEGORIES,
        items: Array.from(categoriesMap.entries()).map(([id, name]) => ({
          label: name,
          value: id,
        })),
        value: [],
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  }, [id]);

  const filteredApps = useMemo(() => {
    const categoryValues = Array.isArray(filterCategories.value)
      ? filterCategories.value
      : [];
    if (categoryValues.length === 0) return apps;
    return apps.filter(
      (app) => app.category && categoryValues.includes(app.category._id)
    );
  }, [apps, filterCategories.value]);

  // All screens from same app as selected screen — for modal navigation
  const selectedAppScreens = useMemo((): ScreenPublic[] => {
    if (!selectedScreenApp) return [];
    return selectedScreenApp.screens.map((s) =>
      toScreenPublic(s, selectedScreenApp.name)
    );
  }, [selectedScreenApp]);

  const handleSelectScreen = useCallback(
    (screen: TModulAppScreen, app: TModulApp) => {
      setSelectedScreen(toScreenPublic(screen, app.name));
      setSelectedScreenApp(app);
    },
    []
  );

  const handleScreenChange = useCallback((newScreen: ScreenPublic) => {
    setSelectedScreen(newScreen);
  }, []);

  const handleChangeFilterCategories = useCallback((value: string) => {
    setFilterCategories((prev) => {
      const current = Array.isArray(prev.value) ? prev.value : [];
      const newValue = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, value: newValue };
    });
  }, []);

  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

  const getAllModuls = useCallback(async () => {
    try {
      const res = await ModulAPI.getAll();
      setAllModuls(res.data ?? []);
    } catch {
      // silent — not critical
    }
  }, []);

  useEffect(() => {
    getModulDetail();
    getAllModuls();
  }, [getModulDetail, getAllModuls]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldFixMenu =
        containerMainRef?.current?.getBoundingClientRect().top <= 85;
      setScrolledFilterMenu(shouldFixMenu);
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    modulName,
    modulDescription,
    totalApps,
    apps,
    allModuls,
    id,
    filteredApps,
    isLoadingDetail,
    selectedScreen,
    setSelectedScreen,
    selectedAppScreens,
    isOpenAuth,
    scrolled,
    user,
    filterCategories,
    containerMainRef,
    scrolledFilterMenu,
    setIsOpenAuth,
    handleChangeFilterCategories,
    handleSelectScreen,
    handleScreenChange,
    onCloseOpenAuth,
    handleOpenAuthModal,
    navigate,
  };
};

export default useController;
