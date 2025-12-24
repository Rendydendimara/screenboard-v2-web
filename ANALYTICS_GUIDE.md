# Analytics Implementation Guide

This guide explains how to use Google Analytics and Mixpanel tracking in the Screenboard application.

## Table of Contents

1. [Setup](#setup)
2. [Configuration](#configuration)
3. [Basic Usage](#basic-usage)
4. [Advanced Tracking](#advanced-tracking)
5. [Best Practices](#best-practices)
6. [Testing](#testing)

---

## Setup

### Prerequisites

The following packages are already installed:
- `firebase` (v12.3.0) - For Google Analytics
- `mixpanel-browser` - For Mixpanel tracking

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# Firebase Google Analytics
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Mixpanel
VITE_MIXPANEL_TOKEN=your_mixpanel_token_here

# Analytics Settings (Optional)
# Set to 'true' to enable analytics in development mode
# Default: false (analytics disabled in dev)
VITE_ENABLE_ANALYTICS_IN_DEV=false
```

**Important:** By default, analytics is **DISABLED in development mode** (`npm run dev`) to prevent test data from polluting your production analytics. It will only work in production builds (`npm run build`).

**How to get these values:**

1. **Google Analytics Measurement ID:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (screenboard-b5324)
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Find your web app and copy the `measurementId`

2. **Mixpanel Token:**
   - Go to [Mixpanel](https://mixpanel.com/)
   - Create a new project or select existing one
   - Go to Project Settings
   - Copy the "Project Token"

---

## Configuration

The analytics system is already configured and will automatically:
- ✅ Track page views on route changes
- ✅ Initialize both Google Analytics and Mixpanel
- ✅ Identify users when they log in
- ✅ Work in both development and production environments

---

## Basic Usage

### 1. Automatic Page View Tracking

Page views are tracked automatically when users navigate between routes. No additional code needed!

```tsx
// Already implemented in App.tsx
import { usePageTracking } from "./hooks/use-page-tracking";

const App = () => {
  usePageTracking(); // Tracks all route changes automatically
  // ... rest of your component
};
```

### 2. Track Custom Events

```tsx
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";

// Simple event
trackEvent(AnalyticsEvent.APP_VIEW, {
  app_id: "123",
  app_name: "Instagram Clone",
});

// Custom event with properties
trackEvent("custom_event_name", {
  property1: "value1",
  property2: 123,
  property3: true,
});
```

### 3. Identify Users

```tsx
import { identifyUser } from "@/lib/analytics";

// After successful login
identifyUser(user.id, {
  userId: user.id,
  email: user.email,
  name: user.name,
  role: "user",
  subscriptionPlan: "premium",
  subscriptionStatus: "active",
});
```

### 4. Track User Logout

```tsx
import { resetUser } from "@/lib/analytics";

// When user logs out
const handleLogout = () => {
  // ... your logout logic
  resetUser(); // Clears user identity from analytics
};
```

---

## Advanced Tracking

### Using Pre-built Helper Functions

We've created helper functions for common tracking scenarios in `src/lib/analytics-examples.ts`:

#### Authentication Tracking

```tsx
import { trackLogin, trackLogout, trackSignUp } from "@/lib/analytics-examples";

// Track signup
trackSignUp(userId, "email");

// Track login
trackLogin(userId, email, "google");

// Track logout
trackLogout();
```

#### App Interaction Tracking

```tsx
import {
  trackAppView,
  trackAppCompare,
  trackAppFavorite,
  trackAppFilter,
} from "@/lib/analytics-examples";

// Track app view
trackAppView(app.id, app.name);

// Track app comparison
trackAppCompare(
  ["app1", "app2"],
  ["Instagram", "TikTok"]
);

// Track favorite
trackAppFavorite(app.id, app.name);

// Track filter usage
trackAppFilter("category", "Social Media");
```

#### Screenshot Tracking

```tsx
import {
  trackScreenshotView,
  trackScreenshotZoom,
  trackScreenshotDownload,
} from "@/lib/analytics-examples";

// Track screenshot interactions
trackScreenshotView(screenshot.id, app.name, "Login Screen");
trackScreenshotZoom(screenshot.id, app.name);
trackScreenshotDownload(screenshot.id, app.name);
```

#### Subscription Tracking

```tsx
import {
  trackSubscriptionSelect,
  trackSubscriptionSuccess,
  trackSubscriptionCancel,
} from "@/lib/analytics-examples";

// Track subscription selection
trackSubscriptionSelect("Premium", 29.99, "monthly");

// Track successful purchase
trackSubscriptionSuccess("Premium", 29.99, "monthly");

// Track cancellation
trackSubscriptionCancel("Premium", "too_expensive");
```

#### Error Tracking

```tsx
import { trackApplicationError, trackAPIError } from "@/lib/analytics-examples";

// Track application errors
try {
  // ... your code
} catch (error) {
  trackApplicationError(error, "component_name", false);
}

// Track API errors
trackAPIError("/api/apps", 500, "Internal server error");
```

---

## Implementation Examples

### Example 1: Track App View in AppDetails Page

```tsx
// src/pages/AppDetail/useController.tsx
import { useEffect } from "react";
import { trackAppView } from "@/lib/analytics-examples";

export const useAppDetailController = (appId: string) => {
  useEffect(() => {
    if (appData) {
      trackAppView(appData.id, appData.name);
    }
  }, [appData]);
};
```

### Example 2: Track Favorite Toggle

```tsx
// In your favorite button component
import { trackAppFavorite, trackAppUnfavorite } from "@/lib/analytics-examples";

const handleFavoriteToggle = async () => {
  const newFavoriteState = !isFavorite;
  setIsFavorite(newFavoriteState);

  if (newFavoriteState) {
    trackAppFavorite(app.id, app.name);
  } else {
    trackAppUnfavorite(app.id, app.name);
  }

  // ... rest of your logic
};
```

### Example 3: Track Filter Changes

```tsx
// In your filter component
import { trackAppFilter } from "@/lib/analytics-examples";

const handleFilterChange = (filterType: string, value: string) => {
  trackAppFilter(filterType, value);
  // ... apply filter logic
};
```

### Example 4: Track Subscription Flow

```tsx
// src/pages/Subscription.tsx
import { useEffect } from "react";
import { trackSubscriptionView, trackSubscriptionSelect } from "@/lib/analytics-examples";

const Subscription = () => {
  useEffect(() => {
    trackSubscriptionView();
  }, []);

  const handleSelectPlan = (plan) => {
    trackSubscriptionSelect(plan.name, plan.price, plan.duration);
    // ... proceed to checkout
  };

  // ... rest of component
};
```

---

## Best Practices

### 1. Event Naming Convention

Use the predefined `AnalyticsEvent` enum for consistency:

```tsx
// ✅ GOOD
trackEvent(AnalyticsEvent.APP_VIEW, { ... });

// ❌ AVOID
trackEvent("app_view", { ... }); // Typo-prone
```

### 2. Add Meaningful Properties

Always include relevant context:

```tsx
// ✅ GOOD
trackEvent(AnalyticsEvent.APP_FILTER, {
  filter_type: "category",
  filter_value: "Social Media",
  results_count: 15,
  timestamp: Date.now(),
});

// ❌ AVOID
trackEvent(AnalyticsEvent.APP_FILTER); // Missing context
```

### 3. Track User Actions, Not Component Renders

```tsx
// ✅ GOOD - Track when user actually clicks
const handleClick = () => {
  trackEvent(AnalyticsEvent.APP_VIEW);
  // ... handle click
};

// ❌ AVOID - Tracks on every render
useEffect(() => {
  trackEvent(AnalyticsEvent.APP_VIEW);
}, []); // Unless this is intentional page view tracking
```

### 4. Don't Track PII (Personally Identifiable Information)

```tsx
// ✅ GOOD
trackEvent(AnalyticsEvent.SEARCH, {
  search_query: searchTerm,
  results_count: results.length,
});

// ❌ AVOID
trackEvent(AnalyticsEvent.PROFILE_UPDATE, {
  phone_number: user.phone, // PII!
  credit_card: user.card, // PII!
});
```

### 5. Handle Errors Gracefully

```tsx
try {
  await someAPICall();
} catch (error) {
  // Track the error
  trackApplicationError(error, "api_call_context", false);

  // Show user-friendly message
  toast.error("Something went wrong");
}
```

---

## Testing

### Development Environment

**By default, analytics is DISABLED in development mode** to prevent test data from contaminating your production analytics.

When you run `npm run dev`, you will see this message in the browser console:
```
[Analytics] ✗ Disabled in development mode
To enable analytics in dev, set VITE_ENABLE_ANALYTICS_IN_DEV=true in .env
```

### Enable Analytics in Development (For Testing)

If you need to test analytics during development:

1. Edit your `.env` file:
```env
VITE_ENABLE_ANALYTICS_IN_DEV=true
```

2. Restart your dev server:
```bash
npm run dev
```

3. You should see this message in the console:
```
[Analytics] ✓ Enabled in development mode
```

4. **Important:** Remember to set it back to `false` when done testing!

### Production Environment

Analytics is **ALWAYS enabled** in production builds (`npm run build` or `npm run build:dev`).

### Check if Analytics is Working

1. **Google Analytics:**
   - Open Chrome DevTools > Network tab
   - Filter by "google-analytics" or "collect"
   - You should see requests being sent

2. **Mixpanel:**
   - Open Chrome DevTools > Console
   - Look for Mixpanel debug logs (in development mode)
   - Or use Mixpanel Chrome Extension

3. **Manual Test:**
   ```tsx
   import { trackEvent } from "@/lib/analytics";

   // Add this temporarily to test
   trackEvent("test_event", {
     test_property: "test_value",
     timestamp: Date.now(),
   });
   ```

### Verify in Dashboards

1. **Google Analytics:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Select your property
   - Go to Reports > Realtime
   - Perform actions and see events in real-time

2. **Mixpanel:**
   - Go to [Mixpanel](https://mixpanel.com/)
   - Go to Events page
   - Filter by event name
   - Check if events are being received

---

## Available Analytics Events

Here's a complete list of predefined events:

```tsx
enum AnalyticsEvent {
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
```

---

## Troubleshooting

### Events Not Showing Up

1. **Check environment variables:**
   ```bash
   echo $VITE_FIREBASE_MEASUREMENT_ID
   echo $VITE_MIXPANEL_TOKEN
   ```

2. **Verify initialization:**
   - Open browser console
   - Look for Firebase/Mixpanel initialization errors

3. **Check ad blockers:**
   - Disable ad blockers during testing
   - They often block analytics requests

### TypeScript Errors

If you get TypeScript errors, make sure to import types:

```tsx
import { AnalyticsEvent, EventProperties } from "@/lib/analytics";
```

---

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Test in incognito mode (to avoid ad blocker issues)
4. Check Firebase and Mixpanel dashboards for incoming data

---

## Quick Reference

```tsx
// Import what you need
import {
  trackEvent,
  trackPageView,
  identifyUser,
  resetUser,
  AnalyticsEvent,
} from "@/lib/analytics";

import {
  trackAppView,
  trackLogin,
  trackSubscriptionSuccess,
  // ... other helpers
} from "@/lib/analytics-examples";

// Track custom event
trackEvent(AnalyticsEvent.APP_VIEW, { app_id: "123" });

// Identify user
identifyUser(userId, { email, name, role: "user" });

// Reset on logout
resetUser();

// Use helper functions
trackAppView(appId, appName);
trackLogin(userId, email, "google");
```

---

Happy tracking! 🎉
