import { TAppRes, TAppResPublic } from "@/api/admin/app/type";
import { TScreenRes } from "@/api/admin/screen/type";
import { App } from "@/components/AdminAppManager";
import { Screenshot } from "@/components/AdminScreenshotManager";
import { AppPublic, ScreenPublic } from "@/pages/Index";
import { getImageUrl } from ".";

export const adapterListAppBEToFE = (data: TAppRes[]): App[] => {
  const result: App[] = [];
  data.map((d) => {
    result.push({
      id: d._id,
      name: d.name,
      category: d.category,
      subcategory: d.subcategory,
      platform: d.platform,
      image: d.iconUrl,
      description: d.description,
      downloads: d.downloads,
      rating: d.rating,
      tags: d.tags,
      color: d.color,
      company: d.company,
      screenshots: d.screenshots,
      screens: d.screens,
    });
  });
  return result;
};

export const adapterSingleAppBEToFE = (data: TAppRes): App => {
  const result: App = {
    id: data._id,
    name: data.name,
    category: data.category,
    subcategory: data.subcategory,
    platform: data.platform,
    image: data.iconUrl,
    description: data.description,
    downloads: data.downloads,
    rating: data.rating,
    tags: data.tags,
    color: data.color,
    company: data.company,
    screenshots: data.screenshots,
    screens: data.screens,
    lastUpdated: data.updatedAt
      ? new Date(data.updatedAt).toLocaleDateString()
      : "",
  };
  return result;
};

export const adapterListScreenBEToFE = (data: TScreenRes[]): Screenshot[] => {
  const result: Screenshot[] = [];
  data.map((d) => {
    result.push({
      id: d._id,
      name: d.name,
      category: d.category,
      image: getImageUrl(d.image),
      description: d.description,
      appId: d.app,
    });
  });
  return result;
};

export const adapterListAppBEToFEPublic = (
  data: TAppResPublic[]
): AppPublic[] => {
  const result: AppPublic[] = [];
  data.map((d) => {
    const screens: ScreenPublic[] = d.screens.map((t) => {
      return {
        id: t._id,
        name: t.name,
        category: t.category,
        image: getImageUrl(t.image),
        description: t.description,
        appName: t?.app?.name ?? "",
        modul: t?.modul?.name ?? "",
      };
    });
    result.push({
      id: d._id,
      name: d.name,
      category: d.category,
      subcategory: d.subcategory,
      platform: d.platform,
      image: d.iconUrl,
      description: d.description,
      downloads: d.downloads,
      rating: d.rating,
      tags: d.tags,
      color: d.color,
      company: d.company,
      screenshots: d.screenshots,
      screens: screens,
      isLiked: false,
      featured: d.featured,
      trending: d.trending,
      lastUpdated: d.updatedAt
        ? new Date(d.updatedAt).toLocaleDateString()
        : "",
    });
  });
  return result;
};

export const adapterSingleAppBEToFEPublic = (
  data: TAppResPublic
): AppPublic => {
  const screens: ScreenPublic[] = data.screens.map((t) => {
    return {
      id: t._id,
      name: t.name,
      category: t.category,
      image: getImageUrl(t.image),
      description: t.description,
      appName: t?.app?.name ?? "",
      modul: t?.modul?.name ?? "",
    };
  });
  const result: AppPublic = {
    id: data._id,
    name: data.name,
    category: data.category,
    subcategory: data.subcategory,
    platform: data.platform,
    image: data.iconUrl,
    description: data.description,
    downloads: data.downloads,
    rating: data.rating,
    tags: data.tags,
    color: data.color,
    company: data.company,
    screenshots: data.screenshots,
    screens: screens,
    isLiked: false,
    featured: data.featured,
    trending: data.trending,
    lastUpdated: data.updatedAt
      ? new Date(data.updatedAt).toLocaleDateString()
      : "",
  };
  return result;
};
