import { useState, useCallback } from "react";
import AppAPI from "@/api/admin/app/api";
import ModulAPI from "@/api/admin/modul/api";
import ScreenAPI from "@/api/admin/screen/api";
import ScreenCategoryAPI from "@/api/admin/screenCategory/api";
import { TAppRes } from "@/api/admin/app/type";
import { TModulRes } from "@/api/admin/modul/type";
import { TScreenCategoryRes } from "@/api/admin/screenCategory/type";
import { TScreenRes } from "@/api/admin/screen/type";
import { TSelect } from "@/types";
import { adapterListScreenBEToFE } from "@/utils/adapterBEToFE";
import { processMultipleImages } from "@/utils/colorExtraction";
import { Screenshot } from "../types";

export const useScreenshotData = (appId: string | undefined, toast: any) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [listModule, setListModule] = useState<TSelect[]>([]);
  const [listApp, setListApp] = useState<TSelect[]>([]);
  const [rawModules, setRawModules] = useState<TModulRes[]>([]);
  const [rawApps, setRawApps] = useState<TAppRes[]>([]);
  const [categories, setCategories] = useState<TScreenCategoryRes[]>([]);
  const [isProcessingColors, setIsProcessingColors] = useState(false);
  const [colorProcessingProgress, setColorProcessingProgress] = useState({
    current: 0,
    total: 0,
  });

  const processColorsForScreenshots = useCallback(
    async (screenshotList: Screenshot[]) => {
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
        console.log("updatedScreenshots", updatedScreenshots);
        setScreenshots(updatedScreenshots);
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
    },
    [toast]
  );

  const getListData = useCallback(async () => {
    try {
      let res;
      if (appId) {
        res = await ScreenAPI.getAll({ app: appId });
      } else {
        res = await ScreenAPI.getAll();
      }
      const data: TScreenRes[] = res.data;
      const newScreenshots: Screenshot[] = adapterListScreenBEToFE(data);
      await processColorsForScreenshots(newScreenshots);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response?.data?.message,
        variant: "destructive",
      });
    }
  }, [appId, processColorsForScreenshots, toast]);

  const getDataOptions = useCallback(async () => {
    try {
      const res = await Promise.all([ModulAPI.getAll(), AppAPI.getAll()]);
      const dataModul: TModulRes[] = res[0]?.data ?? [];
      const tempModule: TSelect[] = dataModul.map((d) => ({
        label: d.name,
        value: d._id,
      }));
      setListModule(tempModule);
      setRawModules(dataModul);

      const dataApp: TAppRes[] = res[1]?.data ?? [];
      const tempApp: TSelect[] = dataApp.map((d) => ({
        label: d.name,
        value: d._id,
      }));
      setListApp(tempApp);
      setRawApps(dataApp);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response?.data?.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  const getListDataCategory = useCallback(async () => {
    try {
      const dataRes = await ScreenCategoryAPI.getAll();
      setCategories(dataRes?.data ?? []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || error.response?.data?.message,
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
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
  };
};
