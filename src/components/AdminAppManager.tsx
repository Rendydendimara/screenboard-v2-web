import AppAPI from "@/api/admin/app/api";
import { TAppRes } from "@/api/admin/app/type";
import CategoryAPI from "@/api/admin/category/api";
import { TCategoryRes } from "@/api/admin/category/type";
import SubcategoryAPI from "@/api/admin/subcategory/api";
import { TSubcategoryRes } from "@/api/admin/subcategory/type";
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
import {
  Component,
  Edit3,
  ExternalLink,
  Plus,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import CInputFileDragDrop, { CInputFilePreview } from "./ui/CInputFileDragDrop";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ImageWithFallback from "./ui/ImageWithFallback";
import { CountryMultiSelect } from "./ui/CountryMultiSelect";

export interface App {
  id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
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
  iconFile?: string;
  countries?: string[];
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
  countries: string[];
}

interface FormDataCategory {
  name: string;
}

interface FormDataSubcategory {
  name: string;
  categoryId: string;
}

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
  const [modalFormType, setModalFormType] = useState<
    "app" | "category" | "subcategory"
  >("app");
  const [editingCategory, setEditingCategory] = useState<TCategoryRes | null>(
    null
  );
  const [editingSubcategory, setEditingSubcategory] =
    useState<TSubcategoryRes | null>(null);
  const [categories, setCategories] = useState<TCategoryRes[]>([]);
  const [subcategories, setSubcategories] = useState<TSubcategoryRes[]>([]);
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
    countries: [],
  });
  const [formDataCategory, setFormDataCategory] = useState<FormDataCategory>({
    name: "",
  });
  const [formDataSubcategory, setFormDataSubcategory] =
    useState<FormDataSubcategory>({
      name: "",
      categoryId: "",
    });
  const [activeTab, setActiveTab] = useState<
    "Apps" | "Category" | "Subcategory"
  >("Apps");
  const [icon, setIcon] = useState<UploadImageType>({
    oldImage: "",
    currentImage: undefined,
    isHaveChange: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
      countries: [],
    });
    setSlideImages([]);
    setEditingApp(null);
  };

  const resetFormCategory = () => {
    setFormDataCategory({
      name: "",
    });
    setEditingCategory(null);
  };

  const resetFormSubcategory = () => {
    setFormDataSubcategory({
      name: "",
      categoryId: "",
    });
    setEditingSubcategory(null);
  };

  const handleCreate = () => {
    setModalFormType("app");
    resetForm();
    setIsModalOpen(true);
  };

  const handleCreateCategory = () => {
    setModalFormType("category");
    resetFormCategory();
    setIsModalOpen(true);
  };

  const handleCreateSubcategory = () => {
    setModalFormType("subcategory");
    resetForm();
    setIsModalOpen(true);
  };

  const handleCancelIcon = () => {
    setIcon({
      ...icon,
      isHaveChange: false,
    });
  };

  const onRemoveIcon = useCallback(() => {
    setIcon({
      ...icon,
      isHaveChange: true,
      currentImage: undefined,
    });
  }, []);

  const handleEdit = (app: App) => {
    setModalFormType("app");
    setFormData({
      name: app.name,
      category: app.category?._id ?? "",
      subcategory: app.subcategory?._id ?? "",
      platform: app.platform,
      image: app.image,
      description: app.description,
      downloads: app.downloads,
      rating: app.rating,
      tags: app.tags.join(", "),
      color: app.color,
      company: app.company,
      countries: app?.countries ?? [],
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
    setIcon({
      currentImage: undefined,
      isHaveChange: false,
      oldImage: app.iconFile,
    });

    setEditingApp(app);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      if (modalFormType === "app") {
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
            oldIcon: icon.oldImage,
            icon: icon.currentImage,
            countries: appData.countries,
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
            icon: icon.currentImage,
            countries: appData.countries,
          });

          toast({
            title: "App Created",
            description: `${formData.name} has been created successfully.`,
          });
        }
        getListData();
        setIsModalOpen(false);
        resetForm();
      } else if (modalFormType === "category") {
        const appData = {
          ...formDataCategory,
        };
        if (editingCategory) {
          await CategoryAPI.update({
            name: appData.name,
            categoryId: editingCategory._id,
          });

          toast({
            title: "Category Updated",
            description: `${formDataCategory.name} has been updated successfully.`,
          });
        } else {
          await CategoryAPI.create({
            name: appData.name,
          });

          toast({
            title: "Category Created",
            description: `${formDataCategory.name} has been created successfully.`,
          });
        }
        getListDataCategory();
        setIsModalOpen(false);
        resetFormCategory();
      } else if (modalFormType === "subcategory") {
        const appData = {
          ...formDataSubcategory,
        };
        if (editingSubcategory) {
          await SubcategoryAPI.update({
            name: appData.name,
            categoryId: appData.categoryId,
            subcategoryId: editingSubcategory._id,
          });

          toast({
            title: "Subcategory Updated",
            description: `${formDataSubcategory.name} has been updated successfully.`,
          });
        } else {
          await SubcategoryAPI.create({
            name: appData.name,
            categoryId: appData.categoryId,
          });

          toast({
            title: "Subcategory Created",
            description: `${formDataSubcategory.name} has been created successfully.`,
          });
        }
        getListDataSubcategory();
        setIsModalOpen(false);
        resetFormSubcategory();
      }
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

  const handleViewComponent = (app: App) => {
    navigate(`/admin/component/${app.id}`);
  };

  const filteredApps = apps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDropImages = useCallback(
    (image: File) => {
      if (image) {
        setSlideImages([
          {
            currentImage: image,
            isHaveChange: false,
            oldImage: "",
          },
        ]);
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
      ...slideImages.slice(index + 1, slideImages.length),
    ]);
  };

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingApp(undefined);
    setEditingCategory(undefined);
    setEditingSubcategory(undefined);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsLoadingDelete(true);
    try {
      if (activeTab === "Apps") {
        await AppAPI.remove(editingApp.id.toString());
        toast({
          title: "App Deleted",
          description: `${editingApp.name} has been deleted successfully.`,
        });
        getListData();
      } else if (activeTab === "Category") {
        await CategoryAPI.remove(editingCategory._id);
        toast({
          title: "Category Deleted",
          description: `${editingCategory.name} has been deleted successfully.`,
        });
        getListDataCategory();
      } else if (activeTab === "Subcategory") {
        await SubcategoryAPI.remove(editingSubcategory._id);
        toast({
          title: "Subcategory Deleted",
          description: `${editingSubcategory.name} has been deleted successfully.`,
        });
        getListDataSubcategory();
      }
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
  }, [editingApp, activeTab, editingCategory, editingSubcategory]);

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
    }
  };

  const getListDataCategory = async () => {
    try {
      setisLoadingGet(true);
      const dataRes = await CategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });

      setisLoadingGet(false);
    } finally {
      setisLoadingGet(false);
    }
  };
  const getListDataSubcategory = async () => {
    try {
      setisLoadingGet(true);
      const dataRes = await SubcategoryAPI.getAll();
      setSubcategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });

      setisLoadingGet(false);
    } finally {
      setisLoadingGet(false);
    }
  };

  const handleChangeTab = (tab: "Apps" | "Category" | "Subcategory") => {
    if (tab === "Apps") {
      getListData();
      getListDataCategory();
      getListDataSubcategory();
    } else if (tab === "Category") {
      getListDataCategory();
    } else if (tab === "Subcategory") {
      getListDataCategory();
      getListDataSubcategory();
    }
    setActiveTab(tab);
  };

  const handleEditCategory = (category: TCategoryRes) => {
    setModalFormType("category");
    setFormDataCategory({
      name: category.name,
    });
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleEditSubcategory = (subcategory: TSubcategoryRes) => {
    setModalFormType("subcategory");
    setFormDataSubcategory({
      name: subcategory.name,
      categoryId: subcategory.categoryId._id,
    });
    setEditingSubcategory(subcategory);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((d) => d._id.toString() === id);
    if (category) {
      setEditingCategory(category);
      setIsModalOpenDelete(true);
    }
  };

  const handleDeleteSubcategory = (id: string) => {
    const subcategory = subcategories.find((d) => d._id.toString() === id);
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setIsModalOpenDelete(true);
    }
  };

  const handleCloseModalForm = () => {
    setIsModalOpen(false);
    resetForm();
    resetFormCategory();
    resetFormSubcategory();
  };

  const getFilteredSubcategory = useMemo(() => {
    return subcategories.filter((d) => d.categoryId._id === formData.category);
  }, [formData.category, subcategories]);

  const disabledButtonForm = useMemo(() => {
    if (isLoadingPost) return true;

    if (modalFormType === "app") {
      const {
        name,
        category,
        subcategory,
        platform,
        image,
        description,
        downloads,
        rating,
        tags,
        color,
        company,
      } = formData;

      return !(
        name.trim() &&
        category.trim() &&
        subcategory.trim() &&
        platform.trim() &&
        image.trim() &&
        description.trim() &&
        downloads.trim() &&
        rating >= 0 &&
        tags.trim() &&
        color.trim() &&
        company.trim()
      );
    }

    if (modalFormType === "category") {
      return !formDataCategory.name.trim();
    }

    if (modalFormType === "subcategory") {
      return !(
        formDataSubcategory.name.trim() && formDataSubcategory.categoryId.trim()
      );
    }

    return true; // default fallback: disable
  }, [
    modalFormType,
    formData,
    formDataCategory,
    formDataSubcategory,
    isLoadingPost,
  ]);

  const onEditBannerImage = () => {
    setIcon({
      ...icon,
      isHaveChange: true,
    });
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically open the file dialog
      setTimeout(() => {
        if (!fileInputRef.current?.files?.length) {
          handleCancel(); // Handle file dialog cancel
        }
      }, 300); // Delay to allow file selection
    }
  };

  const handleCancel = () => {
    setIcon({
      ...icon,
      isHaveChange: false,
    });
  };

  const getIconPreview = useMemo(() => {
    if (icon.currentImage) {
      return URL.createObjectURL(icon.currentImage);
    }
    if (icon.isHaveChange === false && icon.oldImage) {
      return icon.oldImage;
    }
    return "";
  }, [icon]);

  const handleDropIcon = (image: File) => {
    setIcon({
      ...icon,
      currentImage: image,
    });
  };

  useEffect(() => {
    getListData();
    getListDataCategory();
    getListDataSubcategory();
  }, []);

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={handleChangeTab}
        defaultValue="screenshots"
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="Apps">Apps</TabsTrigger>
          <TabsTrigger value="Category">App Category</TabsTrigger>
          <TabsTrigger value="Subcategory">Subcategory</TabsTrigger>
        </TabsList>
        <TabsContent value="Apps">
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
                            <ImageWithFallback
                              src={
                                app?.image ??
                                "https://source.unsplash.com/400x300?game"
                              }
                              fallbackSrc="https://placehold.co/400"
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
                            <div className="font-medium">
                              {app.category?.name ?? "-"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.subcategory?.name ?? "-"}
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
                                handleViewComponent(app);
                              }}
                            >
                              <Component className="h-3 w-3" />
                            </Button>
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
        </TabsContent>
        <TabsContent value="Category">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>App Category Management</CardTitle>
                <Button onClick={handleCreateCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New App Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="mb-4">
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div> */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow
                        key={category._id}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <TableCell>
                          <div className="font-medium">{category.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCategory(category);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category._id);
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
        </TabsContent>
        <TabsContent value="Subcategory">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Subcategory Management</CardTitle>
                <Button onClick={handleCreateSubcategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Subcategory
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="mb-4">
                <Input
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div> */}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subcategories.map((subcategory) => (
                      <TableRow
                        key={subcategory._id}
                        className="cursor-pointer hover:bg-slate-50"
                      >
                        <TableCell>
                          <div className="font-medium">{subcategory.name}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {subcategory.categoryId.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSubcategory(subcategory);
                              }}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubcategory(subcategory._id);
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
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModalForm}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90%]">
          <DialogHeader>
            <DialogTitle>
              {modalFormType === "app"
                ? editingApp
                  ? "Edit App"
                  : "Create New App"
                : modalFormType === "category"
                ? editingCategory
                  ? "Edit App Category"
                  : "Create New App Category"
                : editingSubcategory
                ? "Edit Subcategory"
                : "Create New Subcategory"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4">
            {modalFormType === "app" ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      App Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
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
                    <Select
                      required
                      value={formData.category}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: value,
                          subcategory: "",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category, i) => (
                          <SelectItem key={i} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subcategory
                    </label>
                    <Select
                      required
                      value={formData.subcategory}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({ ...prev, subcategory: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getFilteredSubcategory.map((subcategory, i) => (
                          <SelectItem key={i} value={subcategory._id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Platform
                  </label>
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
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <CInputFileDragDrop
                    handleDrop={handleDropIcon}
                    labelForm="Icon"
                    labelBtn="Browse"
                    isRequired
                    acceptFile={FORMAT_INPUT_IMAGE_FILE}
                    inputRef={fileInputRef}
                  />
                  <CInputFilePreview
                    src={getIconPreview}
                    labelForm="Preview"
                    onEdit={onEditBannerImage}
                    onRemove={onRemoveIcon}
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
                    <label className="block text-sm font-medium mb-2">
                      Rating
                    </label>
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
                        setFormData((prev) => ({
                          ...prev,
                          color: e.target.value,
                        }))
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
                  <label className="block text-sm font-medium mb-2">
                    Countries
                  </label>
                  <CountryMultiSelect
                    value={formData.countries}
                    onChange={(countries) =>
                      setFormData((prev) => ({ ...prev, countries }))
                    }
                    placeholder="Select available countries..."
                  />
                </div>

                <div>
                  <CInputFileDragDrop
                    className="!p-4"
                    type="inForm"
                    handleDrop={handleDropImages}
                    labelForm="Thumbnail"
                    labelBtn="Browse"
                    label="Thumbnail"
                    isRequired
                    // inputRef={fileInputRefSlides}
                    maxFile={1}
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
              </>
            ) : modalFormType === "category" ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={formDataCategory.name}
                    onChange={(e) =>
                      setFormDataCategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={formDataSubcategory.name}
                    onChange={(e) =>
                      setFormDataSubcategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select
                    value={formDataSubcategory.categoryId}
                    onValueChange={(value: string) =>
                      setFormDataSubcategory((prev) => ({
                        ...prev,
                        categoryId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, i) => (
                        <SelectItem key={i} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModalForm}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={disabledButtonForm}>
                <Save className="h-4 w-4 mr-2" />
                {modalFormType === "app"
                  ? editingApp
                    ? "Update"
                    : "Create"
                  : modalFormType === "category"
                  ? editingCategory
                    ? "Update"
                    : "Create"
                  : editingSubcategory
                  ? "Update"
                  : "Create"}
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
        customerName={
          activeTab === "Apps"
            ? editingApp?.name ?? ""
            : activeTab === "Category"
            ? editingCategory?.name ?? ""
            : editingSubcategory?.name ?? ""
        }
      />
    </div>
  );
};
