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

const trackView = async (appId: string) => {
  const response = await axiosInstanceWithAuth.post(
    `${URL_API.USER.APP.V1.TRACK_VIEW}/${appId}`
  );
  return response.data;
};

const getTop10Month = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.USER.APP.V1.TOP10_MONTH
  );
  return response.data;
};

const UserAppAPI = {
  getAll,
  getDetail,
  getListFavorites,
  trackView,
  getTop10Month,
};

export default UserAppAPI;
