import Admin from "@/pages/Admin";
import AdminAppDetails from "@/pages/AdminAppDetails";
import AppDetails from "@/pages/AppDetails";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AuthAPI from "./api/admin/auth/api";
import CModalDialogLoading from "./components/modal-dialog-loading";
import { useAppDispatch } from "./hooks/use-typed-selector";
import { setCredentials } from "./provider/slices/authSlice";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  const checkLogin = async () => {
    try {
      const token = localStorage.getItem("token") ?? "";
      const data = await AuthAPI.checkIsLogin(token);
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
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/app/:id" element={<AdminAppDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
