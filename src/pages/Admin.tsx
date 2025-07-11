import { AdminAppManager } from "@/components/AdminAppManager";
import { AdminModuleManager } from "@/components/AdminModuleManager";
import { AdminScreenshotManager } from "@/components/AdminScreenshotManager";
import { AdminStats } from "@/components/AdminStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTypedSelector } from "@/hooks/use-typed-selector";
import { RootState } from "@/provider/store";
import { BarChart3, Image, Plus, Shield, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const user = useTypedSelector((state: RootState) => state.auth.user);
  // Simple admin check - in a real app this would be a proper role check
  const isAdmin = user?.userType === "administrator";
  const [activeTab, setActiveTab] = useState("stats");
  const navigate = useNavigate();

  const handleChangeTab = useCallback((tab: string) => {
    setActiveTab(tab);
    navigate(`#${tab}`);
  }, []);

  useEffect(() => {
    const hashOnly = window.location.hash.split("?")[0].replace("#", ""); // hasil: "#reports"
    if (hashOnly) {
      setActiveTab(hashOnly);
    }
  }, []);

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
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                Back to App
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue="stats"
          value={activeTab}
          onValueChange={handleChangeTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="apps" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Apps</span>
            </TabsTrigger>
            <TabsTrigger value="modul" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Modul</span>
            </TabsTrigger>{" "}
            <TabsTrigger
              value="screenshots"
              className="flex items-center space-x-2"
            >
              <Image className="h-4 w-4" />
              <span>Screenshots</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          <TabsContent value="modul">
            <AdminModuleManager />
          </TabsContent>

          <TabsContent value="apps">
            <AdminAppManager />
          </TabsContent>

          <TabsContent value="screenshots">
            <AdminScreenshotManager />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  User management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
