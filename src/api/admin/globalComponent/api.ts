import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TGlobalComponentPost, TGlobalComponentPut } from "./type";

const create = async (payload: TGlobalComponentPost) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  payload.screenshots?.forEach((img) => {
    formData.append("screenshots", img);
  });

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("link", payload.link);
  formData.append("tags", JSON.stringify(payload.tags));

  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.GLOBAL_COMPONENT.V1.CREATE,
    formData,
    config
  );
  return response.data;
};

const getAll = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.ADMIN.GLOBAL_COMPONENT.V1.GET_LIST
  );
  return response.data;
};

const getDetail = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(
    `${URL_API.ADMIN.GLOBAL_COMPONENT.V1.DETAIL}/${id}`
  );
  return response.data;
};

const update = async (payload: TGlobalComponentPut) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  payload.screenshots?.forEach((img) => {
    formData.append("screenshots", img);
  });

  formData.append("globalComponentId", payload.globalComponentId);
  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("link", payload.link);
  formData.append("tags", JSON.stringify(payload.tags));
  formData.append("oldScreenshots", JSON.stringify(payload.oldScreenshots));

  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.GLOBAL_COMPONENT.V1.UPDATE,
    formData,
    config
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `${URL_API.ADMIN.GLOBAL_COMPONENT.V1.DELETE}/${id}`
  );
  return response.data;
};

const GlobalComponentAPI = {
  create,
  getAll,
  getDetail,
  update,
  remove,
};

export default GlobalComponentAPI;
