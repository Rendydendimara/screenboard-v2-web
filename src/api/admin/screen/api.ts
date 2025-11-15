import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TScreenPost, TScreenPostBulk, TScreenPut, TScreenUpdateOrderPayload } from "./type";

const create = async (payload: TScreenPost) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  formData.append("image", payload.image);
  formData.append("app", payload.app);
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("modul", payload.modul);

  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.SCREEN.V1.CREATE,
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
    `${URL_API.ADMIN.SCREEN.V1.GET_LIST}${search}`
  );
  return response.data;
};

const update = async (payload: TScreenPut) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  formData.append("screenId", payload.screenId);
  formData.append("image", payload.image);
  formData.append("app", payload.app);
  formData.append("name", payload.name);
  formData.append("category", payload.category);
  formData.append("description", payload.description);
  formData.append("modul", payload.modul);

  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.SCREEN.V1.UPDATE,
    formData,
    config
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `${URL_API.ADMIN.SCREEN.V1.DELETE}/${id}`
  );
  return response.data;
};

const bulkUpload = async (payload: TScreenPostBulk) => {
  let formData = new FormData();
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  payload.screens?.forEach((img) => {
    formData.append("screens", img);
  });

  formData.append("app", payload.app);
  formData.append("category", payload.category);
  formData.append("modul", payload.modul);

  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.SCREEN.V1.BULK_UPLOAD,
    formData,
    config
  );
  return response.data;
};

const updateOrder = async (payload: TScreenUpdateOrderPayload) => {
  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.SCREEN.V1.UPDATE_ORDER,
    payload
  );
  return response.data;
};

const ScreenAPI = {
  create,
  getAll,
  update,
  remove,
  bulkUpload,
  updateOrder,
};

export default ScreenAPI;
