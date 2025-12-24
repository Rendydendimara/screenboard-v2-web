/**
 * Analytics Tracking Examples
 *
 * This file contains examples of how to implement analytics tracking
 * across different user flows in the application.
 */

import {
  trackEvent,
  AnalyticsEvent,
  identifyUser,
  resetUser,
  trackConversion,
  trackError,
} from "./analytics";

// ============================================================================
// AUTH TRACKING EXAMPLES
// ============================================================================

/**
 * Track user signup
 * Call this after successful user registration
 */
export const trackSignUp = (userId: string, method: "email" | "google") => {
  trackEvent(AnalyticsEvent.SIGN_UP, {
    method,
    timestamp: Date.now(),
  });

  identifyUser(userId, {
    userId,
    role: "user",
  });
};

/**
 * Track user login
 * Call this after successful login
 */
export const trackLogin = (
  userId: string,
  email: string,
  method: "email" | "google"
) => {
  trackEvent(AnalyticsEvent.LOGIN, {
    method,
    timestamp: Date.now(),
  });

  identifyUser(userId, {
    userId,
    email,
    role: "user",
  });
};

/**
 * Track admin login
 * Call this after successful admin login
 */
export const trackAdminLogin = (userId: string, email: string) => {
  trackEvent(AnalyticsEvent.ADMIN_LOGIN, {
    timestamp: Date.now(),
  });

  identifyUser(userId, {
    userId,
    email,
    role: "admin",
  });
};

/**
 * Track user logout
 * Call this when user logs out
 */
export const trackLogout = () => {
  trackEvent(AnalyticsEvent.LOGOUT);
  resetUser();
};

// ============================================================================
// APP INTERACTION TRACKING EXAMPLES
// ============================================================================

/**
 * Track app view
 * Call this when user views an app detail page
 */
