export type TGlobalComponentPost = {
  name: string;
  description: string;
  link: string;
  tags: string[];
  screenshots: File[];
  category: string;
};

export type TGlobalComponentPut = {
  globalComponentId: string;
  oldScreenshots: IScreenshot[];
} & TGlobalComponentPost;

export type TGlobalComponentRes = {
  _id: string;
  name: string;
  description: string;
  link: string;
  tags: string[];
  screenshots: IScreenshot[];
  category?: {
    _id: string;
    name: string;
  };
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
};

export interface IScreenshot {
  fileName: string;
  filePath: string;
}
