import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TComponent, TComponentPut } from "./type";

const create = async (payload: TComponent) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  payload.screens?.forEach((img) => {
    formData.append("screens", img);
  });

  formData.append("notes", payload.notes);
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("appId", payload.appId);

  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.COMPONENT.V1.CREATE,
    formData,
    config
  );
  return response.data;
};

const getAll = async (data?: { app: string }) => {
  let search = "";
  if (data && data.app) {
    search = `?app=${data.app}`;
  }

  const response = await axiosInstanceWithAuth.get(
    `${URL_API.ADMIN.COMPONENT.V1.GET_LIST}${search}`
  );
  return response.data;
};

const update = async (payload: TComponentPut) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  payload.screens?.forEach((img) => {
    formData.append("screens", img);
  });

  formData.append("notes", payload.notes);
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("oldScreens", JSON.stringify(payload.oldScreens));
  formData.append("appId", payload.appId);
  formData.append("componentId", payload.componentId);

  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.COMPONENT.V1.UPDATE,
    formData,
    config
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `${URL_API.ADMIN.COMPONENT.V1.DELETE}/${id}`
  );
  return response.data;
};

const ComponentAPI = {
  create,
  getAll,
  update,
  remove,
};

export default ComponentAPI;
