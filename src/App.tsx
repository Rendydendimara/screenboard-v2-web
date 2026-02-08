import Admin from "@/pages/Admin";
import AdminAppDetails from "@/pages/AdminAppDetails";
import AdminComponentDetails from "@/pages/AdminComponentDetails";
import AdminGlobalComponentDetails from "@/pages/AdminGlobalComponentDetails";
import AppDetails from "@/pages/AppDetail/useView";
import Index from "@/pages/Home/useView";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminAuthAPI from "./api/admin/auth/api";
import CModalDialogLoading from "./components/modal-dialog-loading";
import { useAppDispatch } from "./hooks/use-typed-selector";
import { setCredentials } from "./provider/slices/authSlice";
import { LoginAdmin } from "./pages/LoginAdmin";
import FavoritesPage from "./pages/Favorites";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import Component from "@/pages/Component/useView";
import ComponentDetail from "@/pages/ComponentDetail/useView";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminApps from "@/pages/AdminApps";
import AdminModules from "@/pages/AdminModules";
import AdminScreenshots from "@/pages/AdminScreenshots";
import AdminPlans from "@/pages/AdminPlans";
import AdminGlobalComponents from "@/pages/AdminGlobalComponents";
import AdminUsers from "@/pages/AdminUsers";
import { usePageTracking } from "./hooks/use-page-tracking";
import { identifyUser } from "./lib/analytics";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
      <Route path="/app/:id" element={<AppDetails />} />
      {/* <Route path="/favorites" element={<FavoritesPage />} /> */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
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
