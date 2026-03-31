import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.USER.MODUL.V1.GET_LIST
  );
  return response.data;
};

const getDetail = async (modulId: string) => {
  const response = await axiosInstanceWithAuth.get(
    `${URL_API.USER.MODUL.V1.DETAIL}/${modulId}`
  );
  return response.data;
};

const ModulAPI = {
  getAll,
  getDetail,
};

export default ModulAPI;
