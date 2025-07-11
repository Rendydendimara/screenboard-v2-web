import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TModul, TModulPut } from "./type";

const create = async (payload: TModul) => {
  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.MODUL.V1.CREATE,
    payload
  );
  return response.data;
};

const getAll = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.ADMIN.MODUL.V1.GET_LIST
  );
  return response.data;
};

const update = async (payload: TModulPut) => {
  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.MODUL.V1.UPDATE,
    payload
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `${URL_API.ADMIN.MODUL.V1.DELETE}/${id}`
  );
  return response.data;
};

const ModulAPI = {
  create,
  getAll,
  update,
  remove,
};

export default ModulAPI;
