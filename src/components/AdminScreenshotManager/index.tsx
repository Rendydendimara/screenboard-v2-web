import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Plus, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TSelect } from "@/types";
import { AdminCategoryScreenshotManager } from "@/components/AdminCategoryScreenshotManager";
import ConfirmDeleteModal from "@/components/ui/confirm-delete-modal";
import { AdminScreenshotManagerProps } from "./types";
import { useScreenshotData } from "./hooks/useScreenshotData";
import { useScreenshotForm } from "./hooks/useScreenshotForm";
import { useReorderMode } from "./hooks/useReorderMode";
import { AddScreenshotModal } from "./AddScreenshotModal";
import { EditScreenshotModal } from "./EditScreenshotModal";
import { BulkUploadModal } from "./BulkUploadModal";
import { ViewScreenshotModal } from "./ViewScreenshotModal";
import { NormalView } from "./NormalView";
import { ReorderModeView } from "./ReorderModeView";
import Spinner from "../spinner";

export const AdminScreenshotManager: React.FC<AdminScreenshotManagerProps> = ({
  appId,
  isHideCategory = false,
  filterOnlyShowIfHasModul = false,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"category" | "screenshots">(
    "screenshots"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModuleFilter, setSelectedModulFilter] =
    useState<TSelect | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<TSelect | null>(null);

  // Data hook
  const {
    screenshots,
    setScreenshots,
    listModule,
    listApp,
    rawModules,
    rawApps,
    categories,
    isProcessingColors,
    colorProcessingProgress,
    getListData,
    getDataOptions,
    getListDataCategory,
  } = useScreenshotData(appId, toast);

  // Form hook
  const {
    isModalOpen,
    setIsModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isBulkUploadOpen,
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
  } = useScreenshotForm(appId, toast, () => {
    getListData();
    getListDataCategory();
  });

  // Reorder mode hook
  const {
    isReorderMode,
    reorderLevel,
    selectedReorderApp,
    selectedReorderModule,
    selectedReorderCategory,
    orderedModules,
    orderedCategories,
    orderedScreenshots,
    activeId,
    handleEnterReorderMode,
    handleExitReorderMode,
    handleSelectApp,
    handleSelectModule,
    handleSelectCategory,
    handleBackNavigation,
    handleDragStart,
    handleDragEnd,
    handleSaveModuleOrder,
    handleSaveCategoryOrder,
    handleSaveScreenshotOrder,
  } = useReorderMode(
    appId,
    rawApps,
    rawModules,
    screenshots,
    categories,
    setScreenshots,
    toast
  );

  // Filter screenshots by appId if provided
  const displayedScreenshots = appId
    ? screenshots.filter((screenshot) => String(screenshot.appId) === appId)
    : screenshots;

  const filteredScreenshots = useMemo(() => {
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

  const handleChangeModul = (id: string) => {
    const temp = listModule.find((d) => d.value === id);
    setSelectedModulFilter(temp ?? null);
  };

  const handleChangeCategory = (id: string) => {
    const temp = categories.find((d) => d._id === id);
    if (temp) {
      setSelectedCategoryFilter({
        label: temp.name,
        value: temp._id,
      });
    } else {
      setSelectedCategoryFilter(null);
    }
  };

  const getCategoryOptions = useMemo(() => {
    return categories.map((c) => ({
      label: c.name,
      value: c._id,
    }));
  }, [categories]);

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

  const handleChangeTab = (tab: "category" | "screenshots") => {
    if (tab === "screenshots") {
      getListData();
      getListDataCategory();
    }
    setActiveTab(tab);
  };

  useEffect(() => {
    getListData();
    getDataOptions();
    getListDataCategory();
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Screenshot Management</CardTitle>
            <div className="flex space-x-2">
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
            </TabsList>
            <TabsContent value="screenshots">
              {isProcessingColors ? (
                <Spinner />
              ) : isReorderMode ? (
                <ReorderModeView
                  reorderLevel={reorderLevel}
                  selectedReorderApp={selectedReorderApp}
                  selectedReorderModule={selectedReorderModule}
                  selectedReorderCategory={selectedReorderCategory}
                  listApp={listApp}
                  orderedModules={orderedModules}
                  orderedCategories={orderedCategories}
                  orderedScreenshots={orderedScreenshots}
                  activeId={activeId}
                  onBackNavigation={handleBackNavigation}
                  onSelectApp={handleSelectApp}
                  onSelectModule={handleSelectModule}
                  onSelectCategory={handleSelectCategory}
                  onSaveModuleOrder={handleSaveModuleOrder}
                  onSaveCategoryOrder={handleSaveCategoryOrder}
                  onSaveScreenshotOrder={handleSaveScreenshotOrder}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onEdit={handleEdit}
                  onDelete={(id, name) => handleDelete(id, name, screenshots)}
                />
              ) : (
                <NormalView
                  screenshots={filteredScreenshots}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedModuleFilter={selectedModuleFilter}
                  onModuleFilterChange={handleChangeModul}
                  selectedCategoryFilter={selectedCategoryFilter}
                  onCategoryFilterChange={handleChangeCategory}
                  moduleOptions={getModuleOptions}
                  categoryOptions={getCategoryOptions}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={(id, name) => handleDelete(id, name, screenshots)}
                />
              )}
            </TabsContent>
            <TabsContent value="category">
              <AdminCategoryScreenshotManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddScreenshotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSingleAdd}
        formData={formData}
        onFormChange={handleFormChange}
        image={image}
        onDropImage={handleDropImage}
        onEditImage={onEditImage}
        onRemoveImage={onRemoveImage}
        listApp={listApp}
        listModule={listModule}
        categories={categories}
        appId={appId}
      />

      <EditScreenshotModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdate}
        formData={editFormData}
        onFormChange={handleEditFormChange}
        listApp={listApp}
        listModule={listModule}
        categories={categories}
        appId={appId}
        isLoading={isLoadingPost}
      />

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={handleCloseBulkUpload}
        onSubmit={handleBulkUpload}
        bulkFiles={bulkFiles}
        onFilesChange={setBulkFiles}
        selectedApp={selectedApp}
        onAppChange={setSelectedApp}
        selectedModul={selectedModul}
        onModulChange={setSelectedModul}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        listApp={listApp}
        listModule={listModule}
        categories={categories}
        appId={appId}
        isLoading={isLoadingPost}
        onFileSelect={handleFileSelect}
      />

      <ViewScreenshotModal
        isOpen={isViewModalOpen}
        screenshot={viewingScreenshot}
        onClose={handleCloseView}
      />

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

// Re-export types for backward compatibility
export type {
  Screenshot,
  BulkFileItem,
  AdminScreenshotManagerProps,
} from "./types";
