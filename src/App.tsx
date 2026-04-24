import React from "react";
import Admin from "@/pages/Admin";
import AdminAppDetails from "@/pages/AdminAppDetails";
import AdminApps from "@/pages/AdminApps";
import AdminComponentDetails from "@/pages/AdminComponentDetails";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminGlobalComponentDetails from "@/pages/AdminGlobalComponentDetails";
import AdminGlobalComponents from "@/pages/AdminGlobalComponents";
import AdminModules from "@/pages/AdminModules";
import AdminPlans from "@/pages/AdminPlans";
import AdminScreenshots from "@/pages/AdminScreenshots";
import AdminUsers from "@/pages/AdminUsers";
import Index from "@/pages/Home/useView";
import HomeV2 from "@/pages/HomeV2/useView";
import ProductIdeasPage from "@/pages/ProductIdeas/useView";
import AppDetailsV2 from "@/pages/AppDetailV2/useView";
import RequestPage from "@/pages/Request";
import PrivacyPolicyPage from "@/pages/PrivacyPolicy";
import TermsPage from "@/pages/Terms";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import AdminAuthAPI from "./api/admin/auth/api";
import CModalDialogLoading from "./components/modal-dialog-loading";
import { usePageTracking } from "./hooks/use-page-tracking";
import { useAppDispatch, useTypedSelector } from "./hooks/use-typed-selector";
import { identifyUser } from "./lib/analytics";
import { LoginAdmin } from "./pages/LoginAdmin";
import ModulePage from "./pages/Module/useView";
import ModuleDetailPage from "./pages/ModuleDetail/useView";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import { setCredentials } from "./provider/slices/authSlice";

function AdminOnlyRoute({ children }: { children: React.ReactNode }) {
  const user = useTypedSelector((state) => state.auth.user);
  if (user?.userType !== "administrator") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RedirectAppV2() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/app/${id}`} replace />;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Track page views automatically
  usePageTracking();

  const checkLogin = async () => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const data = await AdminAuthAPI.checkIsLogin(token);
      dispatch(
        setCredentials({
          token: data.data.token,
          user: data.data,
        })
      );

      // Identify user in analytics
      if (data.data?._id) {
        identifyUser(data.data._id, {
          userId: data.data._id,
          email: data.data.email,
          name: data.data.name,
          role: "admin",
        });
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    } finally {
      setLoading(false);
      // finally
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (loading) {
    return (
      <div>
        <CModalDialogLoading isOpen={loading} onClose={() => null} />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home-v2" element={<HomeV2 />} />
        <Route path="/product-ideas" element={<ProductIdeasPage />} />
        <Route path="/module" element={<AdminOnlyRoute><ModulePage /></AdminOnlyRoute>} />
        <Route path="/module/:id" element={<AdminOnlyRoute><ModuleDetailPage /></AdminOnlyRoute>} />
        <Route path="/app/:id" element={<AppDetailsV2 />} />
        <Route path="/app-v2/:id" element={<RedirectAppV2 />} />
        {/* <Route path="/favorites" element={<FavoritesPage />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/subscription/success" element={<SubscriptionSuccess />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        {/* <Route path="/component" element={<Component />} /> */}
        {/* <Route path="/component/:id" element={<ComponentDetail />} /> */}
        <Route path="/login-admin" element={<LoginAdmin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/apps" element={<AdminApps />} />
        <Route path="/admin/modules" element={<AdminModules />} />
        <Route path="/admin/screenshots" element={<AdminScreenshots />} />
        <Route path="/admin/plans" element={<AdminPlans />} />
        <Route
          path="/admin/global-components"
          element={<AdminGlobalComponents />}
        />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/app/:id" element={<AdminAppDetails />} />
        <Route
          path="/admin/component/:appId"
          element={<AdminComponentDetails />}
        />
        <Route
          path="/admin/global-component/:id"
          element={<AdminGlobalComponentDetails />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
