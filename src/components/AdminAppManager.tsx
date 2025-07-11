import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { FORMAT_INPUT_IMAGE_FILE } from "@/constant/app";
import { useToast } from "@/hooks/use-toast";
import { UploadImageType } from "@/types";
import { adapterListAppBEToFE } from "@/utils/adapterBEToFE";
import { Edit3, ExternalLink, Plus, Save, Star, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CInputFileDragDrop, { CInputFilePreview } from "./ui/CInputFileDragDrop";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import AppAPI from "@/api/admin/app/api";
import { TAppRes } from "@/api/admin/app/type";

export interface App {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  image: string;
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  company: string;
  screenshots: string[];
  screens: string[];
  lastUpdated?: string;
}

interface FormData {
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  image: string;
  description: string;
  downloads: string;
  rating: number;
  tags: string;
  color: string;
  company: string;
}

// // Mock data - in a real app this would come from an API
// const mockApps: App[] = [
//   {
//     id: "1",
//     name: "Spotify",
//     category: "Music",
//     subcategory: "Streaming",
//     platform: "Both",
//     image: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=150",
//     description: "Music streaming platform",
//     downloads: "1B+",
//     rating: 4.4,
//     tags: ["Music", "Streaming", "Premium"],
//     color: "#1DB954",
//     company: "Spotify Technology",
//     screenshots: [],
//   },
//   {
//     id: "2",
//     name: "Instagram",
//     category: "Social",
//     subcategory: "Photo Sharing",
//     platform: "Both",
//     image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=150",
//     description: "Photo and video sharing social network",
//     downloads: "5B+",
//     rating: 4.1,
//     tags: ["Social", "Photos", "Stories"],
//     color: "#E4405F",
//     company: "Meta Platforms",
//     screenshots: [],
//   },
// ];

export const AdminAppManager: React.FC = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  // const fileInputRefSlides = useRef<HTMLInputElement | null>(null);
  const [slideImages, setSlideImages] = useState<UploadImageType[]>([]);
  const [indexImageSlideEdit, setIndexImageSlideEdit] = useState<number>();
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingGet, setisLoadingGet] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    subcategory: "",
    platform: "Both",
    image: "",
    description: "",
    downloads: "+",
    rating: 4.0,
    tags: "",
    color: "#000000",
    company: "",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      subcategory: "",
      platform: "Both",
      image: "",
      description: "",
      downloads: "1K+",
      rating: 4.0,
      tags: "",
      color: "#000000",
      company: "",
    });
    setSlideImages([]);
    setEditingApp(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (app: App) => {
    setFormData({
      name: app.name,
      category: app.category,
      subcategory: app.subcategory,
      platform: app.platform,
      image: app.image,
      description: app.description,
      downloads: app.downloads,
      rating: app.rating,
      tags: app.tags.join(", "),
      color: app.color,
      company: app.company,
    });
    let tempImages: UploadImageType[] = [];
    app.screenshots.forEach((img) => {
      tempImages.push({
        currentImage: undefined,
        isHaveChange: false,
        oldImage: img,
      });
    });
    setSlideImages(tempImages);
    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      const appData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingApp) {
        let oldImages: string[] = [];
        let newImages: File[] = [];
        slideImages.forEach((file) => {
          if (!file.isHaveChange && file.oldImage && !file.currentImage) {
            oldImages.push(file.oldImage);
          } else if (file.currentImage) {
            newImages.push(file.currentImage);
          }
        });

        await AppAPI.update({
          name: appData.name,
          category: appData.category,
          subcategory: appData.subcategory,
          platform: appData.platform as "iOS" | "Android" | "Both",
          iconUrl: appData.image,
          screenshots: newImages,
          description: appData.description,
          downloads: appData.downloads,
          rating: appData.rating,
          tags: appData.tags,
          color: appData.color,
          company: appData.company,
          oldScreenshot: oldImages,
          appId: editingApp.id.toString(),
        });

        toast({
          title: "App Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        let newImages: File[] = [];
        slideImages.forEach((file) => {
          if (file.currentImage) {
            newImages.push(file.currentImage);
          }
        });

        await AppAPI.create({
          name: appData.name,
          category: appData.category,
          subcategory: appData.subcategory,
          platform: appData.platform as "iOS" | "Android" | "Both",
          iconUrl: appData.image,
          screenshots: newImages,
          description: appData.description,
          downloads: appData.downloads,
          rating: appData.rating,
          tags: appData.tags,
          color: appData.color,
          company: appData.company,
        });

        toast({
          title: "App Created",
          description: `${formData.name} has been created successfully.`,
        });
      }
      getListData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    const app = apps.find((d) => d.id.toString() === id);
    if (app) {
      setEditingApp(app);
      setIsModalOpenDelete(true);
    }
  };

  const handleViewApp = (app: App) => {
    navigate(`/admin/app/${app.id}`);
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDropImages = useCallback(
    (image: File[]) => {
      if (image.length > 5) {
        toast({
          title: "Error",
          description: "Maximum images is 5",
        });
      } else {
        let tempBannerImages: UploadImageType[] = [];
        image.forEach((img) => {
          tempBannerImages.push({
            currentImage: img,
            isHaveChange: false,
            oldImage: "",
          });
        });

        setSlideImages([...slideImages, ...tempBannerImages]);
      }
    },
    [slideImages]
  );

  const getImagesPreview = (index: number) => {
    const imageFile = slideImages[index];
    if (imageFile) {
      if (imageFile.currentImage) {
        return URL.createObjectURL(imageFile.currentImage);
      }
      if (imageFile.isHaveChange === false && imageFile.oldImage) {
        return imageFile.oldImage;
      }
      return "";
    }
    return "";
  };

  const onRemoveImages = (index: number) => {
    setSlideImages([
      ...slideImages.slice(0, index),
      {
        ...slideImages[index],
        isHaveChange: true,
        currentImage: undefined,
      },
      ...slideImages.slice(index + 1, slideImages.length),
    ]);
  };

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingApp(undefined);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsLoadingDelete(true);
    try {
      await AppAPI.remove(editingApp.id.toString());
      toast({
        title: "App Deleted",
        description: `${editingApp.name} has been deleted successfully.`,
      });

      getListData();
      handleCloseModalDelete();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }, [editingApp]);

  const getListData = async () => {
    try {
      setisLoadingGet(true);
      const dataRes = await AppAPI.getAll();
      const data: TAppRes[] = dataRes.data;
      const dataTemp: App[] = adapterListAppBEToFE(data);
      setApps(dataTemp);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });

      setisLoadingGet(false);
    } finally {
      setisLoadingGet(false);
      // finally
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>App Management</CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Add New App
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow
                    key={app.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => handleViewApp(app)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={app.image}
                          alt={app.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{app.name}</div>
                          <div className="text-sm text-gray-500">
                            {app.company}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.category}</div>
                        <div className="text-sm text-gray-500">
                          {app.subcategory}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.platform}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{app.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{app.downloads}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewApp(app);
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(app);
                          }}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(app.id, app.name);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90%]">
          <DialogHeader>
            <DialogTitle>
              {editingApp ? "Edit App" : "Create New App"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  App Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company
                </label>
                <Input
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory
                </label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subcategory: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <Select
                value={formData.platform}
                onValueChange={(value: "iOS" | "Android" | "Both") =>
                  setFormData((prev) => ({ ...prev, platform: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iOS">iOS</SelectItem>
                  <SelectItem value="Android">Android</SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                App Icon URL
              </label>
              <Input
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Downloads
                </label>
                <Input
                  value={formData.downloads}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      downloads: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Color
                </label>
                <Input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, color: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="Design, Mobile, UI/UX"
              />
            </div>

            <div>
              <CInputFileDragDrop
                className="!p-4"
                type="inForm"
                handleDrop={handleDropImages}
                labelForm="Screenshots"
                labelBtn="Browse"
                label="Screenshots"
                isRequired
                multiple
                // inputRef={fileInputRefSlides}
                maxFile={5}
                acceptFile={FORMAT_INPUT_IMAGE_FILE}
              />
              <div className="flex w-full items-center gap-1 mt-2 overflow-x-scroll max-w-[622px]">
                {slideImages.map(
                  (_, i) =>
                    getImagesPreview(i) && (
                      <CInputFilePreview
                        src={getImagesPreview(i)}
                        labelForm="Preview"
                        className="w-[200px] min-w-[200px]"
                        onRemove={() => onRemoveImages(i)}
                      />
                    )
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                {editingApp ? "Update" : "Create"} App
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={handleCloseModalDelete}
        onConfirm={handleConfirmDelete}
        isLoadingAction={isLoadingDelete}
        customerName={editingApp?.name ?? ""}
      />
    </div>
  );
};
