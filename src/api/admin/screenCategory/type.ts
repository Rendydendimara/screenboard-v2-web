export type TScreenCategory = {
  name: string;
};

export type TScreenCategoryPut = {
  categoryId: string;
} & TScreenCategory;

export type TScreenCategoryRes = {
  _id: string;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null; // Referencing User
  deletedBy: string | null; // Referencing User or null
  updatedBy: string | null; // Referencing User or null
};
