import { logEvent as firebaseLogEvent } from "firebase/analytics";
import { analytics as analyticsFirebase } from "./firebase";
import mixpanel from "mixpanel-browser";

// Initialize Mixpanel
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;
const isDevelopment = import.meta.env.MODE === "development";
const isProduction = import.meta.env.MODE === "production";
const enableAnalyticsInDev =
  import.meta.env.VITE_ENABLE_ANALYTICS_IN_DEV === "true";

// Initialize Mixpanel in production, or in development if explicitly enabled
const shouldInitialize =
  isProduction || (isDevelopment && enableAnalyticsInDev);

if (MIXPANEL_TOKEN && shouldInitialize) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: isDevelopment && enableAnalyticsInDev,
    track_pageview: true,
    persistence: "localStorage",
  });
}

// Analytics Event Types
export enum AnalyticsEvent {
  // Page Views
  PAGE_VIEW = "page_view",

  // User Actions
  SIGN_UP = "sign_up",
  LOGIN = "login",
  LOGOUT = "logout",

  // App Interactions
  APP_VIEW = "app_view",
  APP_COMPARE = "app_compare",
  APP_FAVORITE = "app_favorite",
  APP_UNFAVORITE = "app_unfavorite",
  APP_FILTER = "app_filter",
  APP_SEARCH = "app_search",

  // Screenshot Interactions
  SCREENSHOT_VIEW = "screenshot_view",
  SCREENSHOT_ZOOM = "screenshot_zoom",
  SCREENSHOT_DOWNLOAD = "screenshot_download",

  // Component Interactions
  COMPONENT_VIEW = "component_view",
  COMPONENT_FILTER = "component_filter",

  // Subscription
  SUBSCRIPTION_VIEW = "subscription_view",
  SUBSCRIPTION_SELECT = "subscription_select",
  SUBSCRIPTION_SUCCESS = "subscription_success",
  SUBSCRIPTION_CANCEL = "subscription_cancel",

  // Admin Actions
  ADMIN_LOGIN = "admin_login",
  ADMIN_APP_CREATE = "admin_app_create",
  ADMIN_APP_UPDATE = "admin_app_update",
  ADMIN_APP_DELETE = "admin_app_delete",

  // Error Tracking
  ERROR = "error",
}

// Analytics User Properties
export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  role?: "user" | "admin";
  subscriptionPlan?: string;
  subscriptionStatus?: "active" | "inactive" | "trial";
}

// Analytics Event Properties
export interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

class Analytics {
  private isInitialized = false;
  private isEnabled = false;

  constructor() {
    // Enable analytics in production, or in development if explicitly enabled
    this.isEnabled = isProduction || (isDevelopment && enableAnalyticsInDev);
    this.isInitialized = !!(analyticsFirebase && MIXPANEL_TOKEN);

    // if (isDevelopment) {
    //   if (enableAnalyticsInDev) {
    //     console.log(
    //       "%c[Analytics] ✓ Enabled in development mode",
    //       "color: #00CC00; font-weight: bold"
    //     );
    //   } else {
    //     console.log(
    //       "%c[Analytics] ✗ Disabled in development mode",
    //       "color: #FFA500; font-weight: bold"
    //     );
    //     console.log(
    //       "%cTo enable analytics in dev, set VITE_ENABLE_ANALYTICS_IN_DEV=true in .env",
    //       "color: #999"
    //     );
    //   }
    // }
  }

