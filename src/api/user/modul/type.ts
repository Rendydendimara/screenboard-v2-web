export type TModulRes = {
  _id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
};

export type TModulAppScreen = {
  _id: string;
  name: string;
  image: string;
  description?: string;
  order?: number;
  category: { _id: string; name: string } | null;
};

export type TModulApp = {
  _id: string;
  name: string;
  iconUrl: string;
  company: string | null;
  category: { _id: string; name: string } | null;
  subcategory: { _id: string; name: string } | null;
  screens: TModulAppScreen[];
};

export type TModulDetailRes = {
  modul: TModulRes;
  apps: TModulApp[];
  totalScreens: number;
};
