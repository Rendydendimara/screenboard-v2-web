import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import { useCallback, useEffect, useRef, useState } from "react";

const useController = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleChangeSearch = useCallback((value: string) => {
    setSearchTerm(value);
    // handleScrollTop();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [scrolledSearch, setScrolledSearch] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const containerMainRef = useRef<HTMLDivElement>(null);

  const [isOpenAuth, setIsOpenAuth] = useState(false);

  const onCloseOpenAuth = useCallback(() => {
    setIsOpenAuth(false);
  }, []);

  const callbackAuth = useCallback(() => {
    // getListData();
  }, []);

  const handleOpenAuthModal = useCallback(() => {
    if (user) return;
    setIsOpenAuth(true);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 375;

      const shouldFixMenu =
        containerMainRef?.current?.getBoundingClientRect().top <= 85;

      setScrolled(isMobile ? window.scrollY > 80 : window.scrollY > 80);
      setScrolledSearch(isMobile ? window.scrollY > 400 : window.scrollY > 680);
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
    setShowCompare,
    callbackAuth,
    handleOpenAuthModal,
    scrolledSearch,
    isOpenAuth,
    onCloseOpenAuth,
  };
};

export default useController;
