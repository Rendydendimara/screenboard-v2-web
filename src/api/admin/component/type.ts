export type TComponent = {
  name: string;
  notes: string;
  category: string;
  appId: string;
  screens: File[];
};

export type TComponentPut = {
  componentId: string;
  oldScreens: string[];
} & TComponent;

export type TComponentRes = {
  _id: string;
  name: string;
  notes: string;
  category: string | null; // Referencing User
  appId: string | null; // Referencing User
  screens: string[]; // Referencing User
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
  createdBy: string | null; // Referencing User
  deletedBy: string | null; // Referencing User or null
  updatedBy: string | null; // Referencing User or null
};
