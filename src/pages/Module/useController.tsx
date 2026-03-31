import ModulAPI from "@/api/user/modul/api";
import { TModulRes } from "@/api/user/modul/type";
import { useToast } from "@/hooks/use-toast";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 9;

const useController = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChangeSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [scrolledSearch, setScrolledSearch] = useState(false);
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const containerMainRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [isOpenAuth, setIsOpenAuth] = useState(false);

  // Module data
  const [moduls, setModuls] = useState<TModulRes[]>([]);
  const [displayedModuls, setDisplayedModuls] = useState<TModulRes[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const hasMoreItems = displayedModuls.length < moduls.length;

  const loadMoreItems = useCallback(() => {
    setDisplayedModuls((prev) => {
      const next = moduls.slice(prev.length, prev.length + PAGE_SIZE);
      return [...prev, ...next];
    });
  }, [moduls]);

  const getListData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ModulAPI.getAll();
      const data: TModulRes[] = res.data;
      setModuls(data);
      setDisplayedModuls(data.slice(0, PAGE_SIZE));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  const callbackAuth = useCallback(() => {
    getListData();
  }, [getListData]);

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

  useEffect(() => {
    getListData();
  }, [getListData]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
      setScrolledSearch(window.scrollY > 680);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    user,
    searchTerm,
    handleChangeSearch,
    scrolled,
    setIsOpenAuth,
    callbackAuth,
    handleOpenAuthModal,
    scrolledSearch,
    isOpenAuth,
    onCloseOpenAuth,
    moduls,
    displayedModuls,
    isLoading,
    hasMoreItems,
    loadMoreItems,
  };
};

export default useController;
