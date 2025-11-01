import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.USER.APP.V1.GET_LIST
  );
  return response.data;
};

const getDetail = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(
    `${URL_API.USER.APP.V1.DETAIL}/${id}`
  );
  return response.data;
};

const getListFavorites = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.USER.APP.V1.GET_LIST_FAVORITES
  );
  return response.data;
};

const UserAppAPI = {
  getAll,
  getDetail,
  getListFavorites,
};

export default UserAppAPI;
