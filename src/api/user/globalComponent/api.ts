import { axiosInstanceNoAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async () => {
  const response = await axiosInstanceNoAuth.get(
    URL_API.USER.GLOBAL_COMPONENT.V1.GET_LIST
  );
  return response.data;
};

const getDetail = async (id: string) => {
  const response = await axiosInstanceNoAuth.get(
    `${URL_API.USER.GLOBAL_COMPONENT.V1.DETAIL}/${id}`
  );
  return response.data;
};

const GlobalComponentAPI = {
  getAll,
  getDetail,
};

export default GlobalComponentAPI;
