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

const ScreenAPI = {
  getAll,
};

export default ScreenAPI;