export const trackAppView = (appId: string, appName: string) => {
  trackEvent(AnalyticsEvent.APP_VIEW, {
    app_id: appId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

/**
 * Track app comparison
 * Call this when user compares apps
 */
export const trackAppCompare = (appIds: string[], appNames: string[]) => {
  trackEvent(AnalyticsEvent.APP_COMPARE, {
    app_ids: appIds.join(","),
    app_names: appNames.join(","),
    app_count: appIds.length,
    timestamp: Date.now(),
  });
};

/**
 * Track app favorite
 * Call this when user adds app to favorites
 */
export const trackAppFavorite = (appId: string, appName: string) => {
  trackEvent(AnalyticsEvent.APP_FAVORITE, {
    app_id: appId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

/**
 * Track app unfavorite
 * Call this when user removes app from favorites
 */
export const trackAppUnfavorite = (appId: string, appName: string) => {
  trackEvent(AnalyticsEvent.APP_UNFAVORITE, {
    app_id: appId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

/**
 * Track app filter
 * Call this when user applies filters to app list
 */
export const trackAppFilter = (filterType: string, filterValue: string) => {
  trackEvent(AnalyticsEvent.APP_FILTER, {
    filter_type: filterType,
    filter_value: filterValue,
    timestamp: Date.now(),
  });
};

/**
 * Track app search
 * Call this when user searches for apps
 */
export const trackAppSearch = (searchQuery: string, resultsCount: number) => {
  trackEvent(AnalyticsEvent.APP_SEARCH, {
    search_query: searchQuery,
    results_count: resultsCount,
    timestamp: Date.now(),
  });
};

// ============================================================================
// SCREENSHOT TRACKING EXAMPLES
// ============================================================================

/**
 * Track screenshot view
 * Call this when user views a screenshot in detail
 */
export const trackScreenshotView = (
  screenshotId: string,
  appName: string,
  category?: string
) => {
  trackEvent(AnalyticsEvent.SCREENSHOT_VIEW, {
    screenshot_id: screenshotId,
    app_name: appName,
    category: category || "uncategorized",
    timestamp: Date.now(),
  });
};

/**
 * Track screenshot zoom
 * Call this when user zooms into a screenshot
 */
export const trackScreenshotZoom = (screenshotId: string, appName: string) => {
  trackEvent(AnalyticsEvent.SCREENSHOT_ZOOM, {
    screenshot_id: screenshotId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

/**
 * Track screenshot download
 * Call this when user downloads a screenshot
 */
export const trackScreenshotDownload = (
  screenshotId: string,
  appName: string
) => {
  trackEvent(AnalyticsEvent.SCREENSHOT_DOWNLOAD, {
    screenshot_id: screenshotId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

// ============================================================================
// COMPONENT TRACKING EXAMPLES
// ============================================================================

/**
 * Track component view
 * Call this when user views a component detail page
 */
export const trackComponentView = (
  componentId: string,
  componentName: string
) => {
  trackEvent(AnalyticsEvent.COMPONENT_VIEW, {
    component_id: componentId,
    component_name: componentName,
    timestamp: Date.now(),
  });
};

/**
 * Track component filter
 * Call this when user filters components
 */
export const trackComponentFilter = (
  filterType: string,
  filterValue: string
) => {
  trackEvent(AnalyticsEvent.COMPONENT_FILTER, {
    filter_type: filterType,
    filter_value: filterValue,
    timestamp: Date.now(),
  });
};

// ============================================================================
// SUBSCRIPTION TRACKING EXAMPLES
// ============================================================================

/**
 * Track subscription page view
 * Call this when user views subscription plans
 */
export const trackSubscriptionView = () => {
  trackEvent(AnalyticsEvent.SUBSCRIPTION_VIEW, {
    timestamp: Date.now(),
  });
};

/**
 * Track subscription plan selection
 * Call this when user selects a subscription plan
 */
export const trackSubscriptionSelect = (
  planName: string,
  planPrice: number,
  planDuration: "monthly" | "yearly"
) => {
  trackEvent(AnalyticsEvent.SUBSCRIPTION_SELECT, {
    plan_name: planName,
    plan_price: planPrice,
    plan_duration: planDuration,
    timestamp: Date.now(),
  });
};

/**
 * Track successful subscription
 * Call this after successful subscription payment
 */
export const trackSubscriptionSuccess = (
  planName: string,
  planPrice: number,
  planDuration: "monthly" | "yearly"
) => {
  trackEvent(AnalyticsEvent.SUBSCRIPTION_SUCCESS, {
    plan_name: planName,
    plan_price: planPrice,
    plan_duration: planDuration,
    timestamp: Date.now(),
  });

  // Track conversion
  trackConversion("subscription_purchase", planPrice);
};

/**
 * Track subscription cancellation
 * Call this when user cancels subscription
 */
export const trackSubscriptionCancel = (planName: string, reason?: string) => {
  trackEvent(AnalyticsEvent.SUBSCRIPTION_CANCEL, {
    plan_name: planName,
    reason: reason || "not_specified",
    timestamp: Date.now(),
  });
};

// ============================================================================
// ADMIN TRACKING EXAMPLES
// ============================================================================

/**
 * Track admin app creation
 * Call this when admin creates a new app
 */
export const trackAdminAppCreate = (appId: string, appName: string) => {
  trackEvent(AnalyticsEvent.ADMIN_APP_CREATE, {
    app_id: appId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

/**
 * Track admin app update
 * Call this when admin updates an app
 */
export const trackAdminAppUpdate = (appId: string, appName: string) => {
  trackEvent(AnalyticsEvent.ADMIN_APP_UPDATE, {
    app_id: appId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

/**
 * Track admin app deletion
 * Call this when admin deletes an app
 */
export const trackAdminAppDelete = (appId: string, appName: string) => {
  trackEvent(AnalyticsEvent.ADMIN_APP_DELETE, {
    app_id: appId,
    app_name: appName,
    timestamp: Date.now(),
  });
};

// ============================================================================
// ERROR TRACKING EXAMPLES
// ============================================================================

/**
 * Track application errors
 * Call this in error boundaries or catch blocks
 */
export const trackApplicationError = (
  error: Error,
  context?: string,
  fatal = false
) => {
  trackError(error, fatal);

  // Additional context tracking
  trackEvent(AnalyticsEvent.ERROR, {
    error_message: error.message,
    error_stack: error.stack,
    context: context || "unknown",
    fatal,
    timestamp: Date.now(),
  });
};

/**
 * Track API errors
 * Call this when API calls fail
 */
export const trackAPIError = (
  endpoint: string,
  statusCode: number,
  errorMessage: string
) => {
  trackEvent(AnalyticsEvent.ERROR, {
    error_type: "api_error",
    endpoint,
    status_code: statusCode,
    error_message: errorMessage,
    timestamp: Date.now(),
  });
};
