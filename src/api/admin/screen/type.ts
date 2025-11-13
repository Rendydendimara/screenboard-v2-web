import { BulkFileItem } from "@/components/AdminScreenshotManager";

export type TScreenPost = {
  app: string;
  name: string;
  category: string;
  description: string;
  modul: string;
  image: File;
};

export type TScreenPut = {
  screenId: string;
} & TScreenPost;

export type TScreenRes = {
  _id: string;
  app: string | null;
  name: string;
  category: string;
  image: string;
  description: string;
  modul: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null; // Referencing User
  deletedBy: string | null; // Referencing User or null
  updatedBy: string | null; // Referencing User or null
};

export type TScreenPostBulk = {
  app: string;
  category: string;
  modul: string;
  screens: BulkFileItem[]; //File[];
};
