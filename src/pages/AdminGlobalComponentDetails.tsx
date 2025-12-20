import GlobalComponentAPI from "@/api/admin/globalComponent/api";
import {
  IScreenshot,
  TGlobalComponentRes,
} from "@/api/admin/globalComponent/type";
import CModalDialogLoading from "@/components/modal-dialog-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getImageUrl } from "@/utils";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface GlobalComponent {
  id: string;
  name: string;
  description: string;
  link: string;
  tags: string[];
  screenshots: IScreenshot[];
  createdAt: string;
  updatedAt: string | null;
  category: string;
}

const AdminGlobalComponentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingGet, setLoadingGet] = useState(true);
  const [component, setComponent] = useState<GlobalComponent | undefined>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getData = async () => {
    setLoadingGet(true);
    try {
      const res = await GlobalComponentAPI.getDetail(id!);
      const data: TGlobalComponentRes = res.data;

      setComponent({
        id: data._id,
        name: data.name,
        description: data.description,
        link: data.link,
        tags: data.tags,
        screenshots: data.screenshots,
        createdAt: new Date(data.createdAt).toLocaleDateString(),
        updatedAt: data.updatedAt
          ? new Date(data.updatedAt).toLocaleDateString()
          : null,
        category: data?.category?.name,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setLoadingGet(false);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  if (loadingGet) return <CModalDialogLoading isOpen onClose={undefined} />;

  if (!component) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Component Not Found
          </h2>
          <Button onClick={() => navigate("/admin#global-components")}>
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
            onClick={() => navigate("/admin#global-components")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {component.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {component.createdAt}</span>
                </div>
                {component.updatedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {component.updatedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Component Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="font-bold text-2xl text-gray-900">
                {component.screenshots.length}
              </div>
              <div className="text-sm text-gray-600">Screenshots</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="font-bold text-2xl text-gray-900">
                {component.tags.length}
              </div>
              <div className="text-sm text-gray-600">Tags</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <ExternalLink className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="font-bold text-sm text-gray-900">
                <a
                  href={component.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Link
                </a>
              </div>
              <div className="text-sm text-gray-600">External Resource</div>
            </CardContent>
          </Card>
        </div>

        {/* Component Details */}
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Component Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-700">{component.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                <p className="text-gray-700">{component.category}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Link</h4>
                <a
                  href={component.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  {component.link}
                </a>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Screenshots Section */}
        {component.screenshots.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {component.screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
                      onClick={() =>
                        setSelectedImage(getImageUrl(screenshot.filePath))
                      }
                    >
                      <ImageWithFallback
                        src={getImageUrl(screenshot.filePath)}
                        fallbackSrc={getImageUrl(screenshot.filePath)}
                        alt={`Screenshot ${index + 1}`}
                        containerClassName="w-full h-64"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            &times;
          </button>
          <ImageWithFallback
            src={selectedImage}
            fallbackSrc={selectedImage}
            alt="Full size screenshot"
            containerClassName="max-w-[90%] max-h-[90%]"
            className="max-w-[90%] max-h-[90%] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default AdminGlobalComponentDetails;
