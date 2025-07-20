import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TSubcategory, TSubcategoryPut } from "./type";

const create = async (payload: TSubcategory) => {
  const response = await axiosInstanceWithAuth.post(
    URL_API.ADMIN.SUBCATEGORY.V1.CREATE,
    payload
  );
  return response.data;
};

const getAll = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.ADMIN.SUBCATEGORY.V1.GET_LIST
  );
  return response.data;
};

const update = async (payload: TSubcategoryPut) => {
  const response = await axiosInstanceWithAuth.put(
    URL_API.ADMIN.SUBCATEGORY.V1.UPDATE,
    payload
  );
  return response.data;
};

const remove = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `${URL_API.ADMIN.SUBCATEGORY.V1.DELETE}/${id}`
  );
  return response.data;
};

const SubcategoryAPI = {
  create,
  getAll,
  update,
  remove,
};

export default SubcategoryAPI;
