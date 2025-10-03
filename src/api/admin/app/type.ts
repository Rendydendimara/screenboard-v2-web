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
  icon?: File;
};
export type TAppPut = {
  oldScreenshot: string[];
  appId: string;
  oldIcon: string;
} & TAppPost;

export type TAppRes = {
  _id: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
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
  iconFile?: string;
};

export type TScreenResPublic = {
  _id: string;
  app: {
    _id: string;
    name: string;
  };
  modul: {
    _id: string;
    name: string;
  };
  name: string;
  category: string;
  image: string;
  description: string;
  createdAt: string;
  updatedAt: string | null;
  createdBy: string;
  __v: number;
};

export type TAppResPublic = {
  _id: string;
  category: {
    _id: string;
    name: string;
  };
  subcategory: {
    _id: string;
    name: string;
  };
  platform: "Android" | "iOS" | "Both";
  iconUrl: string;
  screenshots: string[];
  screens: TScreenResPublic[];
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  company: string;
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string;
  updatedBy: string;
  deletedBy: string | null;
  name: string;
  iconFile?: string;
};
