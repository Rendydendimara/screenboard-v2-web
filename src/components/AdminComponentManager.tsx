import ComponentAPI from "@/api/admin/component/api";
import { TComponentRes } from "@/api/admin/component/type";
import AppAPI from "@/api/admin/app/api";
import { TAppRes } from "@/api/admin/app/type";
import ScreenCategoryAPI from "@/api/admin/screenCategory/api";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
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
import { TSelect, UploadImageType } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CInputFileDragDrop, { CInputFilePreview } from "./ui/CInputFileDragDrop";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import ImageWithFallback from "./ui/ImageWithFallback";
import { getImageUrl } from "@/utils";

export interface Component {
  id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  notes: string;
  appId: {
    _id: string;
    name: string;
  };
  screens: string[];
}

interface AdminComponentManagerProps {
  appId?: string;
}

export const AdminComponentManager: React.FC<AdminComponentManagerProps> = ({
  appId,
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [listApp, setListApp] = useState<TSelect[]>([]);
  const [screenImages, setScreenImages] = useState<UploadImageType[]>([]);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingGet, setIsLoadingGet] = useState(false);
  const [editingComponent, setEditingComponent] = useState<Component | null>(
    null
  );
  const [categories, setCategories] = useState<TScreenCategoryRes[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    notes: "",
    appId: appId || "",
  });
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedComponentScreens, setSelectedComponentScreens] = useState<
    string[]
  >([]);

  // Filter components by appId if provided
  const displayedComponents = appId
    ? components.filter((component) => String(component.appId?._id) === appId)
    : components;

  const filteredComponents = useMemo(() => {
    return displayedComponents.filter((component) => {
      const matchesSearch =
        component?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component?.category?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        component?.notes?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [displayedComponents, searchTerm]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      notes: "",
      appId: appId || "",
    });
    setScreenImages([]);
    setEditingComponent(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (component: Component) => {
    setFormData({
      name: component.name,
      category: component.category?._id ?? "",
      notes: component.notes,
      appId: String(component.appId?._id ?? appId ?? ""),
    });

    let tempImages: UploadImageType[] = [];
    component.screens.forEach((img) => {
      tempImages.push({
        currentImage: undefined,
        isHaveChange: false,
        oldImage: img,
      });
    });
    setScreenImages(tempImages);

    setEditingComponent(component);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      if (editingComponent) {
        // Update
        let oldScreens: string[] = [];
        let newScreens: File[] = [];
        screenImages.forEach((file) => {
          if (!file.isHaveChange && file.oldImage && !file.currentImage) {
            oldScreens.push(file.oldImage);
          } else if (file.currentImage) {
            newScreens.push(file.currentImage);
          }
        });

        await ComponentAPI.update({
          name: formData.name,
          category: formData.category,
          notes: formData.notes,
          appId: formData.appId,
          screens: newScreens,
          oldScreens: oldScreens,
          componentId: editingComponent.id,
        });

        toast({
          title: "Component Updated",
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // Create
        let newScreens: File[] = [];
        screenImages.forEach((file) => {
          if (file.currentImage) {
            newScreens.push(file.currentImage);
          }
        });

        await ComponentAPI.create({
          name: formData.name,
          category: formData.category,
          notes: formData.notes,
          appId: formData.appId,
          screens: newScreens,
        });

        toast({
          title: "Component Created",
          description: `${formData.name} has been created successfully.`,
        });
      }
      getListData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleDelete = (component: Component) => {
    setEditingComponent(component);
    setIsModalOpenDelete(true);
  };

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingComponent(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!editingComponent) return;

    setIsLoadingDelete(true);
    try {
      await ComponentAPI.remove(editingComponent.id);
      toast({
        title: "Component Deleted",
        description: `${editingComponent.name} has been deleted successfully.`,
      });

      getListData();
      handleCloseModalDelete();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }, [editingComponent]);

  const getListData = async () => {
    setIsLoadingGet(true);
    try {
      const params = appId ? { app: appId } : undefined;
      const res = await ComponentAPI.getAll(params);
      const data: TComponentRes[] = res.data;

      const mappedData: Component[] = data.map((item) => ({
        id: item._id,
        name: item.name,
        category:
          typeof item.category === "string"
            ? { _id: item.category, name: "" }
            : item.category,
        notes: item.notes,
        appId:
          typeof item.appId === "string"
            ? { _id: item.appId, name: "" }
            : item.appId,
        screens: item.screens,
      }));

      setComponents(mappedData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error?.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingGet(false);
    }
  };

  const getDataOptions = async () => {
    try {
      const res = await Promise.all([AppAPI.getAll()]);
      const dataApp: TAppRes[] = res[0]?.data ?? [];
      const tempApp: TSelect[] = dataApp.map((d) => {
        return {
          label: d.name,
          value: d._id,
        };
      });
      setListApp(tempApp);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const getListDataCategory = async () => {
    try {
      const dataRes = await ScreenCategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error?.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const handleDropScreenImages = useCallback((imageFiles: File[]) => {
    const newImages: UploadImageType[] = imageFiles.map((file) => ({
      currentImage: file,
      isHaveChange: false,
      oldImage: "",
    }));

    setScreenImages((prev) => [...prev, ...newImages]);
  }, []);

  const getImagesPreview = (index: number) => {
    const imageFile = screenImages[index];
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

  const onRemoveScreenImage = (index: number) => {
    setScreenImages([
      ...screenImages.slice(0, index),
      ...screenImages.slice(index + 1, screenImages.length),
    ]);
  };

  const handleCloseModalForm = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const disabledButtonForm = useMemo(() => {
    if (isLoadingPost) return true;

    const { name, category, notes, appId: appIdForm } = formData;

    return !(
      name.trim() &&
      category.trim() &&
      notes.trim() &&
      appIdForm.trim() &&
      screenImages.length > 0
    );
  }, [formData, isLoadingPost, screenImages]);

  const handleImageClick = useCallback((screens: string[], index: number) => {
    setSelectedComponentScreens(screens);
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  }, []);

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      const newIndex =
        prev > 0 ? prev - 1 : selectedComponentScreens.length - 1;
      console.log("Prev clicked, new index:", newIndex);
      return newIndex;
    });
  }, [selectedComponentScreens.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((prev) => {
      const newIndex =
        prev < selectedComponentScreens.length - 1 ? prev + 1 : 0;
      console.log("Next clicked, new index:", newIndex);
      return newIndex;
    });
  }, [selectedComponentScreens.length]);

  const handleCloseImageModal = useCallback(() => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(0);
    setSelectedComponentScreens([]);
  }, []);

  useEffect(() => {
    getListData();
    getDataOptions();
    getListDataCategory();
  }, []);

  // Keyboard navigation for image modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isImageModalOpen) return;

      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "Escape") {
        handleCloseImageModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isImageModalOpen,
    handlePrevImage,
    handleNextImage,
    handleCloseImageModal,
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Component Management</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search components..."
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
                  <TableHead>Notes</TableHead>
                  <TableHead>Category</TableHead>
                  {!appId && <TableHead>App</TableHead>}
                  <TableHead>Screens</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingGet ? (
                  <TableRow>
                    <TableCell
                      colSpan={appId ? 5 : 6}
                      className="text-center py-8"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredComponents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={appId ? 5 : 6}
                      className="text-center py-8"
                    >
                      No components found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComponents.map((component) => (
                    <TableRow
                      key={component.id}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <TableCell>
                        <div className="font-medium">{component.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {component.notes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {component.category?.name ?? "-"}
                        </div>
                      </TableCell>
                      {!appId && (
                        <TableCell>
                          <div className="text-sm">
                            {component.appId?.name ?? "-"}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {component.screens.slice(0, 3).map((screen, idx) => (
                            <ImageWithFallback
                              key={idx}
                              src={getImageUrl(screen)}
                              fallbackSrc="https://placehold.co/100"
                              alt={`Screen ${idx + 1}`}
                              className="w-10 h-10 rounded object-cover hover:opacity-80 transition-opacity"
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   handleImageClick(component.screens, idx);
                              // }}
                            />
                          ))}
                          {component.screens.length > 3 && (
                            <div
                              className="text-xs text-gray-500  hover:text-gray-700"
                              // onClick={(e) => {
                              //   e.stopPropagation();
                              //   handleImageClick(component.screens, 3);
                              // }}
                            >
                              +{component.screens.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(component);
                            }}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(component);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
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
      </Card>

      {/* Component Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModalForm}>
        <DialogContent className="overflow-y-auto max-h-[90%] max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingComponent ? "Edit Component" : "Add New Component"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!appId && (
              <div>
                <label className="block text-sm font-medium mb-2">App</label>
                <Select
                  value={formData.appId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, appId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select app" />
                  </SelectTrigger>
                  <SelectContent>
                    {listApp.map((app) => (
                      <SelectItem key={app.value} value={app.value.toString()}>
                        {app.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Component Name
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
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea
                rows={4}
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add notes about this component..."
              />
            </div>

            <div>
              <CInputFileDragDrop
                className="!p-4"
                type="inForm"
                handleDrop={handleDropScreenImages}
                labelForm="Screens"
                labelBtn="Browse"
                label="Upload Screens (Multiple)"
                isRequired
                multiple
                maxFile={20}
                acceptFile={FORMAT_INPUT_IMAGE_FILE}
              />
              <div className="flex w-full items-center gap-1 mt-2 overflow-x-scroll max-w-[622px]">
                {screenImages.map(
                  (_, i) =>
                    getImagesPreview(i) && (
                      <CInputFilePreview
                        key={i}
                        src={getImagesPreview(i)}
                        labelForm="Preview"
                        className="w-[200px] min-w-[200px]"
                        onRemove={() => onRemoveScreenImage(i)}
                      />
                    )
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModalForm}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={disabledButtonForm}>
                {editingComponent ? "Update" : "Create"}
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
        customerName={editingComponent?.name ?? ""}
      />

      {/* Image Preview Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={handleCloseImageModal}>
        <DialogContent className="max-w-4xl" key={selectedImageIndex}>
          <DialogHeader>
            <DialogTitle>
              Screen Preview ({selectedImageIndex + 1} /{" "}
              {selectedComponentScreens.length})
            </DialogTitle>
          </DialogHeader>

          <div className="relative">
            {/* Main Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-[500px]">
              {selectedComponentScreens[selectedImageIndex] && (
                <ImageWithFallback
                  key={selectedImageIndex}
                  src={getImageUrl(
                    selectedComponentScreens[selectedImageIndex]
                  )}
                  fallbackSrc="https://placehold.co/800"
                  alt={`Screen ${selectedImageIndex + 1}`}
                  className="max-h-[500px] max-w-full object-contain rounded"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            {selectedComponentScreens.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {selectedComponentScreens.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-2">
              {selectedComponentScreens.map((screen, idx) => (
                <div
                  key={idx}
                  className={`relative flex-shrink-0 cursor-pointer rounded border-2 transition-all ${
                    idx === selectedImageIndex
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  <ImageWithFallback
                    src={getImageUrl(screen)}
                    fallbackSrc="https://placehold.co/100"
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                  {idx === selectedImageIndex && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded"></div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={handleCloseImageModal}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
