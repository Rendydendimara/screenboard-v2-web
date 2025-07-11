export type TAppPost = {
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  iconUrl: string;
  screenshots: File[];
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  company: string;
};
export type TAppPut = {
  oldScreenshot: string[];
  appId: string;
} & TAppPost;

export type TAppRes = {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  iconUrl: string;
  screenshots: string[];
  screens: string[];
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  company: string;
  featured: boolean;
  trending: boolean;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null; // Referencing User
  deletedBy: string | null; // Referencing User or null
  updatedBy: string | null; // Referencing User or null
};
