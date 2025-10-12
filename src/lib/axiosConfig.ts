import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { logout } from "../provider/slices/authSlice";
import { store } from "../provider/store";

// Function to retrieve the current token from the Redux store
const getToken = () => localStorage.getItem("token");
// Create a configured Axios instance
const createAxiosInstanceWithAuth = (): AxiosInstance => {
  const token = getToken();

  // Initial Axios configuration using environment variable
  const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable
    headers: {},
  };

  if (token) {
    config.headers!["screenboard-token"] = token;
  }

  // Create the Axios instance with the initial configuration
  const instance = axios.create(config);

  // Request interceptor to attach the token to every request if available
  instance.interceptors.request.use(
    (config: any) => {
      const currentToken = getToken();
      if (currentToken) {
        config.headers = {
          ...config.headers,
          "screenboard-token": currentToken,
        };
      } else {
        delete config.headers?.["screenboard-token"];
      }
      return config;
    },
    (error: AxiosError) => {
      // Handle request error
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle global errors (e.g., Unauthorized)
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        // If unauthorized, dispatch logout action
        store.dispatch(logout());
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create a configured Axios instance
const createAxiosInstanceNoAuth = (): AxiosInstance => {
  // Initial Axios configuration using environment variable
  const config: AxiosRequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL, // Use environment variable
    headers: {},
  };

  // Create the Axios instance with the initial configuration
  const instance = axios.create(config);

  // Response interceptor to handle global errors (e.g., Unauthorized)
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        // If unauthorized, dispatch logout action
        store.dispatch(logout());
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export the configured Axios instance
const axiosInstanceWithAuth = createAxiosInstanceWithAuth();
const axiosInstanceNoAuth = createAxiosInstanceNoAuth();

export { axiosInstanceNoAuth, axiosInstanceWithAuth };