  /**
   * Track page view
   * @param pagePath - The path of the page
   * @param pageTitle - The title of the page
   */
  trackPageView(pagePath: string, pageTitle?: string) {
    if (!this.isEnabled || !this.isInitialized) return;

    const properties = {
      page_path: pagePath,
      page_title: pageTitle || document.title,
      page_location: window.location.href,
    };

    // Google Analytics
    if (analyticsFirebase) {
      firebaseLogEvent(analyticsFirebase, AnalyticsEvent.PAGE_VIEW, properties);
    }

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.track_pageview(properties);
    }
  }

  /**
   * Track custom event
   * @param eventName - Name of the event
   * @param properties - Additional properties for the event
   */
  trackEvent(eventName: AnalyticsEvent | string, properties?: EventProperties) {
    if (!this.isEnabled || !this.isInitialized) return;

    // Google Analytics
    if (analyticsFirebase) {
      firebaseLogEvent(analyticsFirebase, eventName, properties);
    }

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.track(eventName, properties);
    }
  }

  /**
   * Identify user with properties
   * @param userId - Unique user identifier
   * @param properties - User properties
   */
  identifyUser(userId: string, properties?: UserProperties) {
    if (!this.isEnabled || !this.isInitialized) return;

    // Google Analytics - Set user ID and properties
    if (analyticsFirebase) {
      firebaseLogEvent(analyticsFirebase, "login", { user_id: userId });
    }

    // Mixpanel - Identify and set user properties
    if (MIXPANEL_TOKEN) {
      mixpanel.identify(userId);
      if (properties) {
        mixpanel.people.set(properties);
      }
    }
  }

  /**
   * Set user properties
   * @param properties - User properties to set
   */
  setUserProperties(properties: UserProperties) {
    if (!this.isEnabled || !this.isInitialized) return;

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.people.set(properties);
    }
  }

  /**
   * Reset user identity (on logout)
   */
  resetUser() {
    if (!this.isEnabled || !this.isInitialized) return;

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.reset();
    }
  }

  /**
   * Track timing/performance
   * @param category - Timing category
   * @param variable - Timing variable name
   * @param value - Time value in milliseconds
   */
  trackTiming(category: string, variable: string, value: number) {
    if (!this.isEnabled || !this.isInitialized) return;

    const properties = {
      category,
      variable,
      value,
    };

    // Google Analytics
    if (analyticsFirebase) {
      firebaseLogEvent(analyticsFirebase, "timing_complete", properties);
    }

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.track("Timing", properties);
    }
  }

  /**
   * Track error
   * @param error - Error object or message
   * @param fatal - Whether the error is fatal
   */
  trackError(error: Error | string, fatal = false) {
    if (!this.isEnabled || !this.isInitialized) return;

    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;

    const properties = {
      description: errorMessage,
      fatal,
      stack: errorStack,
    };

    // Google Analytics
    if (analyticsFirebase) {
      firebaseLogEvent(analyticsFirebase, AnalyticsEvent.ERROR, properties);
    }

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.track(AnalyticsEvent.ERROR, properties);
    }
  }

  /**
   * Track conversion/goal completion
   * @param goalName - Name of the goal/conversion
   * @param value - Optional value associated with the conversion
   */
  trackConversion(goalName: string, value?: number) {
    if (!this.isEnabled || !this.isInitialized) return;

    const properties = {
      goal_name: goalName,
      value,
    };

    // Google Analytics
    if (analyticsFirebase) {
      firebaseLogEvent(analyticsFirebase, "conversion", properties);
    }

    // Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.track("Conversion", properties);
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Helper functions for common events
export const trackPageView = (pagePath: string, pageTitle?: string) =>
  analytics.trackPageView(pagePath, pageTitle);

export const trackEvent = (
  eventName: AnalyticsEvent | string,
  properties?: EventProperties
) => analytics.trackEvent(eventName, properties);

export const identifyUser = (userId: string, properties?: UserProperties) =>
  analytics.identifyUser(userId, properties);

export const setUserProperties = (properties: UserProperties) =>
  analytics.setUserProperties(properties);

export const resetUser = () => analytics.resetUser();

export const trackTiming = (
  category: string,
  variable: string,
  value: number
) => analytics.trackTiming(category, variable, value);

export const trackError = (error: Error | string, fatal = false) =>
  analytics.trackError(error, fatal);

export const trackConversion = (goalName: string, value?: number) =>
  analytics.trackConversion(goalName, value);
