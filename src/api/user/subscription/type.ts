export type TSubscriptionPlan = {
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

export type TSubscription = {
  _id: string;
  userId: string;
  planId: TSubscriptionPlan;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
};

export type TPaymentHistory = {
  _id: string;
  userId: string;
  subscriptionId: string;
  stripeInvoiceId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  paymentMethod?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateCheckout = {
  planSlug: 'pro' | 'business';
};

export type TCheckoutSession = {
  sessionId: string;
  url: string;
};

export type TBillingPortalSession = {
  url: string;
};

export type TSubscriptionStatus = {
  hasActiveSubscription: boolean;
};

export type TCheckoutSessionInfo = {
  id: string;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  amountTotal: number;
  currency: string;
};

export type TVerifySessionResponse = {
  session: TCheckoutSessionInfo;
  subscription: TSubscription | null;
};
