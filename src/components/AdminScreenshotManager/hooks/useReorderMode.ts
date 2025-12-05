import { useState, useCallback, startTransition } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TAppRes } from "@/api/admin/app/type";
import { TModulRes } from "@/api/admin/modul/type";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import ScreenAPI from "@/api/admin/screen/api";
import { ReorderLevel, Screenshot } from "../types";

export const useReorderMode = (
  appId: string | undefined,
  rawApps: TAppRes[],
  rawModules: TModulRes[],
  screenshots: Screenshot[],
  categories: TScreenCategoryRes[],
  setScreenshots: (screenshots: Screenshot[]) => void,
  toast: any
) => {
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderLevel, setReorderLevel] = useState<ReorderLevel>("app");
  const [selectedReorderApp, setSelectedReorderApp] = useState<TAppRes | null>(
    null
  );
  const [selectedReorderModule, setSelectedReorderModule] =
    useState<TModulRes | null>(null);
  const [selectedReorderCategory, setSelectedReorderCategory] =
    useState<TScreenCategoryRes | null>(null);
  const [orderedModules, setOrderedModules] = useState<TModulRes[]>([]);
  const [orderedCategories, setOrderedCategories] = useState<
    TScreenCategoryRes[]
  >([]);
  const [orderedScreenshots, setOrderedScreenshots] = useState<Screenshot[]>(
    []
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const handleEnterReorderMode = useCallback(() => {
    setIsReorderMode(true);

    if (appId) {
      const currentApp = rawApps.find((app) => app._id === appId);
      if (currentApp) {
        setSelectedReorderApp(currentApp);
        setReorderLevel("module");

        const modulesWithScreenshots = rawModules.filter((modul) => {
          return screenshots.some(
            (screenshot) =>
              String(screenshot.appId) === appId &&
              screenshot.modul === modul._id
          );
        });

        const sorted = [...modulesWithScreenshots].sort((a, b) => {
          const orderA = (a as any).order || 0;
          const orderB = (b as any).order || 0;
          if (orderA === orderB) {
            return a.name.localeCompare(b.name);
          }
          return orderA - orderB;
        });
        setOrderedModules(sorted);
      } else {
        setReorderLevel("app");
        setSelectedReorderApp(null);
      }
    } else {
      setReorderLevel("app");
      setSelectedReorderApp(null);
    }

    setSelectedReorderModule(null);
    setSelectedReorderCategory(null);
    setOrderedCategories([]);
    setOrderedScreenshots([]);
  }, [appId, rawApps, rawModules, screenshots]);

  const handleExitReorderMode = useCallback(() => {
    startTransition(() => {
      setIsReorderMode(false);
      setReorderLevel("app");
      setSelectedReorderApp(null);
      setSelectedReorderModule(null);
      setSelectedReorderCategory(null);
      setOrderedModules([]);
      setOrderedCategories([]);
      setOrderedScreenshots([]);
      setActiveId(null);
    });
  }, []);

  const handleSelectApp = useCallback(
    async (app: TAppRes) => {
      setSelectedReorderApp(app);
      setReorderLevel("module");

      const modulesWithScreenshots = rawModules.filter((modul) => {
        return screenshots.some(
          (screenshot) =>
            String(screenshot.appId) === app._id &&
            screenshot.modul === modul._id
        );
      });

      const sorted = [...modulesWithScreenshots].sort((a, b) => {
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

      const categoriesWithScreenshots = categories.filter((category) => {
        return screenshots.some(
          (screenshot) =>
            String(screenshot.appId) === selectedReorderApp?._id &&
            screenshot.modul === modul._id &&
            screenshot.category === category._id
        );
      });

      const sorted = [...categoriesWithScreenshots].sort(() => 0);
      setOrderedCategories(sorted);
    },
    [categories, screenshots, selectedReorderApp]
  );

  const handleSelectCategory = useCallback(
    (category: TScreenCategoryRes) => {
      setSelectedReorderCategory(category);
      setReorderLevel("screenshot");

      const filtered = screenshots.filter(
        (s) =>
          s.category === category._id &&
          s.modul === selectedReorderModule?._id &&
          String(s.appId) === selectedReorderApp?._id
      );
      const sorted = [...filtered].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
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
      if (appId) {
        handleExitReorderMode();
      } else {
        setReorderLevel("app");
        setSelectedReorderApp(null);
        setOrderedModules([]);
      }
    }
  }, [reorderLevel, appId, handleExitReorderMode]);

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

  const handleSaveModuleOrder = useCallback(() => {
    toast({
      title: "Module Order Ready",
      description:
        "Module order data is ready. Please implement API integration.",
    });
  }, [toast]);

  const handleSaveCategoryOrder = useCallback(() => {
    toast({
      title: "Category Order Ready",
      description:
        "Category order data is ready. Please implement API integration.",
    });
  }, [toast]);

  const handleSaveScreenshotOrder = useCallback(async () => {
    try {
      setIsLoadingPost(true);

      const updatedOrder = orderedScreenshots.map((screenshot, index) => ({
        id: screenshot.id,
        order: index + 1,
      }));

      await ScreenAPI.updateOrder({
        screens: updatedOrder,
      });

      toast({
        title: "Order Updated",
        description: `Screenshot order has been saved successfully.`,
      });

      setScreenshots(
        screenshots.map((screenshot) => {
          const updated = updatedOrder.find((u) => u.id === screenshot.id);
          return updated ? { ...screenshot, order: updated.order } : screenshot;
        })
      );

      handleExitReorderMode();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save order",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPost(false);
    }
  }, [orderedScreenshots, toast, handleExitReorderMode, screenshots, setScreenshots]);

  return {
    isReorderMode,
    reorderLevel,
    selectedReorderApp,
    selectedReorderModule,
    selectedReorderCategory,
    orderedModules,
    orderedCategories,
    orderedScreenshots,
    activeId,
    isLoadingPost,
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
  };
};
