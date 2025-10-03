import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TAppPost, TAppPut } from "./type";

const create = async (payload: TAppPost) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  payload.screenshots?.forEach((img) => {
    formData.append("screenshots", img);
  });

  if (payload.icon) {
    formData.append("icon", payload.icon);
  }

  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("subcategory", payload.subcategory);
  formData.append("platform", payload.platform);
  formData.append("iconUrl", payload.iconUrl);
  formData.append("description", payload.description);
  formData.append("downloads", payload.downloads);
  formData.append("rating", payload.rating.toString());
  formData.append("tags", JSON.stringify(payload.tags));
  formData.append("color", payload.color);
  formData.append("company", payload.company);

  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.APP.V1.CREATE,
    formData,
    config
  );
  return response.data;
};

const getAll = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.ADMIN.APP.V1.GET_LIST
  );
  return response.data;
};

const getDetail = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(
    `${URL_API.ADMIN.APP.V1.DETAIL}/${id}`
  );
  return response.data;
};

const update = async (payload: TAppPut) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  payload.screenshots?.forEach((img) => {
    formData.append("screenshots", img);
  });

  if (payload.icon) {
    formData.append("icon", payload.icon);
  }

  formData.append("appId", payload.appId);
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("subcategory", payload.subcategory);
  formData.append("platform", payload.platform);
  formData.append("iconUrl", payload.iconUrl);
  formData.append("description", payload.description);
  formData.append("downloads", payload.downloads);
  formData.append("rating", payload.rating.toString());
  formData.append("tags", JSON.stringify(payload.tags));
  formData.append("color", payload.color);
  formData.append("company", payload.company);
  formData.append("oldScreenshot", JSON.stringify(payload.oldScreenshot));
  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.APP.V1.UPDATE,
    formData,
    config
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `${URL_API.ADMIN.APP.V1.DELETE}/${id}`
  );
  return response.data;
};

const AppAPI = {
  create,
  getAll,
  getDetail,
  update,
  remove,
};

export default AppAPI;
