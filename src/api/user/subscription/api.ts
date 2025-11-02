import { axiosInstanceNoAuth, axiosInstanceWithAuth } from '@/lib/axiosConfig';
import URL_API from '../../urls';
import {
  TCreateCheckout,
  TCheckoutSession,
  TSubscriptionPlan,
  TSubscription,
  TPaymentHistory,
  TBillingPortalSession,
  TSubscriptionStatus,
  TVerifySessionResponse,
} from './type';

/**
 * Get all available subscription plans (public)
 */
const getPlans = async () => {
  const response = await axiosInstanceNoAuth.get<{
    success: boolean;
    data: TSubscriptionPlan[];
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.GET_PLANS);
  return response.data;
};

/**
 * Create checkout session for subscription (requires auth)
 */
const createCheckoutSession = async (payload: TCreateCheckout) => {
  const response = await axiosInstanceWithAuth.post<{
    success: boolean;
    data: TCheckoutSession;
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.CREATE_CHECKOUT, payload);
  return response.data;
};

/**
 * Get current user subscription (requires auth)
 */
const getCurrentSubscription = async () => {
  const response = await axiosInstanceWithAuth.get<{
    success: boolean;
    data: TSubscription | null;
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.GET_CURRENT);
  return response.data;
};

/**
 * Cancel subscription (requires auth)
 */
const cancelSubscription = async () => {
  const response = await axiosInstanceWithAuth.post<{
    success: boolean;
    data: TSubscription;
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.CANCEL);
  return response.data;
};

/**
 * Reactivate subscription (requires auth)
 */
const reactivateSubscription = async () => {
  const response = await axiosInstanceWithAuth.post<{
    success: boolean;
    data: TSubscription;
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.REACTIVATE);
  return response.data;
};

/**
 * Get payment history (requires auth)
 */
const getPaymentHistory = async (limit: number = 10) => {
  const response = await axiosInstanceWithAuth.get<{
    success: boolean;
    data: TPaymentHistory[];
    message: string;
  }>(`${URL_API.USER.SUBSCRIPTION.V1.GET_PAYMENT_HISTORY}?limit=${limit}`);
  return response.data;
};

/**
 * Create billing portal session (requires auth)
 */
const createBillingPortal = async () => {
  const response = await axiosInstanceWithAuth.post<{
    success: boolean;
    data: TBillingPortalSession;
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.CREATE_BILLING_PORTAL);
  return response.data;
};

/**
 * Check subscription status (requires auth)
 */
const checkSubscriptionStatus = async () => {
  const response = await axiosInstanceWithAuth.get<{
    success: boolean;
    data: TSubscriptionStatus;
    message: string;
  }>(URL_API.USER.SUBSCRIPTION.V1.CHECK_STATUS);
  return response.data;
};

/**
 * Verify checkout session
 */
const verifySession = async (sessionId: string) => {
  const response = await axiosInstanceNoAuth.get<{
    success: boolean;
    data: TVerifySessionResponse;
    message: string;
  }>(`${URL_API.USER.SUBSCRIPTION.V1.VERIFY_SESSION}?sessionId=${sessionId}`);
  return response.data;
};

const UserSubscriptionAPI = {
  getPlans,
  createCheckoutSession,
  getCurrentSubscription,
  cancelSubscription,
  reactivateSubscription,
  getPaymentHistory,
  createBillingPortal,
  checkSubscriptionStatus,
  verifySession,
};

export default UserSubscriptionAPI;
