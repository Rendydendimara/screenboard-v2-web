import AppAPI from "@/api/admin/app/api";
import { TAppRes } from "@/api/admin/app/type";
import ModulAPI from "@/api/admin/modul/api";
import { TModulRes } from "@/api/admin/modul/type";
import ScreenAPI from "@/api/admin/screen/api";
import { TScreenRes } from "@/api/admin/screen/type";
import { ColorAnalysis } from "@/components/ColorAnalysis";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FORMAT_INPUT_IMAGE_FILE, MAX_FILE_BULK_UPLOAD } from "@/constant/app";
import { useToast } from "@/hooks/use-toast";
import { TSelect, UploadImageType } from "@/types";
import { formatFileSize, getImageUrlFromFile } from "@/utils";
import { adapterListScreenBEToFE } from "@/utils/adapterBEToFE";
import { processMultipleImages } from "@/utils/colorExtraction";
import { FolderOpen, Palette, Plus, Trash2, Upload } from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AdminPanelWrapperInputImage from "./ui/AdminPanelWrapperInputImage";
import CInputFileDragDrop, { CInputFilePreview } from "./ui/CInputFileDragDrop";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";

export interface Screenshot {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  appId?: string;
  colors?: Array<{
    hex: string;
    rgb: { r: number; g: number; b: number };
    percentage: number;
  }>;
  dominantColor?: string;
}

interface AdminScreenshotManagerProps {
  appId?: string;
}

