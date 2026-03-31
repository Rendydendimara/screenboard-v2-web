export type TModul = {
  name: string;
  description?: string | null;
};

export type TModulPut = {
  modulId: string;
} & TModul;

export type TModulRes = {
  _id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null; // Referencing User
  deletedBy: string | null; // Referencing User or null
  updatedBy: string | null; // Referencing User or null
};
