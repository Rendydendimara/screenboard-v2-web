import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Calendar,
  Shield,
  CreditCard,
  Package,
  LogOut,
  CheckCircle,
  XCircle,
  Crown,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Bookmark,
  Heart,
  Clock,
  Download,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { useTypedSelector, useAppDispatch } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import UserSubscriptionAPI from "@/api/user/subscription/api";
import { TSubscription } from "@/api/user/subscription/type";
import { useToast } from "@/hooks/use-toast";
import { logout } from "@/provider/slices/authSlice";
import UserAuthAPI from "@/api/user/auth/api";
import AdminAuthAPI from "@/api/admin/auth/api";
import { CancelSubscriptionDialog } from "@/components/CancelSubscriptionDialog";
import { AuthModal } from "@/components/AuthModal";
import clsx from "clsx";
import { Header } from "@/components/molecules";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useFavorites } from "@/hooks/useFavorites";
import { useScreenHistory } from "@/hooks/useScreenHistory";

type Tab = "overview" | "subscription" | "activity";

export default function Profile() {
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const { bookmarks } = useBookmarks();
  const { favorites } = useFavorites();
  const { history, clearHistory } = useScreenHistory();

  const [subscription, setSubscription] = useState<TSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenAuth, setIsOpenAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscription = async () => {
    setLoadingSubscription(true);
    try {
      const res = await UserSubscriptionAPI.getCurrentSubscription();
      if (res.success) setSubscription(res.data);
    } catch { /* silent */ } finally {
      setLoadingSubscription(false);
    }
  };

  const handleCancelSubscription = async () => {
    const res = await UserSubscriptionAPI.cancelSubscription();
    if (res.success) {
      setSubscription(res.data);
      toast({ title: "Subscription Canceled", description: "Your plan will end at the current billing period." });
    }
  };

  const handleReactivateSubscription = async () => {
    setActionLoading(true);
    try {
      const res = await UserSubscriptionAPI.reactivateSubscription();
      if (res.success) {
        setSubscription(res.data);
        toast({ title: "Subscription Reactivated", description: "Your subscription is active again!" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to reactivate", variant: "destructive" });
    } finally { setActionLoading(false); }
  };

  const handleLogout = async () => {
    try {
      const res = user?.userType === "administrator"
        ? await AdminAuthAPI.logout()
        : await UserAuthAPI.logout();
      if (res.success) { dispatch(logout()); navigate("/"); }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to logout", variant: "destructive" });
    }
  };

  const onCloseOpenAuth = useCallback(() => setIsOpenAuth(false), []);
  const handleOpenAuthModal = useCallback(() => { if (!user) setIsOpenAuth(true); }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!user) return null;

  const initials = user.username.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const hasActive = subscription && ["active", "trialing"].includes(subscription.status);
  const recentHistory = history.slice(0, 10);
  const viewedCount = history.filter((h) => h.action === "viewed").length;
  const downloadedCount = history.filter((h) => h.action === "downloaded").length;

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "subscription", label: "Subscription" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#F8F8FB]">
        <Header scrolled={scrolled} onOpenAuthModal={handleOpenAuthModal} />

        {/* ── HERO STRIP ── */}
        <div className="relative w-full bg-[#0C0C0C] overflow-hidden pt-20">
          {/* blobs */}
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />
          <div className="absolute top-4 right-1/4 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[80px] pointer-events-none" />

          <div className="w-full flex justify-center px-4 md:px-0">
            <div className="w-full max-w-[1200px] py-10 flex items-center gap-6">
              {/* Avatar */}
              <div className="shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold font-secondary select-none ring-4 ring-white/10">
                {initials}
              </div>

              {/* Name / email */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-[28px] font-secondary font-extrabold text-white leading-none">
                    {user.username}
                  </h1>
                  {user.userType === "administrator" ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-secondary font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Admin
                    </span>
                  ) : hasActive ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-secondary font-bold bg-yellow-400/15 text-yellow-300 border border-yellow-400/20">
                      <Sparkles className="w-3 h-3" /> Pro
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-secondary text-[14px] text-white/40">{user.email}</p>
                {user.createdAt && (
                  <p className="mt-0.5 font-secondary text-[12px] text-white/25">
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-colors font-secondary text-[13px]"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="w-full flex justify-center px-4 md:px-0 border-t border-white/[0.06]">
            <div className="w-full max-w-[1200px] flex items-center gap-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={clsx(
                    "relative px-5 py-3.5 font-secondary text-[13px] font-semibold transition-colors",
                    activeTab === tab.key ? "text-white" : "text-white/35 hover:text-white/60"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-400 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="w-full flex justify-center px-4 md:px-0 py-8">
          <div className="w-full max-w-[1200px]">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Bookmark, label: "Bookmarks", value: bookmarks.length, color: "text-purple-600", bg: "bg-purple-50", link: "/bookmarks" },
                    { icon: Heart, label: "Favorites", value: favorites.length, color: "text-rose-500", bg: "bg-rose-50", link: "/favorites" },
                    { icon: Clock, label: "Screens Viewed", value: viewedCount, color: "text-blue-500", bg: "bg-blue-50", link: null },
                    { icon: Download, label: "Downloaded", value: downloadedCount, color: "text-emerald-500", bg: "bg-emerald-50", link: null },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      onClick={() => stat.link && navigate(stat.link)}
                      className={clsx(
                        "bg-white rounded-2xl border border-[#EBEBEB] p-5 flex flex-col gap-3",
                        stat.link && "cursor-pointer hover:border-[#CCCCCC] hover:shadow-sm transition-all"
                      )}
                    >
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                        <stat.icon className={clsx("w-5 h-5", stat.color)} />
                      </div>
                      <div>
                        <p className="text-[28px] font-secondary font-extrabold text-[#0F0F0F] leading-none">{stat.value}</p>
                        <p className="font-secondary text-[12px] text-[#939393] mt-1">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#F0F0F0]">
                    <h2 className="font-secondary font-bold text-[15px] text-[#0F0F0F]">Quick Actions</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F0F0F0]">
                    {[
                      { icon: Bookmark, label: "My Bookmarks", desc: "View saved screens", to: "/bookmarks", color: "text-purple-600" },
                      { icon: Heart, label: "My Favorites", desc: "Screens you liked", to: "/favorites", color: "text-rose-500" },
                      { icon: Package, label: "Browse Apps", desc: "Explore all apps", to: "/", color: "text-blue-500" },
                      { icon: ExternalLink, label: "Request Screen", desc: "Ask for a new capture", to: "/request", color: "text-emerald-500" },
                    ].map((action) => (
                      <Link
                        key={action.label}
                        to={action.to}
                        className="flex items-center gap-4 px-6 py-5 hover:bg-[#FAFAFA] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] group-hover:bg-white flex items-center justify-center transition-colors border border-[#EBEBEB]">
                          <action.icon className={clsx("w-4 h-4", action.color)} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-secondary font-semibold text-[13px] text-[#0F0F0F] leading-none">{action.label}</p>
                          <p className="font-secondary text-[11px] text-[#939393] mt-1 leading-none">{action.desc}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C0C0C0] group-hover:text-[#555] ml-auto transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Account Info */}
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#F0F0F0]">
                    <h2 className="font-secondary font-bold text-[15px] text-[#0F0F0F]">Account Info</h2>
                  </div>
                  <div className="divide-y divide-[#F0F0F0]">
                    {[
                      { icon: Mail, label: "Email", value: user.email },
                      { icon: Shield, label: "Account Type", value: user.userType === "administrator" ? "Administrator" : "Customer" },
                      { icon: Calendar, label: "Member Since", value: user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-4 px-6 py-4">
                        <row.icon className="w-4 h-4 text-[#AAAAAA] shrink-0" />
                        <span className="font-secondary text-[13px] text-[#939393] w-32 shrink-0">{row.label}</span>
                        <span className="font-secondary text-[13px] font-semibold text-[#0F0F0F]">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin shortcut */}
                {user.userType === "administrator" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 bg-[#0F0F0F] rounded-2xl px-6 py-4 hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <Shield className="w-5 h-5 text-purple-400" />
                    <div className="flex-1">
                      <p className="font-secondary font-bold text-[14px] text-white">Admin Dashboard</p>
                      <p className="font-secondary text-[12px] text-white/40">Manage apps, modules, and users</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  </Link>
                )}
              </div>
            )}

            {/* ── SUBSCRIPTION TAB ── */}
            {activeTab === "subscription" && (
              <div className="flex flex-col gap-6 max-w-[720px]">
                {loadingSubscription ? (
                  <div className="bg-white rounded-2xl border border-[#EBEBEB] flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                      <p className="font-secondary text-[13px] text-[#939393]">Loading subscription...</p>
                    </div>
                  </div>
                ) : subscription ? (
                  <>
                    {/* Plan card */}
                    <div className={clsx(
                      "rounded-2xl p-6 border",
                      hasActive
                        ? "bg-gradient-to-br from-[#0C0C0C] to-[#1a0933] border-purple-900/50"
                        : "bg-white border-[#EBEBEB]"
                    )}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {hasActive && <Crown className="w-4 h-4 text-yellow-400" />}
                            <h3 className={clsx("font-secondary font-extrabold text-[22px]", hasActive ? "text-white" : "text-[#0F0F0F]")}>
                              {subscription.planId?.name ?? "—"}
                            </h3>
                          </div>
                          <p className={clsx("font-secondary text-[13px]", hasActive ? "text-white/50" : "text-[#939393]")}>
                            {subscription.planId?.description}
                          </p>
                        </div>
                        {/* Status badge */}
                        <span className={clsx(
                          "shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-secondary font-bold",
                          subscription.status === "active" && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
                          subscription.status === "trialing" && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                          subscription.status === "canceled" && "bg-red-500/20 text-red-400 border border-red-500/30",
                          subscription.status === "past_due" && "bg-orange-500/20 text-orange-400 border border-orange-500/30",
                          !["active","trialing","canceled","past_due"].includes(subscription.status) && "bg-gray-200 text-gray-500",
                        )}>
                          {["active","trialing"].includes(subscription.status) ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1).replace("_", " ")}
                        </span>
                      </div>

                      {/* Price + billing */}
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                          <p className={clsx("font-secondary text-[11px] uppercase tracking-wider", hasActive ? "text-white/30" : "text-[#AAAAAA]")}>Price</p>
                          <p className={clsx("font-secondary font-bold text-[20px] mt-0.5", hasActive ? "text-white" : "text-[#0F0F0F]")}>
                            ${subscription.planId?.price}
                            <span className={clsx("font-normal text-[13px]", hasActive ? "text-white/40" : "text-[#939393]")}>
                              /{subscription.planId?.interval}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className={clsx("font-secondary text-[11px] uppercase tracking-wider", hasActive ? "text-white/30" : "text-[#AAAAAA]")}>
                            {subscription.cancelAtPeriodEnd ? "Ends On" : "Next Billing"}
                          </p>
                          <p className={clsx("font-secondary font-bold text-[20px] mt-0.5", hasActive ? "text-white" : "text-[#0F0F0F]")}>
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>

                      {subscription.cancelAtPeriodEnd && (
                        <div className="mt-4 flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3">
                          <AlertCircle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                          <p className="font-secondary text-[13px] text-orange-300">
                            Your plan will cancel on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                            You still have full access until then.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    {(subscription.planId?.features?.length ?? 0) > 0 && (
                      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#F0F0F0]">
                          <h3 className="font-secondary font-bold text-[14px] text-[#0F0F0F]">Plan Includes</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {subscription.planId!.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="font-secondary text-[13px] text-[#555]">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={async () => {
                          try {
                            const res = await UserSubscriptionAPI.createBillingPortal();
                            if (res.success && res.data.url) window.location.href = res.data.url;
                          } catch (err: any) {
                            toast({ title: "Error", description: err.response?.data?.message || "Failed to open billing portal", variant: "destructive" });
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-[#EBEBEB] bg-white font-secondary font-semibold text-[13px] text-[#0F0F0F] hover:bg-[#F8F8F8] transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        Billing Portal
                      </button>

                      {hasActive && (
                        subscription.cancelAtPeriodEnd ? (
                          <button
                            onClick={handleReactivateSubscription}
                            disabled={actionLoading}
                            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-[#0F0F0F] font-secondary font-semibold text-[13px] text-white hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={clsx("w-4 h-4", actionLoading && "animate-spin")} />
                            Reactivate Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => setShowCancelDialog(true)}
                            disabled={actionLoading}
                            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 bg-red-50 font-secondary font-semibold text-[13px] text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Cancel Plan
                          </button>
                        )
                      )}
                    </div>
                  </>
                ) : (
                  /* No subscription */
                  <div className="bg-white rounded-2xl border border-[#EBEBEB] flex flex-col items-center justify-center py-20 px-8 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mb-5">
                      <Package className="w-8 h-8 text-[#C0C0C0]" />
                    </div>
                    <h3 className="font-secondary font-extrabold text-[20px] text-[#0F0F0F]">No Active Subscription</h3>
                    <p className="font-secondary text-[14px] text-[#939393] mt-2 max-w-[340px]">
                      Unlock full access — unlimited screens, Figma plugin, and weekly digests.
                    </p>
                    <Link
                      to="/pricing"
                      className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#0F0F0F] text-white font-secondary font-semibold text-[13px] hover:bg-[#2a2a2a] transition-colors"
                    >
                      View Plans <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ── ACTIVITY TAB ── */}
            {activeTab === "activity" && (
              <div className="flex flex-col gap-6 max-w-[720px]">
                <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                    <h2 className="font-secondary font-bold text-[15px] text-[#0F0F0F]">Recent Activity</h2>
                    {history.length > 0 && (
                      <button
                        onClick={() => { clearHistory(); }}
                        className="font-secondary text-[12px] text-[#939393] hover:text-red-500 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {recentHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex items-center justify-center mb-4">
                        <Clock className="w-6 h-6 text-[#C0C0C0]" />
                      </div>
                      <p className="font-secondary font-semibold text-[15px] text-[#555]">No activity yet</p>
                      <p className="font-secondary text-[13px] text-[#AAAAAA] mt-1">Screens you view or download will appear here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F0F0F0]">
                      {recentHistory.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 px-6 py-3.5">
                          <div className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            item.action === "downloaded" ? "bg-emerald-50" : "bg-blue-50"
                          )}>
                            {item.action === "downloaded"
                              ? <Package className="w-4 h-4 text-emerald-500" />
                              : <Clock className="w-4 h-4 text-blue-500" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-secondary font-semibold text-[13px] text-[#0F0F0F] truncate">{item.screenName}</p>
                            <p className="font-secondary text-[11px] text-[#939393] truncate">{item.appName} · {item.category}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <span className={clsx(
                              "inline-block px-2 py-0.5 rounded-full text-[10px] font-secondary font-bold uppercase",
                              item.action === "downloaded" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-500"
                            )}>
                              {item.action}
                            </span>
                            <p className="font-secondary text-[11px] text-[#C0C0C0] mt-0.5">
                              {new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CancelSubscriptionDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        subscription={subscription}
        onConfirm={handleCancelSubscription}
      />

      <AuthModal initialMode="login" isOpen={isOpenAuth} onClose={onCloseOpenAuth} />
    </>
  );
}
