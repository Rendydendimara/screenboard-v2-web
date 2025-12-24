// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Google Analytics (only in production, or in dev if explicitly enabled)
let analytics: Analytics | null = null;
const isProduction = import.meta.env.MODE === "production";
const isDevelopment = import.meta.env.MODE === "development";
const enableAnalyticsInDev =
  import.meta.env.VITE_ENABLE_ANALYTICS_IN_DEV === "true";

const shouldInitialize =
  isProduction || (isDevelopment && enableAnalyticsInDev);

if (typeof window !== "undefined" && shouldInitialize) {
  analytics = getAnalytics(app);
}
export { analytics };
