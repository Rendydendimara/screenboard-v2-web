import AppAPI from "@/api/admin/app/api";
import { App } from "@/components/AdminAppManager";
import { AdminComponentManager } from "@/components/AdminComponentManager";
import CModalDialogLoading from "@/components/modal-dialog-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useToast } from "@/hooks/use-toast";
import { adapterSingleAppBEToFE } from "@/utils/adapterBEToFE";
import {
  ArrowLeft,
  Building,
  Calendar,
  Smartphone,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminComponentDetails: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingGet, setLoadingGet] = useState(true);
  const [app, setApp] = useState<App | undefined>();

  const getData = async () => {
    setLoadingGet(true);
    try {
      const res = await AppAPI.getDetail(appId);
      const data = adapterSingleAppBEToFE(res.data);
      setApp(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setLoadingGet(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loadingGet) return <CModalDialogLoading isOpen onClose={undefined} />;

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            App Not Found
          </h2>
          <Button onClick={() => navigate("/admin#apps")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin#apps")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src={
                      app?.image ?? "https://source.unsplash.com/400x300?game"
                    }
                    fallbackSrc="https://placehold.co/400"
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white shadow-lg"
                  style={{ backgroundColor: app.color }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {app.name} - Components
                </h1>
                <div className="flex items-center space-x-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>{app.platform}</span>
                  </Badge>
                  <Badge variant="outline">{app.category?.name ?? "-"}</Badge>
                  <Badge variant="outline">
                    {app.subcategory?.name ?? "-"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span>{app.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Updated {new Date(app.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="font-bold text-2xl text-gray-900">
                {app.name}
              </div>
              <div className="text-sm text-gray-600">App Name</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="font-bold text-2xl text-gray-900">
                {app.company}
              </div>
              <div className="text-sm text-gray-600">Company</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-3 border-2 border-white shadow-lg"
                style={{ backgroundColor: app.color }}
              />
              <div className="font-bold text-sm text-gray-900">Brand Color</div>
            </CardContent>
          </Card>
        </div>

        {/* Components Section */}
        <div className="mt-8">
          <AdminComponentManager appId={String(app.id)} />
        </div>
      </div>
    </div>
  );
};

export default AdminComponentDetails;
