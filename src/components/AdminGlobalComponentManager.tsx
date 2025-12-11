import CategoryGlobalComponentAPI from "@/api/admin/categoryGlobalComponent/api";
import {
  TCategoryGlobalComponentPost,
  TCategoryGlobalComponentRes,
} from "@/api/admin/categoryGlobalComponent/type";
import GlobalComponentAPI from "@/api/admin/globalComponent/api";
import {
  IScreenshot,
  TGlobalComponentRes,
} from "@/api/admin/globalComponent/type";
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
import { TabsContent } from "@radix-ui/react-tabs";
import { Edit3, ExternalLink, Eye, Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CInputFileDragDrop, { CInputFilePreview } from "./ui/CInputFileDragDrop";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export interface GlobalComponent {
  id: string;
  name: string;
  description: string;
  link: string;
  tags: string[];
  screenshots: IScreenshot[];
  category?: {
    _id: string;
    name: string;
  };
}

interface FormData {
  name: string;
  description: string;
  link: string;
  tags: string;
  category: string;
}

export const AdminGlobalComponentManager: React.FC = () => {
  const [globalComponents, setGlobalComponents] = useState<GlobalComponent[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] =
    useState<GlobalComponent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [screenshotImages, setScreenshotImages] = useState<UploadImageType[]>(
    []
  );
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    link: "",
    tags: "",
    category: "",
  });
  const [activeTab, setActiveTab] = useState<"components" | "category">(
    "components"
  );

  // Category states
  const [categories, setCategories] = useState<TCategoryGlobalComponentRes[]>(
    []
  );
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<TCategoryGlobalComponentRes | null>(null);
  const [searchTermCategory, setSearchTermCategory] = useState("");
  const [isLoadingPostCategory, setIsLoadingPostCategory] = useState(false);
  const [isLoadingGetCategory, setIsLoadingGetCategory] = useState(false);
  const [isModalOpenDeleteCategory, setIsModalOpenDeleteCategory] =
    useState(false);
  const [isLoadingDeleteCategory, setIsLoadingDeleteCategory] = useState(false);
  const [categoryFormData, setCategoryFormData] =
    useState<TCategoryGlobalComponentPost>({
      name: "",
    });

  const filteredComponents = useMemo(() => {
    return globalComponents.filter((component) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        component.name.toLowerCase().includes(searchLower) ||
        component.description.toLowerCase().includes(searchLower) ||
        component.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [globalComponents, searchTerm]);

  const getDataComponent = async () => {
    setIsLoadingGet(true);
    try {
      const res = await GlobalComponentAPI.getAll();
      const adaptedData: GlobalComponent[] = res.data.map(
        (item: TGlobalComponentRes) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          link: item.link,
          tags: item.tags,
          screenshots: item.screenshots,
          category: item.category
            ? {
                _id: item.category._id,
                name: item.category.name,
              }
            : undefined,
        })
      );
      console.log("adaptedData", adaptedData);
      setGlobalComponents(adaptedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch global components",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGet(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      link: "",
      tags: "",
      category: "",
    });
    setScreenshotImages([]);
    setEditingComponent(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (component: GlobalComponent) => {
    setEditingComponent(component);
    setFormData({
      name: component.name,
      description: component.description,
      link: component.link,
      tags: component.tags.join(", "),
      category: component?.category?._id,
    });

    const existingImages: UploadImageType[] = component.screenshots.map(
      (screenshot) => ({
        oldImage: screenshot.filePath,
        currentImage: undefined,
        isHaveChange: false,
      })
    );
    setScreenshotImages(existingImages);
    setIsModalOpen(true);
  };

  const handleDelete = (component: GlobalComponent) => {
    setEditingComponent(component);
    setIsModalOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (!editingComponent) return;

    setIsLoadingDelete(true);
    try {
      await GlobalComponentAPI.remove(editingComponent.id);
      toast({
        title: "Success",
        description: `${editingComponent.name} has been deleted successfully.`,
      });
      getDataComponent();
      setIsModalOpenDelete(false);
      setEditingComponent(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete component",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.link) {
      toast({
        title: "Validation Error",
        description: "Name, description, and link are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingPost(true);
    try {
      const tags = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const newScreenshots = screenshotImages
        .filter((img) => img.currentImage)
        .map((img) => img.currentImage as File);

      if (editingComponent) {
        const oldScreenshots = screenshotImages
          .filter((img) => !img.isHaveChange && img.oldImage)
          .map((img) => img.oldImage);

        const oldScreenshotsFix = editingComponent.screenshots.filter((s) =>
          oldScreenshots.includes(s.filePath)
        );

        await GlobalComponentAPI.update({
          globalComponentId: editingComponent.id,
          name: formData.name,
          description: formData.description,
          link: formData.link,
          tags,
          screenshots: newScreenshots,
          oldScreenshots: oldScreenshotsFix,
          category: formData.category,
        });

        toast({
          title: "Success",
          description: "Global component updated successfully",
        });
      } else {
        await GlobalComponentAPI.create({
          name: formData.name,
          description: formData.description,
          link: formData.link,
          tags,
          screenshots: newScreenshots,
          category: formData.category,
        });

        toast({
          title: "Success",
          description: "Global component created successfully",
        });
      }

      setIsModalOpen(false);
      resetForm();
      getDataComponent();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save component",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleViewDetail = (componentId: string) => {
    navigate(`/admin/global-component/${componentId}`);
  };

  // Category functions
  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const searchLower = searchTermCategory.toLowerCase();
      return category.name.toLowerCase().includes(searchLower);
    });
  }, [categories, searchTermCategory]);

  const getDataCategory = async () => {
    setIsLoadingGetCategory(true);
    try {
      const res = await CategoryGlobalComponentAPI.getAll();
      setCategories(res?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setIsLoadingGetCategory(false);
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: "",
    });
    setEditingCategory(null);
  };

  const handleAddCategory = () => {
    resetCategoryForm();
    setIsModalOpenCategory(true);
  };

  const handleEditCategory = (category: TCategoryGlobalComponentRes) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
    });
    setIsModalOpenCategory(true);
  };

  const handleDeleteCategory = (category: TCategoryGlobalComponentRes) => {
    setEditingCategory(category);
    setIsModalOpenDeleteCategory(true);
  };

  const confirmDeleteCategory = async () => {
    if (!editingCategory) return;

    setIsLoadingDeleteCategory(true);
    try {
      await CategoryGlobalComponentAPI.remove(editingCategory._id);
      toast({
        title: "Success",
        description: `${editingCategory.name} has been deleted successfully.`,
      });
      getDataCategory();
      setIsModalOpenDeleteCategory(false);
      setEditingCategory(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDeleteCategory(false);
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryFormData.name) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingPostCategory(true);
    try {
      if (editingCategory) {
        await CategoryGlobalComponentAPI.update({
          id: editingCategory._id,
          name: categoryFormData.name,
        });

        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await CategoryGlobalComponentAPI.create({
          name: categoryFormData.name,
        });

        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      setIsModalOpenCategory(false);
      resetCategoryForm();
      getDataCategory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPostCategory(false);
    }
  };

  const handleChangeTab = (tab: "components" | "category") => {
    setActiveTab(tab);
  };

  useEffect(() => {
    getDataComponent();
    getDataCategory();
  }, []);

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleChangeTab}
      defaultValue="components"
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value="components">Components</TabsTrigger>
        <TabsTrigger value="category">Category</TabsTrigger>
      </TabsList>
      <TabsContent value="components">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Global Component Management</CardTitle>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Screenshots</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingGet ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-64" />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-12" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredComponents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No global components found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComponents.map((component) => (
                      <TableRow key={component.id}>
                        <TableCell className="font-medium">
                          {component.name}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {component.description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {component.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {component.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{component.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{component.screenshots.length}</TableCell>
                        <TableCell>
                          {component.link && (
                            <a
                              href={component.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Link
                            </a>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetail(component.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(component)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(component)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingComponent
                    ? "Edit Global Component"
                    : "Add New Global Component"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter component name"
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
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter component description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c, i) => (
                        <SelectItem value={c._id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link</label>
                  <Input
                    type="url"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tags (separated by comma)
                  </label>
                  <Input
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="e.g., button, form, navigation"
                  />
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== "")
                        .map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  <CInputFileDragDrop
                    multiple
                    maxFile={10}
                    acceptFile={FORMAT_INPUT_IMAGE_FILE}
                    handleDrop={(files) => {
                      const newImages = files.map((file: File) => ({
                        oldImage: "",
                        currentImage: file,
                        isHaveChange: true,
                      }));
                      setScreenshotImages([...screenshotImages, ...newImages]);
                    }}
                    labelForm="Screenshots (Max 10 files)"
                    labelBtn="Browse"
                  />
                  {screenshotImages.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        {screenshotImages.length} screenshot(s) selected
                      </p>
                      <div className="grid grid-cols-3 max-h-[200px] overflow-y-auto overflow-x-hidden gap-4">
                        {screenshotImages.map((img, index) => {
                          const previewSrc = img.currentImage
                            ? URL.createObjectURL(img.currentImage)
                            : img.oldImage;
                          return (
                            <CInputFilePreview
                              key={index}
                              src={previewSrc}
                              labelForm=""
                              onRemove={() => {
                                setScreenshotImages(
                                  screenshotImages.filter((_, i) => i !== index)
                                );
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    disabled={isLoadingPost}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoadingPost}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoadingPost
                      ? "Saving..."
                      : editingComponent
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <ConfirmDeleteModal
            isOpen={isModalOpenDelete}
            onClose={() => {
              setIsModalOpenDelete(false);
              setEditingComponent(null);
            }}
            onConfirm={confirmDelete}
            customerName={editingComponent?.name}
            // title="Delete Global Component"
            // description={`Are you sure you want to delete "${editingComponent?.name}"? This action cannot be undone.`}
            isLoadingAction={isLoadingDelete}
          />
        </Card>
      </TabsContent>
      <TabsContent value="category">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Category Management</CardTitle>
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Search by name..."
                value={searchTermCategory}
                onChange={(e) => setSearchTermCategory(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingGetCategory ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell className="font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell>
                          {category.createdAt
                            ? new Date(category.createdAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {category.updatedAt
                            ? new Date(category.updatedAt).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <Dialog
            open={isModalOpenCategory}
            onOpenChange={setIsModalOpenCategory}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category Name
                  </label>
                  <Input
                    value={categoryFormData.name}
                    onChange={(e) =>
                      setCategoryFormData({
                        ...categoryFormData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpenCategory(false);
                      resetCategoryForm();
                    }}
                    disabled={isLoadingPostCategory}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoadingPostCategory}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoadingPostCategory
                      ? "Saving..."
                      : editingCategory
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <ConfirmDeleteModal
            isOpen={isModalOpenDeleteCategory}
            onClose={() => {
              setIsModalOpenDeleteCategory(false);
              setEditingCategory(null);
            }}
            onConfirm={confirmDeleteCategory}
            customerName={editingCategory?.name}
            isLoadingAction={isLoadingDeleteCategory}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
};
