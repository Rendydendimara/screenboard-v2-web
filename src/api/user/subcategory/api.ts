import { axiosInstanceNoAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";

const getAll = async () => {
  const response = await axiosInstanceNoAuth.get(
    URL_API.ADMIN.SUBCATEGORY.V1.GET_LIST
  );
  return response.data;
};

const SubcategoryAPI = {
  getAll,
};

export default SubcategoryAPI;
