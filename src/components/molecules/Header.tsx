import AdminAuthAPI from "@/api/admin/auth/api";
import UserAuthAPI from "@/api/user/auth/api";
import { TCategoryRes } from "@/api/user/category/type";
import { CompareMaxModal } from "@/components/CompareMaxModal";
import { CompareModal } from "@/components/CompareModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAppDispatch, useTypedSelector } from "@/hooks/use-typed-selector";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsEvent, trackEvent } from "@/lib/analytics";
import { logout } from "@/provider/slices/authSlice";
import {
  addToCompare,
  removeFromCompare,
  setShowCompare,
  setShowCompareMaxModal,
} from "@/provider/slices/compareSlice";
import { RootState } from "@/provider/store";
import { AppPublic } from "@/pages/Home/useController";
import clsx from "clsx";
import { GitCompare, Menu, Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  showSearch?: boolean;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (term: string) => void;
  scrolled?: boolean;
  scrolledSearch?: boolean;
  onOpenAuthModal?: () => void;
  transparentBg?: boolean;
  callbackLogout?: () => void;
  availableApps?: AppPublic[];
  categories?: TCategoryRes[];
}

export const Header = ({
  showSearch = false,
  searchTerm = "",
  onSearchChange,
  onSearchSubmit,
  scrolled = false,
  scrolledSearch = false,
  onOpenAuthModal,
  transparentBg = false,
  callbackLogout,
  availableApps = [],
  categories = [],
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localScrolled, setLocalScrolled] = useState(false);

  const user = useTypedSelector((state: RootState) => state.auth.user);
  const compareApps = useTypedSelector(
    (state: RootState) => state.compare.compareApps
  );
  const showCompare = useTypedSelector(
    (state: RootState) => state.compare.showCompare
  );
  const showCompareMaxModal = useTypedSelector(
    (state: RootState) => state.compare.showCompareMaxModal
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setLocalScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      let res;
      if (user?.userType === "administrator") {
        res = await AdminAuthAPI.logout();
      } else {
        res = await UserAuthAPI.logout();
      }
      if (res.success) {
        dispatch(logout());
        navigate("/");
        callbackLogout?.();
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const handleOpenAuth = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    }
  };

  const handleAddToCompare = (app: AppPublic) => {
    const alreadyIn = compareApps.some((a) => a.id === app.id);
    if (!alreadyIn && compareApps.length >= 2) {
      dispatch(setShowCompareMaxModal(true));
      return;
    }
    dispatch(addToCompare(app));
    if (!alreadyIn) {
      trackEvent(AnalyticsEvent.APP_COMPARE, {
        app_id: app.id,
        app_name: app.name,
        compare_count: compareApps.length + 1,
      });
      dispatch(setShowCompare(true));
    }
  };

  const handleRemoveFromCompare = (appId: string) => {
    dispatch(removeFromCompare(appId));
  };

  const isScrolled = scrolled || localScrolled;

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm"
            : transparentBg
            ? "bg-transparent"
            : "bg-white shadow-sm"
        )}
      >
        <div className="px-0">
          <div className="w-full flex justify-center items-center">
            <div className="w-full md:max-w-[700px] lg:max-w-[1200px]">
              <div className="flex w-full items-center justify-between h-16 lg:h-20 px-4 md:px-6 lg:px-0">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                  <img
                    src="/assets/images/logo.png"
                    alt="logo"
                    className="w-[38px] h-[40px] object-cover object-center"
                  />
                  <p className="font-belanosima text-[#9333EA] font-normal text-[24px] leading-[20px] tracking-[0%] text-center align-middle">
                    UXBoard
                  </p>
                </Link>

                <div
                  className={clsx(
                    "hidden md:block w-[369px] transition-all duration-300 ease-in-out overflow-hidden h-[40px]",
                    scrolledSearch
                      ? "max-h-[100px] opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
                  )}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-[1]" />
                    <input
                      placeholder="Search apps..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit(searchTerm);
                      }}
                      className="w-full h-[40px] pl-10 pr-8 rounded-[20px] border border-input bg-background font-primary text-[13px] outline-none focus:ring-0"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => onSearchChange("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-[10px]">
                  <div className="hidden md:flex items-center gap-3">
                    <Link
                      to="/"
                      className={clsx(
                        "w-[110px] h-[36px] flex justify-center items-center opacity-100 gap-[8px] rounded-[6px] pr-[12px] pl-[12px] font-secondary text-[14px] text-center align-middle text-[#323638]",
                        location.pathname === "/" ||
                          location.pathname.includes("app")
                          ? "font-bold"
                          : "font-normal"
                      )}
                    >
                      Applications
                    </Link>
                    <Link
                      to="/home-v2"
                      className={clsx(
                        "h-[36px] flex justify-center items-center opacity-100 gap-[8px] rounded-[6px] pr-[12px] pl-[12px] font-secondary text-[14px] text-center align-middle text-[#323638] whitespace-nowrap",
                        location.pathname === "/home-v2" ? "font-bold" : "font-normal"
                      )}
                    >
                      Home v2.0
                    </Link>
                    {user?.userType === "administrator" && (
                      <Link
                        to="/module"
                        className={clsx(
                          "w-[110px] h-[36px] flex justify-center items-center opacity-100 gap-[8px] rounded-[6px] pr-[12px] pl-[12px] font-secondary  text-[14px] text-center align-middle text-[#323638]",
                          location.pathname.includes("module")
                            ? "font-bold"
                            : "font-normal"
                        )}
                      >
                        Module
                      </Link>
                    )}
                    <a
                      href="https://forms.gle/Mi4GsDznBocUdrMz8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[110px] h-[36px] flex justify-center items-center opacity-100 gap-[8px] rounded-[6px] pr-[12px] pl-[12px] font-secondary font-normal text-[14px] text-center align-middle text-[#323638]"
                    >
                      Request
                    </a>
                  </div>

                  {/* Action Buttons - Desktop */}
                  <div className="hidden md:flex items-center gap-[10px]">
                    {!user && (
                      <button
                        onClick={handleOpenAuth}
                        className="
                        w-[110px]
                        h-[36px]
                        flex items-center justify-center gap-2
                        px-3
                        rounded-md
                        bg-gradient-to-r from-blue-600 to-purple-600
                        border border-[#F2F2F2]
                        font-secondary font-medium text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle
                        text-[#FFFFFF]
                      "
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.66667 8L5.33333 6.53333L5.73333 5.86666M4 3.33333H12L14 6.66666L8.33333 13C8.28988 13.0443 8.23802 13.0796 8.18078 13.1036C8.12355 13.1277 8.06209 13.1401 8 13.1401C7.93792 13.1401 7.87645 13.1277 7.81922 13.1036C7.76198 13.0796 7.71012 13.0443 7.66667 13L2 6.66666L4 3.33333Z"
                            stroke="white"
                            stroke-width="1.3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Join Us
                      </button>
                    )}
                    {user && (
                      <>
                        <button
                          onClick={() => dispatch(setShowCompare(true))}
                          className="
                        relative
                        w-[110px]
                        h-[36px]
                        flex items-center justify-center gap-2
                        px-3
                        rounded-md
                        font-primary font-normal text-[13.3px] leading-[20px] tracking-[0%] text-center align-middle
                        text-[#020817]
                      "
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                              stroke="#020817"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                              stroke="#020817"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M8.6665 4H10.6665C11.0201 4 11.3593 4.14048 11.6093 4.39052C11.8594 4.64057 11.9998 4.97971 11.9998 5.33333V10"
                              stroke="#020817"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M7.33333 12H5.33333C4.97971 12 4.64057 11.8595 4.39052 11.6095C4.14048 11.3594 4 11.0203 4 10.6667V6"
                              stroke="#020817"
                              stroke-width="1.33333"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                          {compareApps.length > 0 && (
                            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {compareApps.length}
                            </Badge>
                          )}
                          Compare
                        </button>

                        <div className="flex items-center gap-2 px-3">
                          <Link to="/profile">
                            <button className="flex items-center gap-4 h-[36px] opacity-100 rounded-[12px] pr-[12px] pl-[12px] bg-[#323638]">
                              <div className="flex items-center gap-2">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M4.112 12.566C4.27701 12.0168 4.61465 11.5355 5.07483 11.1933C5.53502 10.8512 6.09323 10.6665 6.66667 10.6667H9.33333C9.90751 10.6665 10.4664 10.8516 10.9269 11.1945C11.3874 11.5374 11.725 12.0199 11.8893 12.57M2 8C2 8.78793 2.15519 9.56815 2.45672 10.2961C2.75825 11.0241 3.20021 11.6855 3.75736 12.2426C4.31451 12.7998 4.97595 13.2417 5.7039 13.5433C6.43185 13.8448 7.21207 14 8 14C8.78793 14 9.56815 13.8448 10.2961 13.5433C11.0241 13.2417 11.6855 12.7998 12.2426 12.2426C12.7998 11.6855 13.2417 11.0241 13.5433 10.2961C13.8448 9.56815 14 8.78793 14 8C14 7.21207 13.8448 6.43185 13.5433 5.7039C13.2417 4.97595 12.7998 4.31451 12.2426 3.75736C11.6855 3.20021 11.0241 2.75825 10.2961 2.45672C9.56815 2.15519 8.78793 2 8 2C7.21207 2 6.43185 2.15519 5.7039 2.45672C4.97595 2.75825 4.31451 3.20021 3.75736 3.75736C3.20021 4.31451 2.75825 4.97595 2.45672 5.7039C2.15519 6.43185 2 7.21207 2 8ZM6 6.66667C6 7.1971 6.21071 7.70581 6.58579 8.08088C6.96086 8.45595 7.46957 8.66667 8 8.66667C8.53043 8.66667 9.03914 8.45595 9.41421 8.08088C9.78929 7.70581 10 7.1971 10 6.66667C10 6.13623 9.78929 5.62753 9.41421 5.25245C9.03914 4.87738 8.53043 4.66667 8 4.66667C7.46957 4.66667 6.96086 4.87738 6.58579 5.25245C6.21071 5.62753 6 6.13623 6 6.66667Z"
                                    stroke="white"
                                    stroke-width="1.3"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                                <p className="font-[Inter] font-normal text-[13.3px] text-center text-[#FFFFFF]">
                                  {user.username}
                                </p>
                              </div>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 6L8 10L12 6"
                                  stroke="white"
                                  stroke-width="1.3"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </button>
                          </Link>
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
                      </>
                    )}
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="sm">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                    <div className="flex flex-col gap-4 mt-8">
                      {/* Navigation Links */}
                      <div className="flex flex-col gap-2 pb-4 border-b">
                        <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className={clsx(
                              "w-full justify-start gap-2",
                              (location.pathname === "/" ||
                                location.pathname.includes("app")) &&
                                "bg-slate-100 font-bold"
                            )}
                          >
                            Applications
                          </Button>
                        </Link>
                        <Link to="/home-v2" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className={clsx(
                              "w-full justify-start gap-2",
                              location.pathname === "/home-v2" && "bg-slate-100 font-bold"
                            )}
                          >
                            Home v2.0
                          </Button>
                        </Link>
                        {user?.userType === "administrator" && (
                          <Link
                            to="/module"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Button
                              variant="ghost"
                              className={clsx(
                                "w-full justify-start gap-2",
                                location.pathname.includes("module") &&
                                  "bg-slate-100 font-bold"
                              )}
                            >
                              Module
                            </Button>
                          </Link>
                        )}
                        <a
                          href="https://forms.gle/Mi4GsDznBocUdrMz8"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full"
                        >
                          <Button variant="ghost" className="w-full justify-start gap-2">
                            Request
                          </Button>
                        </a>
                      </div>

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

                          <Button
                            variant="ghost"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              dispatch(setShowCompare(true));
                            }}
                            className="w-full justify-start gap-2 relative"
                          >
                            <GitCompare className="h-5 w-5" />
                            Compare
                            {compareApps.length > 0 && (
                              <Badge className="absolute right-4 h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {compareApps.length}
                              </Badge>
                            )}
                          </Button>

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
                                xmlns="http://www.w3.org/2000/svg"
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

                          <div className="border-t pt-4">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                              }}
                              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Logout
                            </Button>
                          </div>

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
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleOpenAuth();
                          }}
                          className="w-full justify-start gap-2"
                        >
                          Join Us
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CompareModal
        isOpen={showCompare}
        setShowCompare={(show) => dispatch(setShowCompare(show))}
        onClose={() => dispatch(setShowCompare(false))}
        apps={compareApps}
        onRemoveApp={handleRemoveFromCompare}
        onAddApp={handleAddToCompare}
        availableApps={availableApps}
        categories={categories}
      />

      <CompareMaxModal
        isOpen={showCompareMaxModal}
        onClose={() => dispatch(setShowCompareMaxModal(false))}
      />
    </>
  );
};
