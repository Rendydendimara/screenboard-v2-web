import Admin from "@/pages/Admin";
import AdminAppDetails from "@/pages/AdminAppDetails";
import AdminComponentDetails from "@/pages/AdminComponentDetails";
import AdminGlobalComponentDetails from "@/pages/AdminGlobalComponentDetails";
import AppDetails from "@/pages/AppDetails";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminAuthAPI from "./api/admin/auth/api";
import CModalDialogLoading from "./components/modal-dialog-loading";
import { useAppDispatch } from "./hooks/use-typed-selector";
import { setCredentials } from "./provider/slices/authSlice";
import { LoginAdmin } from "./pages/LoginAdmin";
import FavoritesPage from "./pages/Favorites";
import Subscription from "./pages/Subscription";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

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
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/app/:id" element={<AppDetails />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/subscription/success" element={<SubscriptionSuccess />} />
      <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
      <Route path="/login-admin" element={<LoginAdmin />} />
      <Route path="/admin" element={<Admin />} />
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
  );
};

export default App;
