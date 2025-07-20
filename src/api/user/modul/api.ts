import { axiosInstanceNoAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async () => {
  const response = await axiosInstanceNoAuth.get(
    URL_API.USER.MODUL.V1.GET_LIST
  );
  return response.data;
};

const ModulAPI = {
  getAll,
};

export default ModulAPI;