export const AdminScreenshotManager: React.FC<AdminScreenshotManagerProps> = ({
  appId,
}) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedModul, setSelectedModul] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [isProcessingColors, setIsProcessingColors] = useState(false);
  const [colorProcessingProgress, setColorProcessingProgress] = useState({
    current: 0,
    total: 0,
  });
  const [imageColors, setImageColors] = useState<any[]>([]);
  const { toast } = useToast();
  const [listModule, setListModule] = useState<TSelect[]>([]);
  const [listApp, setListApp] = useState<TSelect[]>([]);
  const [image, setImage] = useState<UploadImageType>({
    oldImage: "",
    currentImage: undefined,
    isHaveChange: false,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screenshot | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
    description: "",
    appId: "",
    module: "",
  });

  const categories = [
    "Discovery",
    "Playback",
    "Library",
    "Settings",
    "Profile",
    "Search",
  ];

  // Filter screenshots by appId if provided
  const displayedScreenshots = appId
    ? screenshots.filter((screenshot) => String(screenshot.appId) === appId)
    : screenshots;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + bulkFiles.length > MAX_FILE_BULK_UPLOAD) {
      toast({
        title: "Max image limit",
        description: "Max image is 20",
        variant: "destructive",
      });

      return;
    }
    setBulkFiles((prev) => [...prev, ...files]);
  };

  const processColorsForScreenshots = async (screenshotList: Screenshot[]) => {
    if (screenshotList.length === 0) return;

    setIsProcessingColors(true);
    setColorProcessingProgress({ current: 0, total: screenshotList.length });

    try {
      const imagesToProcess = screenshotList.map((screenshot) => ({
        id: screenshot.id,
        name: screenshot?.name ?? "",
        url: screenshot.image,
      }));
      const results = await processMultipleImages(
        imagesToProcess,
        (processed, total) => {
          setColorProcessingProgress({ current: processed, total });
        }
      );

      // Update screenshots with color data
      const updatedScreenshots = screenshotList.map((screenshot) => {
        const colorData = results.find((r) => r.imageId === screenshot.id);
        if (colorData) {
          return {
            ...screenshot,
            colors: colorData.colors,
            dominantColor: colorData.dominantColor,
          };
        }
        return screenshot;
      });

      // setScreenshots((prev) =>
      //   prev.map(
      //     (screenshot) =>
      //       updatedScreenshots.find(
      //         (updated) => updated.id === screenshot.id
      //       ) || screenshot
      //   )
      // );

      setScreenshots(updatedScreenshots);
      setImageColors(results);

      toast({
        title: "Color Analysis Complete",
        description: `Processed ${results.length} images and extracted color palettes.`,
      });
    } catch (error) {
      console.error("Color processing failed:", error);
      toast({
        title: "Color Processing Failed",
        description: "Some images could not be processed for color analysis.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingColors(false);
    }
  };

  const handleBulkUpload = async () => {
    try {
      setIsLoadingPost(true);
      if (!selectedApp || !selectedCategory || !selectedModul) {
        toast({
          title: "Missing Information",
          description:
            "Please select an app, modul, and category for bulk upload.",
          variant: "destructive",
        });
        return;
      }
      await ScreenAPI.bulkUpload({
        app: selectedApp,
        category: selectedCategory,
        modul: selectedModul,
        screens: bulkFiles,
      });
      getListData();
      handleCloseBulkUpload();
      toast({
        title: "Bulk Upload Complete",
        description: `Screenshots uploaded successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleSingleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      await ScreenAPI.create({
        app: formData.appId,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        modul: formData.module,
        image: image.currentImage,
      });
      setFormData({
        name: "",
        category: "",
        image: "",
        description: "",
        appId: appId ?? "",
        module: "",
      });
      setImage({
        oldImage: "",
        currentImage: undefined,
        isHaveChange: false,
      });
      setIsModalOpen(false);
      toast({
        title: "Screenshot Added",
        description: "Screenshot has been added successfully.",
      });
      getListData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleProcessAllColors = async () => {
    const screenshotsToProcess = displayedScreenshots.filter((s) => !s.colors);
    if (screenshotsToProcess.length === 0) {
      toast({
        title: "No Images to Process",
        description: "All visible screenshots already have color data.",
      });
      return;
    }

    await processColorsForScreenshots(screenshotsToProcess);
  };

  const handleDelete = (id: string, name: string) => {
    const screen = screenshots.find((d) => d.id === id);
    if (screen) {
      setEditingScreen(screen);
      setIsModalOpenDelete(true);
    }
  };

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingScreen(undefined);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setIsLoadingDelete(true);
    try {
      await ScreenAPI.remove(editingScreen.id);
      toast({
        title: "Screenshot Deleted",
        description: `${editingScreen.name} has been deleted successfully.`,
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
  }, [editingScreen]);

  const filteredScreenshots = displayedScreenshots.filter(
    (screenshot) =>
      screenshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screenshot.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getListData = async () => {
    try {
      let res;
      if (appId) {
        res = await ScreenAPI.getAll({ app: appId });
        setFormData({
          ...formData,
          appId: appId,
        });
      } else {
        res = await ScreenAPI.getAll();
      }
      const data: TScreenRes[] = res.data;
      const newScreenshots: Screenshot[] = adapterListScreenBEToFE(data);
      // Automatically process colors for new screenshots
      await processColorsForScreenshots(newScreenshots);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      // setisLoadingGet(false);
      // finally
    }
  };

  const getDataOptions = async () => {
    try {
      const res = await Promise.all([ModulAPI.getAll(), AppAPI.getAll()]);
      const dataModul: TModulRes[] = res[0]?.data ?? [];
      const tempModule: TSelect[] = dataModul.map((d) => {
        return {
          label: d.name,
          value: d._id,
        };
      });
      setListModule(tempModule);
      const dataApp: TAppRes[] = res[1]?.data ?? [];
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
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    } finally {
      // setisLoadingGet(false);
      // finally
    }
  };

  const handleDropImage = (imageFile: File) => {
    setImage({
      ...image,
      currentImage: imageFile,
    });
  };

  const getImagePreview = useMemo(() => {
    if (image.currentImage) {
      return URL.createObjectURL(image.currentImage);
    }
    if (image.isHaveChange === false && image.oldImage) {
      return image.oldImage;
    }
    return "";
  }, [image]);

  const onEditImage = () => {
    setImage({
      ...image,
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
    setImage({
      ...image,
      isHaveChange: false,
    });
  };

  const onRemoveImage = useCallback(() => {
    setImage({
      ...image,
      isHaveChange: true,
      currentImage: undefined,
    });
  }, []);

  const handleCloseBulkUpload = useCallback(() => {
    setBulkFiles([]);
    setIsBulkUploadOpen(false);
    setSelectedApp(appId ?? "");
    setSelectedCategory("");
    setSelectedModul("");
  }, []);

  const handleOpenBulkUpload = useCallback(() => {
    setSelectedApp(appId ?? "");
    setIsBulkUploadOpen(true);
  }, [appId]);

  useEffect(() => {
    getListData();
    getDataOptions();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Screenshot Management</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleProcessAllColors}
                disabled={isProcessingColors}
              >
                <Palette className="h-4 w-4 mr-2" />
                Process Colors
              </Button>
              <Button variant="outline" onClick={handleOpenBulkUpload}>
                <Upload className="h-4 w-4 mr-2" />
                Bulk Upload
              </Button>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Screenshot
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="screenshots" className="space-y-4">
            <TabsList>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              <TabsTrigger value="colors">Color Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="screenshots">
              <div className="mb-4">
                <Input
                  placeholder="Search screenshots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                <div className="flex w-max space-x-4 p-4">
                  {filteredScreenshots.map((screenshot) => (
                    <div
                      key={screenshot.id}
                      className="shrink-0 relative group cursor-pointer"
                    >
                      <div className="w-40 h-72 rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
                        <img
                          src={screenshot.image}
                          alt={screenshot?.name ?? ""}
                          className="w-full h-full object-cover"
                        />
                        {screenshot.dominantColor && (
                          <div
                            className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{
                              backgroundColor: screenshot.dominantColor,
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                screenshot.id,
                                screenshot?.name ?? ""
                              )
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs">
                        <div className="font-medium truncate">
                          {screenshot?.name ?? ""}
                        </div>
                        {screenshot.colors && (
                          <div className="flex space-x-1 mt-1">
                            {screenshot.colors
                              .slice(0, 3)
                              .map((color, index) => (
                                <div
                                  key={index}
                                  className="w-3 h-3 rounded-full border border-white"
                                  style={{ backgroundColor: color.hex }}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="colors">
              <ColorAnalysis
                imageColors={imageColors}
                isProcessing={isProcessingColors}
                processingProgress={colorProcessingProgress}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Single Screenshot Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90%] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Screenshot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSingleAdd} className="space-y-4">
            <AdminPanelWrapperInputImage>
              <CInputFileDragDrop
                isRequired
                handleDrop={handleDropImage}
                labelForm="Screenshots"
                labelBtn="Browse"
                acceptFile={FORMAT_INPUT_IMAGE_FILE}
                inputRef={fileInputRef}
              />
              <CInputFilePreview
                src={getImagePreview}
                labelForm="Preview"
                onEdit={onEditImage}
                onRemove={onRemoveImage}
              />
            </AdminPanelWrapperInputImage>
            <div>
              <label className="block text-sm font-medium mb-2">
                Screenshot Name
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
              <label className="block text-sm font-medium mb-2">Modul</label>
              <Select
                value={formData.module}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, module: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select modul" />
                </SelectTrigger>
                <SelectContent>
                  {listModule.map((modul) => (
                    <SelectItem key={modul.value} value={modul.value}>
                      {modul.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Screenshot</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90%]">
          <DialogHeader>
            <DialogTitle>Bulk Upload Screenshots</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {!appId && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select App
                  </label>
                  <Select value={selectedApp} onValueChange={setSelectedApp}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose app" />
                    </SelectTrigger>
                    <SelectContent>
                      {listApp.map((app) => (
                        <SelectItem
                          key={app.value}
                          value={app.value.toString()}
                        >
                          {app.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Modul
                </label>
                <Select value={selectedModul} onValueChange={setSelectedModul}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose modul" />
                  </SelectTrigger>
                  <SelectContent>
                    {listModule.map((modul) => (
                      <SelectItem key={modul.value} value={modul.value}>
                        {modul.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Images
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  Click to select images or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, WebP
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {bulkFiles.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">
                  Selected Files ({bulkFiles.length})
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {bulkFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          alt={file.name}
                          src={getImageUrlFromFile(file)}
                          className="h-8 w-8 object-cover object-center"
                        />
                        <span className="text-sm">
                          {file.name} ({formatFileSize(file.size)})
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setBulkFiles((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseBulkUpload}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBulkUpload}
                disabled={
                  isLoadingPost ||
                  bulkFiles.length === 0 ||
                  (!appId && !selectedApp) ||
                  !selectedCategory ||
                  !selectedModul
                }
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload {bulkFiles.length} Screenshots
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteModal
        isOpen={isModalOpenDelete}
        onClose={handleCloseModalDelete}
        onConfirm={handleConfirmDelete}
        isLoadingAction={isLoadingDelete}
        customerName={editingScreen?.name ?? ""}
      />
    </div>
  );
};
