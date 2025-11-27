const URL_API = {
  ADMIN: {
    AUTH: {
      V1: {
        LOGIN: "/api/v1/admin/auth/login",
        LOGOUT: "/api/v1/admin/auth/logout",
        CHECK_LOGIN: "/api/v1/admin/auth/check-login",
      },
    },
    MODUL: {
      V1: {
        CREATE: "/api/v1/admin/modul/create",
        UPDATE: "/api/v1/admin/modul/update",
        GET_LIST: "/api/v1/admin/modul/get-list",
        DELETE: "/api/v1/admin/modul/delete",
      },
    },
    APP: {
      V1: {
        CREATE: "/api/v1/admin/app/create",
        DETAIL: "/api/v1/admin/app/detail",
        UPDATE: "/api/v1/admin/app/update",
        GET_LIST: "/api/v1/admin/app/get-list",
        DELETE: "/api/v1/admin/app/delete",
      },
    },
    SCREEN: {
      V1: {
        CREATE: "/api/v1/admin/screen/create",
        UPDATE: "/api/v1/admin/screen/update",
        UPDATE_ORDER: "/api/v1/admin/screen/update-order",
        GET_LIST: "/api/v1/admin/screen/get-list",
        DELETE: "/api/v1/admin/screen/delete",
        BULK_UPLOAD: "/api/v1/admin/screen/bulk-upload",
      },
    },
    CATEGORY: {
      V1: {
        CREATE: "/api/v1/admin/category/create",
        UPDATE: "/api/v1/admin/category/update",
        GET_LIST: "/api/v1/admin/category/get-list",
        DELETE: "/api/v1/admin/category/delete",
      },
    },
    SUBCATEGORY: {
      V1: {
        CREATE: "/api/v1/admin/subcategory/create",
        UPDATE: "/api/v1/admin/subcategory/update",
        GET_LIST: "/api/v1/admin/subcategory/get-list",
        DELETE: "/api/v1/admin/subcategory/delete",
      },
    },
    SCREEN_CATEGORY: {
      V1: {
        CREATE: "/api/v1/admin/screen-category/create",
        UPDATE: "/api/v1/admin/screen-category/update",
        GET_LIST: "/api/v1/admin/screen-category/get-list",
        DELETE: "/api/v1/admin/screen-category/delete",
      },
    },
    COMPONENT: {
      V1: {
        CREATE: "/api/v1/admin/component/create",
        UPDATE: "/api/v1/admin/component/update",
        GET_LIST: "/api/v1/admin/component/get-list",
        DELETE: "/api/v1/admin/component/delete",
      },
    },
    PLANS: {
      V1: {
        CREATE: "/api/v1/admin/plans/create",
        UPDATE: "/api/v1/admin/plans/update",
        GET_LIST: "/api/v1/admin/plans/get-list",
        DELETE: "/api/v1/admin/plans/delete",
        DETAIL: "/api/v1/admin/plans/detail",
      },
    },
    GLOBAL_COMPONENT: {
      V1: {
        CREATE: "/api/v1/admin/global-component/create",
        UPDATE: "/api/v1/admin/global-component/update",
        GET_LIST: "/api/v1/admin/global-component/get-list",
        DELETE: "/api/v1/admin/global-component/delete",
        DETAIL: "/api/v1/admin/global-component/detail",
      },
    },
  },
  USER: {
    APP: {
      V1: {
        DETAIL: "/api/v1/user/app/detail",
        GET_LIST: "/api/v1/user/app/get-list",
        GET_LIST_FAVORITES: "/api/v1/user/app/get-list-favorites",
      },
    },
    SCREEN: {
      V1: {
        GET_LIST: "/api/v1/user/screen/get-list",
        DOWNLOAD: "/api/v1/user/screen/download",
      },
    },
    CATEGORY: {
      V1: {
        GET_LIST: "/api/v1/user/category/get-list",
      },
    },
    SUBCATEGORY: {
      V1: {
        GET_LIST: "/api/v1/user/subcategory/get-list",
      },
    },
    MODUL: {
      V1: {
        GET_LIST: "/api/v1/user/modul/get-list",
      },
    },
    AUTH: {
      V1: {
        LOGIN: "/api/v1/user/auth/login",
        REGISTER: "/api/v1/user/auth/register",
        LOGOUT: "/api/v1/user/auth/logout",
        CHECK_LOGIN: "/api/v1/user/auth/check-login",
        LOGIN_GOOGLE: "/api/v1/user/auth/google-login",
        SIGNUP_GOOGLE: "/api/v1/user/auth/google-signup",
      },
    },
    APP_LIKE: {
      V1: {
        LIKE: "/api/v1/user/app-like/like",
        DISLIKE: "/api/v1/user/app-like/dislike",
      },
    },
    SUBSCRIPTION: {
      V1: {
        GET_PLANS: "/api/v1/user/subscription/plans",
        CREATE_CHECKOUT: "/api/v1/user/subscription/checkout",
        GET_CURRENT: "/api/v1/user/subscription/current",
        CANCEL: "/api/v1/user/subscription/cancel",
        REACTIVATE: "/api/v1/user/subscription/reactivate",
        GET_PAYMENT_HISTORY: "/api/v1/user/subscription/payment-history",
        CREATE_BILLING_PORTAL: "/api/v1/user/subscription/billing-portal",
        CHECK_STATUS: "/api/v1/user/subscription/status",
        VERIFY_SESSION: "/api/v1/user/subscription/verify-session",
      },
    },
  },
};

export default URL_API;
