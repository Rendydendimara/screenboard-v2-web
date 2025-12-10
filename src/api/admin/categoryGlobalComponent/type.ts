export type TCategoryGlobalComponentPost = {
  name: string;
};

export type TCategoryGlobalComponentPut = {
  id: string;
} & TCategoryGlobalComponentPost;

export type TCategoryGlobalComponentRes = {
  _id: string;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null;
  deletedBy: string | null;
  updatedBy: string | null;
};
