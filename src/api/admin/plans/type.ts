export type TPlan = {
  _id: string;
  name: string;
  slug: 'pro' | 'business';
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripePriceId: string;
  stripeProductId: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TCreatePlan = {
  name: string;
  slug: 'pro' | 'business';
  description: string;
  price: number;
  currency?: string;
  interval?: 'month' | 'year';
  stripePriceId: string;
  stripeProductId: string;
  features?: string[];
  isActive?: boolean;
};

export type TUpdatePlan = {
  name?: string;
  slug?: 'pro' | 'business';
  description?: string;
  price?: number;
  currency?: string;
  interval?: 'month' | 'year';
  stripePriceId?: string;
  stripeProductId?: string;
  features?: string[];
  isActive?: boolean;
};
