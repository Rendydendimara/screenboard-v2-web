import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Star,
  Download,
  Smartphone,
  Building,
  Calendar,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AdminScreenshotManager } from "@/components/AdminScreenshotManager";
import { useToast } from "@/hooks/use-toast";
import { App } from "@/components/AdminAppManager";
import CModalDialogLoading from "@/components/modal-dialog-loading";
import AppAPI from "@/api/admin/app/api";
import { adapterSingleAppBEToFE } from "@/utils/adapterBEToFE";

// Mock data - in a real app this would come from an API
const mockApps = [
  {
    id: 1,
    name: "Spotify",
    category: "Music",
    subcategory: "Streaming",
    platform: "Both" as const,
    image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=150",
    description:
      "Music streaming platform with personalized playlists and social features",
    downloads: "1B+",
    rating: 4.4,
    tags: ["Music", "Streaming", "Premium"],
    color: "#1DB954",
    company: "Spotify Technology",
    lastUpdated: "2024-01-15",
    screenshots: [
      "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=600&fit=crop",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=600&fit=crop",
    ],
  },
  {
    id: 2,
    name: "Instagram",
    category: "Social",
    subcategory: "Photo Sharing",
    platform: "Both" as const,
    image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=150",
    description: "Photo and video sharing social network",
    downloads: "5B+",
    rating: 4.1,
    tags: ["Social", "Photos", "Stories"],
    color: "#E4405F",
    company: "Meta Platforms",
    lastUpdated: "2024-01-20",
    screenshots: [
      "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=300&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=600&fit=crop",
    ],
  },
];

const AdminAppDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingGet, setLoadingGet] = useState(true);
  const [app, setApp] = useState<App | undefined>();

  const getData = async () => {
    setLoadingGet(true);
    try {
      const res = await AppAPI.getDetail(id);
      const data = adapterSingleAppBEToFE(res.data);
      console.log("dataddd", data);
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
          <Button onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${app.name}?`)) {
      toast({
        title: "App Deleted",
        description: `${app.name} has been deleted successfully.`,
      });
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={app.image}
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
                  {app.name}
                </h1>
                <div className="flex items-center space-x-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <Smartphone className="h-3 w-3" />
                    <span>{app.platform}</span>
                  </Badge>
                  <Badge variant="outline">{app.category}</Badge>
                  <Badge variant="outline">{app.subcategory}</Badge>
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
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate(`/admin/app/${app.id}/edit`)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit App
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* App Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <div className="font-bold text-2xl text-gray-900">
                {app.rating}
              </div>
              <div className="text-sm text-gray-600">App Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="font-bold text-2xl text-gray-900">
                {app.downloads}
              </div>
              <div className="text-sm text-gray-600">Downloads</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="font-bold text-2xl text-gray-900">
                {app?.screens?.length ?? 0}
              </div>
              <div className="text-sm text-gray-600">Screenshots</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-3 border-2 border-white shadow-lg"
                style={{ backgroundColor: app.color }}
              />
              <div className="font-bold text-sm text-gray-900">Brand</div>
              <div className="text-sm text-gray-600">Identity</div>
            </CardContent>
          </Card>
        </div>

        {/* App Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>App Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-700">{app.description}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Screenshot
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete App
                </Button>
              </CardContent>
            </Card>
          </div> */}
        </div>

        {/* Screenshots Section */}
        <div className="mt-8">
          <AdminScreenshotManager appId={String(app.id)} />
        </div>
      </div>
    </div>
  );
};

export default AdminAppDetails;
