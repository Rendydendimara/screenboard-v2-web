export type TGlobalComponentPost = {
  name: string;
  description: string;
  link: string;
  tags: string[];
  screenshots: File[];
};

export type TGlobalComponentPut = {
  globalComponentId: string;
  oldScreenshots: string[];
} & TGlobalComponentPost;

export type TGlobalComponentRes = {
  _id: string;
  name: string;
  description: string;
  link: string;
  tags: string[];
  screenshots: string[];
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
  category: {
    _id: string;
    name: string;
  };
};
