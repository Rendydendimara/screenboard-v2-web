import { axiosInstanceNoAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async () => {
  const response = await axiosInstanceNoAuth.get(
    URL_API.USER.CATEGORY.V1.GET_LIST
  );
  return response.data;
};

const CategoryAPI = {
  getAll,
};

export default CategoryAPI;
