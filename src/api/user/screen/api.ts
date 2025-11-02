import { axiosInstanceNoAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async (data?: { app: string }) => {
  let search = "";
  if (data && data.app) {
    search = `?app=${data.app}`;
  }

  const response = await axiosInstanceNoAuth.get(
    `${URL_API.USER.SCREEN.V1.GET_LIST}${search}`
  );
  return response.data;
};

const download = async (filter: { category?: string; app?: string }) => {
  try {
    console.log("=== Frontend Download Started ===");
    console.log("Filter:", filter);

    const params = new URLSearchParams();
    if (filter.category) params.append("category", filter.category);
    if (filter.app) params.append("app", filter.app);

    // Add timestamp to prevent caching
    params.append("_t", Date.now().toString());

    // Get token from localStorage for authenticated downloads
    const token = localStorage.getItem("screenboard-token");
    const headers: any = {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    if (token) {
      headers["screenboard-token"] = token;
    }

    const requestUrl = `${URL_API.USER.SCREEN.V1.DOWNLOAD}?${params.toString()}`;
    console.log("Request URL:", requestUrl);

    const response = await axiosInstanceNoAuth.get(requestUrl, {
      headers,
      responseType: 'blob', // Important for binary data
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const blob = new Blob([response.data], { type: 'application/zip' });
    console.log("Blob size:", blob.size, "bytes");
    console.log("Blob type:", blob.type);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Create better filename based on filter
    let filename = "screens";
    if (filter.category) filename += `_category`;
    if (filter.app) filename += `_app`;
    filename += ".zip";

    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("Download completed successfully");
    return { success: true };
  } catch (error: any) {
    console.error("Download error:", error);
    console.error("Error response:", error.response);
    throw error;
  }
};

const ScreenAPI = {
  getAll,
  download,
};

export default ScreenAPI;
