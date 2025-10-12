import { axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TPayloadAppLike } from "./type";

const like = async (payload: TPayloadAppLike) => {
  const response = await axiosInstanceWithAuth.post(
    URL_API.USER.APP_LIKE.V1.LIKE,
    payload
  );
  return response.data;
};

const dislike = async (payload: TPayloadAppLike) => {
  const response = await axiosInstanceWithAuth.post(
    URL_API.USER.APP_LIKE.V1.DISLIKE,
    payload
  );
  return response.data;
};

const AppLikeAPI = {
  like,
  dislike,
};

export default AppLikeAPI;
