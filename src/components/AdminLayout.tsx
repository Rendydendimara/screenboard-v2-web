import AdminAuthAPI from "@/api/admin/auth/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { logout } from "@/provider/slices/authSlice";
import { RootState } from "@/provider/store";
import {
  BarChart3,
  Image,
  Plus,
  Shield,
  Users,
  Package,
  Layers,
  ArrowLeft,
  GitBranch,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const user = useTypedSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.userType === "administrator";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const res = await AdminAuthAPI.logout();
      if (res.success) {
        dispatch(logout());
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <CardTitle>Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please login with admin credentials to access this page.
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin panel.
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      path: "/admin/apps",
      label: "Apps",
      icon: Plus,
    },
    {
      path: "/admin/modules",
      label: "Modules",
      icon: Image,
    },
    {
      path: "/admin/screenshots",
      label: "Screenshots",
      icon: Image,
    },
    {
      path: "/admin/plans",
      label: "Plans",
      icon: Package,
    },
    {
      path: "/admin/global-components",
      label: "Global Components",
      icon: Layers,
    },
    {
      path: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      path: "/admin/flow-diagram",
      label: "Flow Diagram",
      icon: GitBranch,
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Welcome, {user.username}
              </span>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex space-x-2 overflow-x-auto pb-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
