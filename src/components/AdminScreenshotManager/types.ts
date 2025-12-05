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

export interface AdminScreenshotManagerProps {
  appId?: string;
  isHideCategory?: boolean;
  filterOnlyShowIfHasModul?: boolean;
}

export type ReorderLevel = "app" | "module" | "category" | "screenshot";

export interface FormData {
  name: string;
  category: string;
  image: string;
  description: string;
  appId: string;
  module: string;
}

export interface EditFormData {
  id: string;
  name: string;
  category: string;
  appId: string;
  module: string;
}
