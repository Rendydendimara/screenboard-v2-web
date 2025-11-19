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
import {
  ArrowDownUp,
  Eye,
  FolderOpen,
  GripVertical,
  Palette,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminPanelWrapperInputImage from "./ui/AdminPanelWrapperInputImage";
import CInputFileDragDrop, { CInputFilePreview } from "./ui/CInputFileDragDrop";
import ConfirmDeleteModal from "./ui/confirm-delete-modal";
import { Textarea } from "./ui/textarea";
import Dropzone from "react-dropzone";
import { AdminCategoryScreenshotManager } from "./AdminCategoryScreenshotManager";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import ScreenCategoryAPI from "@/api/admin/screenCategory/api";

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
  modul: string;
  dominantColor?: string;
  order?: number;
}

export interface BulkFileItem {
  file: File;
  name: string;
}

interface AdminScreenshotManagerProps {
  appId?: string;
  isHideCategory?: boolean;
  filterOnlyShowIfHasModul?: boolean;
}

// Sortable Item Components for Drag & Drop

// Sortable Module Item
const SortableModuleItem: React.FC<{
  modul: TModulRes;
  onClick: () => void;
}> = ({ modul, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: modul._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 1,
  };

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to parent
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? "scale-105 opacity-90" : "scale-100 opacity-100"
      } transition-all duration-200`}
    >
      <div
        className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 shadow-xl"
            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="font-medium">{modul.name}</div>
          </div>
          <div
            className={`cursor-grab active:cursor-grabbing p-2 rounded hover:bg-gray-100 ${
              isDragging ? "bg-blue-500 text-white" : ""
            }`}
            onClick={handleDragHandleClick}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sortable Category Item
const SortableCategoryItem: React.FC<{
  category: TScreenCategoryRes;
  onClick: () => void;
}> = ({ category, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category._id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 1,
  };

  const handleDragHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling to parent
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${
        isDragging ? "scale-105 opacity-90" : "scale-100 opacity-100"
      } transition-all duration-200`}
    >
      <div
        className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all ${
          isDragging
            ? "border-blue-500 shadow-xl"
            : "border-gray-200 hover:border-blue-300 hover:shadow-md"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="font-medium">{category.name}</div>
          </div>
          <div
            className={`cursor-grab active:cursor-grabbing p-2 rounded hover:bg-gray-100 ${
              isDragging ? "bg-blue-500 text-white" : ""
            }`}
            onClick={handleDragHandleClick}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sortable Screenshot Item
const SortableScreenshotItem: React.FC<{
  screenshot: Screenshot;
  onEdit: (screenshot: Screenshot) => void;
  onDelete: (id: string, name: string) => void;
}> = ({ screenshot, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screenshot.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`shrink-0 w-full relative group cursor-move ${
        isDragging ? "scale-105 opacity-90" : "scale-100 opacity-100"
      } transition-all duration-200`}
    >
      <div
        className={`w-full h-72 rounded-lg overflow-hidden bg-gray-100 transition-all duration-200 ${
          isDragging
            ? "shadow-2xl ring-2 ring-blue-400 ring-opacity-50"
            : "shadow-md hover:shadow-lg"
        }`}
      >
        <div
          className={`absolute top-2 left-2 z-10 bg-white rounded-full p-1.5 shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
            isDragging ? "bg-blue-500 text-white scale-110" : "hover:bg-gray-50"
          }`}
          {...attributes}
          {...listeners}
        >
          <GripVertical
            className={`h-4 w-4 ${isDragging ? "text-white" : "text-gray-600"}`}
          />
        </div>
        <img
          src={screenshot.image}
          alt={screenshot?.name ?? ""}
          className="w-full h-full object-cover pointer-events-none select-none"
        />
        {screenshot.dominantColor && (
          <div
            className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{
              backgroundColor: screenshot.dominantColor,
            }}
          />
        )}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none" />
        )}
      </div>
      <div className="mt-2 text-xs">
        <div className="font-medium truncate">{screenshot?.name ?? ""}</div>
        {screenshot.colors && (
          <div className="flex space-x-1 mt-1">
            {screenshot.colors.slice(0, 3).map((color, index) => (
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
  );
};

export const AdminScreenshotManager: React.FC<AdminScreenshotManagerProps> = ({
  appId,
  isHideCategory = false,
  filterOnlyShowIfHasModul = false,
}) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<Screenshot | null>(
    null
  );
  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedModul, setSelectedModul] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [bulkFiles, setBulkFiles] = useState<BulkFileItem[]>([]);
  const [isProcessingColors, setIsProcessingColors] = useState(false);
  const [colorProcessingProgress, setColorProcessingProgress] = useState({
    current: 0,
    total: 0,
  });
  const [imageColors, setImageColors] = useState<any[]>([]);
  const { toast } = useToast();
  const [listModule, setListModule] = useState<TSelect[]>([]);
  const [listApp, setListApp] = useState<TSelect[]>([]);
  const [rawModules, setRawModules] = useState<TModulRes[]>([]);
  const [rawApps, setRawApps] = useState<TAppRes[]>([]);
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
  const [selectedModuleFilter, setSelectedModulFilter] =
    useState<TSelect | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<TSelect | null>(null);
  const [categories, setCategories] = useState<TScreenCategoryRes[]>([]);
  const [activeTab, setActiveTab] = useState<"category" | "screenshots">(
    "screenshots"
  );
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderFilterApp, setReorderFilterApp] = useState<string>("");
  const [reorderFilterModule, setReorderFilterModule] = useState<string>("all");
  const [reorderFilterCategory, setReorderFilterCategory] =
    useState<string>("all");
  const [reorderedScreenshots, setReorderedScreenshots] = useState<
    Screenshot[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Hierarchical navigation state
  type ReorderLevel = "app" | "module" | "category" | "screenshot";
  const [reorderLevel, setReorderLevel] = useState<ReorderLevel>("app");
  const [selectedReorderApp, setSelectedReorderApp] = useState<TAppRes | null>(
    null
  );
  const [selectedReorderModule, setSelectedReorderModule] =
    useState<TModulRes | null>(null);
  const [selectedReorderCategory, setSelectedReorderCategory] =
    useState<TScreenCategoryRes | null>(null);

  // Ordered lists for each level
  const [orderedModules, setOrderedModules] = useState<TModulRes[]>([]);
  const [orderedCategories, setOrderedCategories] = useState<
    TScreenCategoryRes[]
  >([]);
  const [orderedScreenshots, setOrderedScreenshots] = useState<Screenshot[]>(
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: "",
    description: "",
    appId: "",
    module: "",
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    category: "",
    appId: "",
    module: "",
  });

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter screenshots by appId if provided
  const displayedScreenshots = appId
    ? screenshots.filter((screenshot) => String(screenshot.appId) === appId)
    : screenshots;

  const handleFileSelect = (imageFiles: any) => {
    const files: File[] = Array.from(imageFiles || []);
    if (files.length + bulkFiles.length > MAX_FILE_BULK_UPLOAD) {
      toast({
        title: "Max image limit",
        description: "Max image is 20",
        variant: "destructive",
      });

      return;
    }
    const newBulkFiles: BulkFileItem[] = files.map((file) => ({
      file,
      name: "", // file.name.replace(/\.[^/.]+$/, "") // Remove file extension
    }));
    setBulkFiles((prev) => [...prev, ...newBulkFiles]);
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

      // toast({
      //   title: "Color Analysis Complete",
      //   description: `Processed ${results.length} images and extracted color palettes.`,
      // });
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
      // Extract files from bulkFiles array
      const files = bulkFiles.map((item) => item.file);
      const filesName = bulkFiles.map((item) => item.name);
      // console.log({
      //   app: selectedApp,
      //   category: selectedCategory,
      //   modul: selectedModul,
      //   screens: bulkFiles,
      // });
      await ScreenAPI.bulkUpload({
        app: selectedApp,
        category: selectedCategory,
        modul: selectedModul,
        screens: files,
        filesName,
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

  const handleEdit = useCallback((screenshot: Screenshot) => {
    setEditFormData({
      id: screenshot.id,
      name: screenshot.name || "",
      category: screenshot.category || "",
      appId: screenshot.appId || "",
      module: screenshot.modul || "",
    });
    setIsEditModalOpen(true);
  }, []);

  const handleView = useCallback((screenshot: Screenshot) => {
    setViewingScreenshot(screenshot);
    setIsViewModalOpen(true);
    // Disable body scroll
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseView = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingScreenshot(null);
    // Re-enable body scroll
    document.body.style.overflow = 'unset';
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingPost(true);
    try {
      await ScreenAPI.update({
        screenId: editFormData.id,
        name: editFormData.name,
        category: editFormData.category,
        app: editFormData.appId,
        modul: editFormData.module,
        description: "",
        image: undefined,
      });

      toast({
        title: "Screenshot Updated",
        description: "Screenshot has been updated successfully.",
      });
      setIsEditModalOpen(false);
      getListData();
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to update screenshot",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleEditFormChange = useCallback((field: string, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleEnterReorderMode = useCallback(() => {
    setIsReorderMode(true);
    setReorderLevel("app");
    setSelectedReorderApp(null);
    setSelectedReorderModule(null);
    setSelectedReorderCategory(null);
    setOrderedModules([]);
    setOrderedCategories([]);
    setOrderedScreenshots([]);
  }, []);

  const handleExitReorderMode = useCallback(() => {
    setIsReorderMode(false);
    setReorderLevel("app");
    setSelectedReorderApp(null);
    setSelectedReorderModule(null);
    setSelectedReorderCategory(null);
    setOrderedModules([]);
    setOrderedCategories([]);
    setOrderedScreenshots([]);
    setActiveId(null);
  }, []);

  // Navigation handlers
  const handleSelectApp = useCallback(
    async (app: TAppRes) => {
      setSelectedReorderApp(app);
      setReorderLevel("module");

      // Filter modules that have screenshots for this app
      const modulesWithScreenshots = rawModules.filter((modul) => {
        return screenshots.some(
          (screenshot) =>
            String(screenshot.appId) === app._id &&
            screenshot.modul === modul._id
        );
      });

      const sorted = [...modulesWithScreenshots].sort((a, b) => {
        // Sort by order field if exists, otherwise by name
        const orderA = (a as any).order || 0;
        const orderB = (b as any).order || 0;
        if (orderA === orderB) {
          return a.name.localeCompare(b.name);
        }
        return orderA - orderB;
      });
      setOrderedModules(sorted);
    },
    [rawModules, screenshots]
  );

  const handleSelectModule = useCallback(
    (modul: TModulRes) => {
      setSelectedReorderModule(modul);
      setReorderLevel("category");

      // Filter categories that have screenshots for this module and app
      const categoriesWithScreenshots = categories.filter((category) => {
        return screenshots.some(
          (screenshot) =>
            String(screenshot.appId) === selectedReorderApp?._id &&
            screenshot.modul === modul._id &&
            screenshot.category === category._id
        );
      });

      const sorted = [...categoriesWithScreenshots].sort((a, b) => {
        // Assuming categories have an order field
        return 0; // Placeholder
      });
      setOrderedCategories(sorted);
    },
    [categories, screenshots, selectedReorderApp]
  );

  const handleSelectCategory = useCallback(
    (category: TScreenCategoryRes) => {
      setSelectedReorderCategory(category);
      setReorderLevel("screenshot");

      // Load screenshots for this category and sort by order
      const filtered = screenshots.filter(
        (s) =>
          s.category === category._id &&
          s.modul === selectedReorderModule?._id &&
          String(s.appId) === selectedReorderApp?._id
      );
      const sorted = [...filtered].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      // console.log("sorted", sorted);
      setOrderedScreenshots(sorted);
    },
    [screenshots, selectedReorderApp, selectedReorderModule]
  );

  const handleBackNavigation = useCallback(() => {
    if (reorderLevel === "screenshot") {
      setReorderLevel("category");
      setSelectedReorderCategory(null);
      setOrderedScreenshots([]);
    } else if (reorderLevel === "category") {
      setReorderLevel("module");
      setSelectedReorderModule(null);
      setOrderedCategories([]);
    } else if (reorderLevel === "module") {
      setReorderLevel("app");
      setSelectedReorderApp(null);
      setOrderedModules([]);
    }
  }, [reorderLevel]);

  const handleApplyReorderFilters = useCallback(() => {
    // Validate that App is selected
    if (!reorderFilterApp) {
      toast({
        title: "App Required",
        description: "Please select an App first. Order is managed per App.",
        variant: "destructive",
      });
      return;
    }

    // Filter screenshots based on selected filters
    const filtered = screenshots.filter((screenshot) => {
      const matchesApp = String(screenshot.appId) === reorderFilterApp;
      const matchesModule =
        reorderFilterModule === "all" ||
        screenshot.modul === reorderFilterModule;
      const matchesCategory =
        reorderFilterCategory === "all" ||
        screenshot.category === reorderFilterCategory;
      return matchesApp && matchesModule && matchesCategory;
    });

    // Sort by order field (per app)
    const sorted = [...filtered].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    setReorderedScreenshots(sorted);

    if (sorted.length === 0) {
      toast({
        title: "No Screenshots Found",
        description: "No screenshots match the selected filters.",
        variant: "destructive",
      });
    }
  }, [
    screenshots,
    reorderFilterApp,
    reorderFilterModule,
    reorderFilterCategory,
    toast,
  ]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        if (reorderLevel === "module") {
          setOrderedModules((items) => {
            const oldIndex = items.findIndex((item) => item._id === active.id);
            const newIndex = items.findIndex((item) => item._id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        } else if (reorderLevel === "category") {
          setOrderedCategories((items) => {
            const oldIndex = items.findIndex((item) => item._id === active.id);
            const newIndex = items.findIndex((item) => item._id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        } else if (reorderLevel === "screenshot") {
          setOrderedScreenshots((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }

      setActiveId(null);
    },
    [reorderLevel]
  );

  // Save order handlers - placeholder for API integration
  const handleSaveModuleOrder = useCallback(() => {
    // console.log("Save Module Order:", {
    //   appId: selectedReorderApp?._id,
    //   modules: orderedModules.map((m, index) => ({
    //     id: m._id,
    //     order: index + 1,
    //   })),
    // });

    toast({
      title: "Module Order Ready",
      description:
        "Module order data is ready. Please implement API integration.",
    });
  }, [selectedReorderApp, orderedModules, toast]);

  const handleSaveCategoryOrder = useCallback(() => {
    // console.log("Save Category Order:", {
    //   appId: selectedReorderApp?._id,
    //   moduleId: selectedReorderModule?._id,
    //   categories: orderedCategories.map((c, index) => ({
    //     id: c._id,
    //     order: index + 1,
    //   })),
    // });

    toast({
      title: "Category Order Ready",
      description:
        "Category order data is ready. Please implement API integration.",
    });
  }, [selectedReorderApp, selectedReorderModule, orderedCategories, toast]);

  const handleSaveScreenshotOrder = useCallback(async () => {
    try {
      setIsLoadingPost(true);
      // if (!reorderFilterApp) {
      //   toast({
      //     title: "Error",
      //     description: "App ID is required to save order.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // Update order field for each screenshot
      const updatedOrder = orderedScreenshots.map((screenshot, index) => ({
        id: screenshot.id,
        order: index + 1,
      }));

      // Call API to update order with appId
      await ScreenAPI.updateOrder({
        // appId: reorderFilterApp,
        screens: updatedOrder,
      });

      toast({
        title: "Order Updated",
        description: `Screenshot order for ${
          listApp.find((a) => a.value === reorderFilterApp)?.label
        } has been saved successfully.`,
      });

      // Update local state
      setScreenshots((prev) =>
        prev.map((screenshot) => {
          const updated = updatedOrder.find((u) => u.id === screenshot.id);
          return updated ? { ...screenshot, order: updated.order } : screenshot;
        })
      );

      handleExitReorderMode();
      getListData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save order",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
    // console.log("Save Screenshot Order:", {
    //   appId: selectedReorderApp?._id,
    //   moduleId: selectedReorderModule?._id,
    //   categoryId: selectedReorderCategory?._id,
    //   screenshots: orderedScreenshots.map((s, index) => ({
    //     id: s.id,
    //     order: index + 1,
    //   })),
    // });

    // toast({
    //   title: "Screenshot Order Ready",
    //   description:
    //     "Screenshot order data is ready. Please implement API integration.",
    // });
  }, [
    selectedReorderApp,
    selectedReorderModule,
    selectedReorderCategory,
    orderedScreenshots,
    toast,
  ]);

  const handleSaveOrder = async () => {
    setIsLoadingPost(true);
    try {
      if (!reorderFilterApp) {
        toast({
          title: "Error",
          description: "App ID is required to save order.",
          variant: "destructive",
        });
        return;
      }

      // Update order field for each screenshot
      const updatedOrder = reorderedScreenshots.map((screenshot, index) => ({
        id: screenshot.id,
        order: index + 1,
      }));

      // Call API to update order with appId
      await ScreenAPI.updateOrder({
        // appId: reorderFilterApp,
        screens: updatedOrder,
      });

      toast({
        title: "Order Updated",
        description: `Screenshot order for ${
          listApp.find((a) => a.value === reorderFilterApp)?.label
        } has been saved successfully.`,
      });

      // Update local state
      setScreenshots((prev) =>
        prev.map((screenshot) => {
          const updated = updatedOrder.find((u) => u.id === screenshot.id);
          return updated ? { ...screenshot, order: updated.order } : screenshot;
        })
      );

      handleExitReorderMode();
      getListData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save order",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
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

  const filteredScreenshots = useMemo(() => {
    // console.log("displayedScreenshots", displayedScreenshots);
    return displayedScreenshots.filter((screenshot) => {
      const matchesSearch =
        screenshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screenshot.modul.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesModuleFilter =
        !selectedModuleFilter ||
        screenshot.modul === selectedModuleFilter.value;

      const matchesCategoryFilter =
        !selectedCategoryFilter ||
        screenshot.category === selectedCategoryFilter.value;

      return matchesSearch && matchesModuleFilter && matchesCategoryFilter;
    });
  }, [
    displayedScreenshots,
    selectedModuleFilter,
    searchTerm,
    selectedCategoryFilter,
  ]);

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
      // console.log("data", data);
      const newScreenshots: Screenshot[] = adapterListScreenBEToFE(data);
      // Automatically process colors for new screenshots
      // console.log("newScreenshots", newScreenshots);
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
      setRawModules(dataModul); // Store raw module data

      const dataApp: TAppRes[] = res[1]?.data ?? [];
      const tempApp: TSelect[] = dataApp.map((d) => {
        return {
          label: d.name,
          value: d._id,
        };
      });
      setListApp(tempApp);
      setRawApps(dataApp); // Store raw app data
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

  const handleChangeModul = useCallback(
    (id: string) => {
      const temp = listModule.find((d) => d.value === id);
      setSelectedModulFilter(temp);
    },
    [listModule]
  );

  const handleChangeCategory = useCallback(
    (id: string) => {
      const temp = categories.find((d) => d._id === id);
      if (temp) {
        setSelectedCategoryFilter({
          label: temp.name,
          value: temp._id,
        });
      } else {
        setSelectedCategoryFilter(null);
      }
    },
    [categories]
  );

  const getCategoryOptions = useMemo(() => {
    return categories.map((c) => {
      return {
        label: c.name,
        value: c._id,
      };
    });
  }, [categories]);

  const getListDataCategory = async () => {
    try {
      const dataRes = await ScreenCategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response.data.message,
        variant: "destructive",
      });
    }
  };

  const handleChangeTab = (tab: "category" | "screenshots") => {
    if (tab === "screenshots") {
      getListData();
      getListDataCategory();
    }
    setActiveTab(tab);
  };

  const getModuleOptions = useMemo(() => {
    if (filterOnlyShowIfHasModul) {
      const usedModuleValues = new Set(
        displayedScreenshots.map((s) => s.modul)
      );

      const filteredModule = listModule.filter((m) =>
        usedModuleValues.has(m.value)
      );
      return filteredModule;
    }
    return listModule;
  }, [displayedScreenshots, filterOnlyShowIfHasModul, listModule]);

  useEffect(() => {
    getListData();
    getDataOptions();
    getListDataCategory();
  }, []);

  // Cleanup: Re-enable scroll when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Screenshot Management</CardTitle>
            <div className="flex space-x-2">
              {/* <Button
                variant="outline"
                onClick={handleProcessAllColors}
                disabled={isProcessingColors}
              >
                <Palette className="h-4 w-4 mr-2" />
                Process Colors
              </Button> */}
              {!isReorderMode && (
                <>
                  <Button variant="outline" onClick={handleOpenBulkUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                  <Button variant="outline" onClick={handleEnterReorderMode}>
                    <ArrowDownUp className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Screenshot
                  </Button>
                </>
              )}
              {isReorderMode && (
                <Button variant="outline" onClick={handleExitReorderMode}>
                  <X className="h-4 w-4 mr-2" />
                  Exit Reorder Mode
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="screenshots"
            className="space-y-4"
            value={activeTab}
            onValueChange={handleChangeTab}
          >
            <TabsList>
              <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
              {!isHideCategory && (
                <TabsTrigger value="category">Screenshot Category</TabsTrigger>
              )}
              {/* <TabsTrigger value="colors">Color Analysis</TabsTrigger> */}
            </TabsList>
            <TabsContent value="screenshots">
              {isReorderMode ? (
                // Hierarchical Reorder Mode UI
                <div className="space-y-4">
                  {/* Breadcrumb Navigation */}
                  {reorderLevel !== "app" && (
                    <div className="flex items-center gap-2 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackNavigation}
                      >
                        <ArrowDownUp className="h-4 w-4 mr-2 rotate-90" />
                        Back
                      </Button>
                      <div className="flex items-center gap-2 text-gray-600">
                        {selectedReorderApp && (
                          <>
                            <span className="font-medium">
                              {selectedReorderApp.name}
                            </span>
                            <span>/</span>
                          </>
                        )}
                        {selectedReorderModule && reorderLevel !== "module" && (
                          <>
                            <span className="font-medium">
                              {selectedReorderModule.name}
                            </span>
                            <span>/</span>
                          </>
                        )}
                        {selectedReorderCategory &&
                          reorderLevel === "screenshot" && (
                            <span className="font-medium">
                              {selectedReorderCategory.name}
                            </span>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Level: App Selection */}
                  {reorderLevel === "app" && (
                    <div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-blue-900 mb-2">
                          Select App to Reorder
                        </h3>
                        <p className="text-sm text-blue-700">
                          Choose an app to manage the order of its modules,
                          categories, and screenshots.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {listApp.map((app) => {
                          // Find full app data
                          const appData = {
                            _id: app.value,
                            name: app.label,
                          } as TAppRes;
                          return (
                            <Card
                              key={app.value}
                              className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-400"
                              onClick={() => handleSelectApp(appData)}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-lg">
                                    {app.label}
                                  </h4>
                                  <ArrowDownUp className="h-5 w-5 text-gray-400" />
                                </div>
                                <p className="text-sm text-gray-500">
                                  Click to manage order
                                </p>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Level: Module List */}
                  {reorderLevel === "module" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Modules in {selectedReorderApp?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Drag to reorder, click to view categories
                          </p>
                        </div>
                        <Button
                          onClick={handleSaveModuleOrder}
                          disabled={orderedModules.length === 0}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Module Order
                        </Button>
                      </div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          disabled
                          items={orderedModules.map((m) => m._id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="space-y-3">
                            {orderedModules.map((modul) => (
                              <SortableModuleItem
                                key={modul._id}
                                modul={modul}
                                onClick={() => handleSelectModule(modul)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}

                  {/* Level: Category List */}
                  {reorderLevel === "category" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Categories in {selectedReorderModule?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Drag to reorder, click to view screenshots
                          </p>
                        </div>
                        <Button
                          onClick={handleSaveCategoryOrder}
                          disabled={orderedCategories.length === 0}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Category Order
                        </Button>
                      </div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          disabled
                          items={orderedCategories.map((c) => c._id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="space-y-3">
                            {orderedCategories.map((category) => (
                              <SortableCategoryItem
                                key={category._id}
                                category={category}
                                onClick={() => handleSelectCategory(category)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}

                  {/* Level: Screenshot List */}
                  {reorderLevel === "screenshot" && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            Screenshots in {selectedReorderCategory?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Drag to reorder screenshots
                          </p>
                        </div>
                        <Button
                          onClick={handleSaveScreenshotOrder}
                          disabled={orderedScreenshots.length === 0}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Screenshot Order
                        </Button>
                      </div>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={orderedScreenshots.map((s) => s.id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {orderedScreenshots.map((screenshot) => (
                              <SortableScreenshotItem
                                key={screenshot.id}
                                screenshot={screenshot}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                              />
                            ))}
                          </div>
                        </SortableContext>
                        <DragOverlay
                          dropAnimation={{
                            duration: 200,
                            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                          }}
                        >
                          {activeId && reorderLevel === "screenshot" ? (
                            <div className="w-64 cursor-grabbing">
                              <div className="w-full h-72 rounded-lg overflow-hidden bg-gray-100 ring-4 ring-blue-500 shadow-2xl transform rotate-3">
                                <div className="absolute top-2 left-2 z-10 bg-blue-500 rounded-full p-1.5 shadow-lg scale-110">
                                  <GripVertical className="h-4 w-4 text-white" />
                                </div>
                                <img
                                  src={
                                    orderedScreenshots.find(
                                      (s) => s.id === activeId
                                    )?.image
                                  }
                                  alt={
                                    orderedScreenshots.find(
                                      (s) => s.id === activeId
                                    )?.name ?? ""
                                  }
                                  className="w-full h-full object-cover pointer-events-none select-none"
                                />
                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20" />
                              </div>
                            </div>
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    </div>
                  )}
                </div>
              ) : (
                // Normal View Mode
                <>
                  <div className="mb-4 flex gap-2 items-start justify-start">
                    {/* Filters and View Controls */}
                    {/* <div className="flex flex-col sm:flex-row gap-4 lg:gap-6"> */}
                    {/* Module Filter */}
                    <div className="flex-1 sm:flex-none sm:min-w-[200px]">
                      <Select
                        value={selectedModuleFilter?.value}
                        onValueChange={handleChangeModul}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Modul" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value={null}>All</SelectItem>
                          {getModuleOptions.map((modul, i) => (
                            <SelectItem key={i} value={modul.value}>
                              {modul.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Category Filter */}
                    <div className="flex-1 sm:flex-none sm:min-w-[200px]">
                      <Select
                        value={selectedCategoryFilter?.value}
                        onValueChange={handleChangeCategory}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value={null}>All</SelectItem>
                          {getCategoryOptions.map((modul, i) => (
                            <SelectItem key={i} value={modul.value}>
                              {modul.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* </div> */}

                    <Input
                      placeholder="Search screenshots..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-md"
                    />
                  </div>

                  {/* <ScrollArea className="w-full whitespace-nowrap rounded-md border"> */}
                  {/* <div className="flex w-max space-x-4 p-4"> */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredScreenshots.map((screenshot) => (
                      <div
                        key={screenshot.id}
                        className="shrink-0 w-full relative group cursor-pointer"
                      >
                        <div className="w-full h-72 rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-shadow">
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
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleView(screenshot)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(screenshot)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
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
                  {/* <ScrollBar orientation="horizontal" />
                  </ScrollArea> */}
                </>
              )}
            </TabsContent>
            <TabsContent value="category">
              <AdminCategoryScreenshotManager />
            </TabsContent>
            {/* <TabsContent value="colors">
              <ColorAnalysis
                imageColors={imageColors}
                isProcessing={isProcessingColors}
                processingProgress={colorProcessingProgress}
              />
            </TabsContent> */}
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
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                rows={6}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
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

      {/* Edit Screenshot Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="overflow-y-auto max-h-[90%] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Screenshot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            {!appId && (
              <div>
                <label className="block text-sm font-medium mb-2">App</label>
                <Select
                  value={editFormData.appId}
                  onValueChange={(value) =>
                    handleEditFormChange("appId", value)
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
              <label className="block text-sm font-medium mb-2">Modul</label>
              <Select
                value={editFormData.module}
                onValueChange={(value) => handleEditFormChange("module", value)}
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
                value={editFormData.category}
                onValueChange={(value) =>
                  handleEditFormChange("category", value)
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
                Screenshot Name
              </label>
              <Input
                value={editFormData.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoadingPost}>
                {isLoadingPost ? "Updating..." : "Update Screenshot"}
              </Button>
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
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400">
                <Dropzone
                  multiple
                  onDrop={handleFileSelect}
                  accept={FORMAT_INPUT_IMAGE_FILE}
                  maxFiles={20}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div className="w-full" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        Click to select images or drop images
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports JPG, PNG, WebP
                      </p>{" "}
                    </div>
                  )}
                </Dropzone>
              </div>
            </div>

            {bulkFiles.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">
                  Selected Files ({bulkFiles.length})
                </h4>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {bulkFiles.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-3 bg-gray-50 rounded"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <img
                            alt={item.file.name}
                            src={getImageUrlFromFile(item.file)}
                            className="h-10 w-10 object-cover object-center rounded"
                          />
                          <div className="flex-1">
                            <div className="text-xs text-gray-500">
                              {item.file.name} ({formatFileSize(item.file.size)}
                              )
                            </div>
                          </div>
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
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700">
                          Screenshot Name
                        </label>
                        <Input
                          value={item.name}
                          onChange={(e) => {
                            const newBulkFiles = [...bulkFiles];
                            newBulkFiles[index] = {
                              ...newBulkFiles[index],
                              name: e.target.value,
                            };
                            setBulkFiles(newBulkFiles);
                          }}
                          placeholder={
                            "Enter screenshot name (default name: " +
                            item.file.name +
                            "-{{module}}-{{category}}"
                          }
                          className="text-sm"
                        />
                      </div>
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

      {/* View Screenshot Modal */}
      {isViewModalOpen && viewingScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm !m-0"
          onClick={handleCloseView}
        >
          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={viewingScreenshot.image}
              alt={viewingScreenshot.name ?? ""}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 bg-black/30"
              onClick={handleCloseView}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
