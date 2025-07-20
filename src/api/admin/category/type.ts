export type TCategory = {
  name: string;
};

export type TCategoryPut = {
  categoryId: string;
} & TCategory;

export type TCategoryRes = {
  _id: string;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null; // Referencing User
  deletedBy: string | null; // Referencing User or null
  updatedBy: string | null; // Referencing User or null
};
