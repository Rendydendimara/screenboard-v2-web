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
  },
  USER: {
    APP: {
      V1: {
        DETAIL: "/api/v1/user/app/detail",
        GET_LIST: "/api/v1/user/app/get-list",
      },
    },
    SCREEN: {
      V1: {
        GET_LIST: "/api/v1/user/screen/get-list",
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
  },
};

export default URL_API;
