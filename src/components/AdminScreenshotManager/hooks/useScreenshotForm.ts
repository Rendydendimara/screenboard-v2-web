import { useState, useCallback, useRef } from "react";
import ScreenAPI from "@/api/admin/screen/api";
import { UploadImageType } from "@/types";
import { FormData, EditFormData, BulkFileItem, Screenshot } from "../types";
import { MAX_FILE_BULK_UPLOAD } from "@/constant/app";

export const useScreenshotForm = (
  appId: string | undefined,
  toast: any,
  onDataChange: () => void
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingScreenshot, setViewingScreenshot] = useState<Screenshot | null>(
    null
  );
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [editingScreen, setEditingScreen] = useState<Screenshot | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    image: "",
    description: "",
    appId: appId ?? "",
    module: "",
  });

  const [editFormData, setEditFormData] = useState<EditFormData>({
    id: "",
    name: "",
    category: "",
    appId: "",
    module: "",
  });

  const [image, setImage] = useState<UploadImageType>({
    oldImage: "",
    currentImage: undefined,
    isHaveChange: false,
  });

  const [selectedApp, setSelectedApp] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedModul, setSelectedModul] = useState<string>("");
  const [bulkFiles, setBulkFiles] = useState<BulkFileItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = useCallback(
    (imageFiles: any) => {
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
        name: file.name.replace(/\.[^/.]+$/, ""),
      }));
      setBulkFiles((prev) => [...prev, ...newBulkFiles]);
    },
    [bulkFiles.length, toast]
  );

  const handleBulkUpload = useCallback(async () => {
    try {
      setIsLoadingPost(true);
      if (!selectedApp && !appId) {
        toast({
          title: "Missing Information",
          description: "Please select an app for bulk upload.",
          variant: "destructive",
        });
        return;
      }
      if (!selectedCategory || !selectedModul) {
        toast({
          title: "Missing Information",
          description: "Please select modul and category for bulk upload.",
          variant: "destructive",
        });
        return;
      }

      const files = bulkFiles.map((item) => item.file);
      const filesName = bulkFiles.map((item) => item.name);

      await ScreenAPI.bulkUpload({
        app: appId ?? selectedApp,
        category: selectedCategory,
        modul: selectedModul,
        screens: files,
        filesName,
      });

      onDataChange();
      handleCloseBulkUpload();
      toast({
        title: "Bulk Upload Complete",
        description: `Screenshots uploaded successfully.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  }, [
    selectedApp,
    selectedCategory,
    selectedModul,
    bulkFiles,
    appId,
    toast,
    onDataChange,
  ]);

  const handleSingleAdd = useCallback(
    async (e: React.FormEvent) => {
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
        onDataChange();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.response?.data?.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingPost(false);
      }
    },
    [formData, image, appId, toast, onDataChange]
  );

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
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
        onDataChange();
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
    },
    [editFormData, toast, onDataChange]
  );

  const handleDelete = useCallback(
    (id: string, name: string, screenshots: Screenshot[]) => {
      const screen = screenshots.find((d) => d.id === id);
      if (screen) {
        setEditingScreen(screen);
        setIsModalOpenDelete(true);
      }
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!editingScreen) return;

    setIsLoadingDelete(true);
    try {
      await ScreenAPI.remove(editingScreen.id);
      toast({
        title: "Screenshot Deleted",
        description: `${editingScreen.name} has been deleted successfully.`,
      });

      onDataChange();
      handleCloseModalDelete();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingDelete(false);
    }
  }, [editingScreen, toast, onDataChange]);

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
    document.body.style.overflow = "hidden";
  }, []);

  const handleCloseView = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingScreenshot(null);
    document.body.style.overflow = "unset";
  }, []);

  const handleDropImage = useCallback((imageFile: File) => {
    setImage((prev) => ({
      ...prev,
      currentImage: imageFile,
    }));
    setFormData((prev) => ({
      ...prev,
      name: imageFile.name.replace(/\.[^/.]+$/, ""),
    }));
  }, []);

  const onEditImage = useCallback(() => {
    setImage((prev) => ({
      ...prev,
      isHaveChange: true,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.click();
      setTimeout(() => {
        if (!fileInputRef.current?.files?.length) {
          handleCancel();
        }
      }, 300);
    }
  }, []);

  const handleCancel = useCallback(() => {
    setImage((prev) => ({
      ...prev,
      isHaveChange: false,
    }));
  }, []);

  const onRemoveImage = useCallback(() => {
    setImage((prev) => ({
      ...prev,
      isHaveChange: true,
      currentImage: undefined,
    }));
    setFormData((prev) => ({
      ...prev,
      name: "",
    }));
  }, []);

  const handleCloseBulkUpload = useCallback(() => {
    setBulkFiles([]);
    setIsBulkUploadOpen(false);
    setSelectedApp(appId ?? "");
    setSelectedCategory("");
    setSelectedModul("");
  }, [appId]);

  const handleOpenBulkUpload = useCallback(() => {
    setSelectedApp(appId ?? "");
    setIsBulkUploadOpen(true);
  }, [appId]);

  const handleCloseModalDelete = useCallback(() => {
    setIsModalOpenDelete(false);
    setEditingScreen(null);
  }, []);

  const handleEditFormChange = useCallback(
    (field: keyof EditFormData, value: string) => {
      setEditFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFormChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return {
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isBulkUploadOpen,
    setIsBulkUploadOpen,
    isViewModalOpen,
    viewingScreenshot,
    isModalOpenDelete,
    isLoadingDelete,
    isLoadingPost,
    editingScreen,
    formData,
    editFormData,
    image,
    selectedApp,
    setSelectedApp,
    selectedCategory,
    setSelectedCategory,
    selectedModul,
    setSelectedModul,
    bulkFiles,
    setBulkFiles,
    fileInputRef,
    handleFileSelect,
    handleBulkUpload,
    handleSingleAdd,
    handleUpdate,
    handleDelete,
    handleConfirmDelete,
    handleEdit,
    handleView,
    handleCloseView,
    handleDropImage,
    onEditImage,
    onRemoveImage,
    handleCloseBulkUpload,
    handleOpenBulkUpload,
    handleCloseModalDelete,
    handleEditFormChange,
    handleFormChange,
  };
};
