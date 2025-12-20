interface Screen {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

interface App {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  platform: "iOS" | "Android" | "Both";
  image: string;
  screenshots: string[];
  screens: Screen[];
  description: string;
  downloads: string;
  rating: number;
  tags: string[];
  color: string;
  isLiked: boolean;
  featured: boolean;
  trending: boolean;
  company: string;
  lastUpdated: string;
}

// UX patterns and their related keywords
const UX_PATTERNS = {
  onboarding: [
    "welcome",
    "tutorial",
    "getting started",
    "first time",
    "intro",
    "setup",
    "walkthrough",
  ],
  "empty state": [
    "no content",
    "no data",
    "empty",
    "placeholder",
    "no results",
    "nothing here",
  ],
  "error state": [
    "error",
    "failed",
    "something went wrong",
    "try again",
    "oops",
    "404",
  ],
  "loading state": ["loading", "spinner", "skeleton", "progress", "buffering"],
  checkout: [
    "payment",
    "billing",
    "cart",
    "purchase",
    "order",
    "buy now",
    "checkout",
  ],
  signup: ["register", "create account", "sign up", "join", "get started"],
  login: ["sign in", "log in", "authentication", "auth"],
  profile: ["account", "settings", "preferences", "user profile"],
  search: ["find", "lookup", "filter", "discover"],
  navigation: ["menu", "nav", "tabs", "sidebar", "drawer"],
  feed: ["timeline", "activity", "news", "updates", "stream"],
  notifications: ["alerts", "push", "messages", "updates"],
  referral: ["invite", "share", "refer friends", "rewards"],
  dashboard: ["overview", "analytics", "stats", "metrics", "home"],
  settings: ["preferences", "configuration", "options", "account"],
  chat: ["messaging", "conversation", "dm", "direct message"],
  gallery: ["photos", "images", "media", "album"],
  map: ["location", "gps", "directions", "nearby"],
  calendar: ["schedule", "events", "dates", "appointments"],
  form: ["input", "submit", "fields", "validation"],
};

// Industry/problem patterns
const INDUSTRY_PATTERNS = {
  b2b: ["business", "enterprise", "corporate", "team", "collaboration"],
  fintech: ["finance", "banking", "payment", "money", "crypto", "wallet"],
  ecommerce: ["shopping", "store", "marketplace", "retail", "products"],
  health: ["medical", "fitness", "wellness", "healthcare", "doctor"],
  education: ["learning", "course", "study", "school", "training"],
  social: ["community", "friends", "sharing", "social network"],
  productivity: ["task", "project", "work", "organization", "notes"],
  travel: ["booking", "hotel", "flight", "trip", "vacation"],
  food: ["restaurant", "delivery", "recipe", "cooking", "dining"],
  entertainment: ["gaming", "music", "video", "streaming", "media"],
  news: ["articles", "journalism", "breaking news", "current events"],
  dating: ["match", "relationship", "romance", "dating"],
  "real estate": ["property", "house", "apartment", "rent", "buy"],
  transportation: ["uber", "taxi", "ride", "transport", "mobility"],
};

// Platform patterns
const PLATFORM_PATTERNS = {
  ios: ["iphone", "ipad", "apple", "ios"],
  android: ["google", "android", "material design"],
  web: ["website", "browser", "responsive", "desktop"],
  pwa: ["progressive web app", "offline", "installable"],
};

export const performEnhancedSearch = (apps: App[], searchTerm: string) => {
  if (!searchTerm.trim()) return apps;

  const term = searchTerm.toLowerCase();

  return apps.filter((app) => {
    // Basic text matching
    const basicMatch =
      app.name.toLowerCase().includes(term) ||
      app.description.toLowerCase().includes(term) ||
      app.category.toLowerCase().includes(term) ||
      app.subcategory.toLowerCase().includes(term) ||
      app.company.toLowerCase().includes(term) ||
      app.tags.some((tag) => tag.toLowerCase().includes(term));

    // Screen content matching
    const screenMatch = app.screens.some(
      (screen) =>
        screen.name.toLowerCase().includes(term) ||
        screen.description.toLowerCase().includes(term) ||
        screen.category.toLowerCase().includes(term)
    );

    // UX Pattern matching
    const uxPatternMatch = Object.entries(UX_PATTERNS).some(
      ([pattern, keywords]) => {
        const patternMatch =
          term.includes(pattern) ||
          keywords.some((keyword) => term.includes(keyword));
        if (patternMatch) {
          return (
            app.screens.some((screen) =>
              keywords.some(
                (keyword) =>
                  screen.name.toLowerCase().includes(keyword) ||
                  screen.description.toLowerCase().includes(keyword) ||
                  screen.category.toLowerCase().includes(keyword)
              )
            ) ||
            keywords.some(
              (keyword) =>
                app.description.toLowerCase().includes(keyword) ||
                app.tags.some((tag) => tag.toLowerCase().includes(keyword))
            )
          );
        }
        return false;
      }
    );

    // Industry/Problem matching
    const industryMatch = Object.entries(INDUSTRY_PATTERNS).some(
      ([industry, keywords]) => {
        const industryTermMatch =
          term.includes(industry) ||
          keywords.some((keyword) => term.includes(keyword));
        if (industryTermMatch) {
          return keywords.some(
            (keyword) =>
              app.description.toLowerCase().includes(keyword) ||
              app.category.toLowerCase().includes(keyword) ||
              app.subcategory.toLowerCase().includes(keyword) ||
              app.tags.some((tag) => tag.toLowerCase().includes(keyword))
          );
        }
        return false;
      }
    );

    // Platform matching
    const platformMatch = Object.entries(PLATFORM_PATTERNS).some(
      ([platform, keywords]) => {
        const platformTermMatch =
          term.includes(platform) ||
          keywords.some((keyword) => term.includes(keyword));
        if (platformTermMatch) {
          return (
            app.platform.toLowerCase().includes(platform) ||
            keywords.some(
              (keyword) =>
                app.description.toLowerCase().includes(keyword) ||
                app.tags.some((tag) => tag.toLowerCase().includes(keyword))
            )
          );
        }
        return false;
      }
    );

    // Semantic search for specific questions
    const semanticMatch = detectSemanticQueries(term, app);

    return (
      basicMatch ||
      screenMatch ||
      uxPatternMatch ||
      industryMatch ||
      platformMatch ||
      semanticMatch
    );
  });
};

const detectSemanticQueries = (term: string, app: App): boolean => {
  // Handle "how does X handle Y" queries
  const howDoesPattern = /how does (.+?) handle (.+)/i;
  const howDoesMatch = term.match(howDoesPattern);

  if (howDoesMatch) {
    const [, appName, feature] = howDoesMatch;
    const appNameMatch = app.name.toLowerCase().includes(appName.toLowerCase());
    const featureMatch =
      app.screens.some(
        (screen) =>
          screen.name.toLowerCase().includes(feature.toLowerCase()) ||
          screen.description.toLowerCase().includes(feature.toLowerCase()) ||
          screen.category.toLowerCase().includes(feature.toLowerCase())
      ) || app.description.toLowerCase().includes(feature.toLowerCase());

    return appNameMatch && featureMatch;
  }

  // Handle "X pattern in Y" queries
  const patternInPattern = /(.+?) (?:pattern|flow|screen) in (.+)/i;
  const patternInMatch = term.match(patternInPattern);

  if (patternInMatch) {
    const [, pattern, context] = patternInMatch;
    const patternMatch = app.screens.some(
      (screen) =>
        screen.name.toLowerCase().includes(pattern.toLowerCase()) ||
        screen.description.toLowerCase().includes(pattern.toLowerCase())
    );
    const contextMatch =
      app.name.toLowerCase().includes(context.toLowerCase()) ||
      app.category.toLowerCase().includes(context.toLowerCase());

    return patternMatch && contextMatch;
  }

  return false;
};

export const getSearchSuggestions = (searchTerm: string): string[] => {
  const term = searchTerm.toLowerCase();
  const suggestions: string[] = [];

  // UX Pattern suggestions
  Object.keys(UX_PATTERNS).forEach((pattern) => {
    if (pattern.includes(term) || term.includes(pattern)) {
      suggestions.push(`${pattern} pattern`);
    }
  });

  // Industry suggestions
  Object.keys(INDUSTRY_PATTERNS).forEach((industry) => {
    if (industry.includes(term) || term.includes(industry)) {
      suggestions.push(`${industry} apps`);
    }
  });

  // Semantic query suggestions
  if (term.includes("how")) {
    suggestions.push("how does Spotify handle onboarding?");
    suggestions.push("how does Instagram handle empty states?");
  }

  return suggestions.slice(0, 5);
};

export const getPopularSearches = (): string[] => [
  "onboarding flow",
  "empty state design",
  "checkout process",
  "b2b dashboard",
  "fintech signup",
  "social feed",
  "how does Notion handle navigation?",
  "error states in apps",
  "mobile forms",
  "crypto wallet",
];
