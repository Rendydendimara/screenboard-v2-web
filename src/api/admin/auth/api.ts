import { axiosInstanceNoAuth, axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TLogin } from "./type";

const login = async (payload: TLogin) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.ADMIN.AUTH.V1.LOGIN,
    payload
  );
  return response.data;
};

const checkIsLogin = async (token: string) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.ADMIN.AUTH.V1.CHECK_LOGIN,
    {
      token,
    }
  );
  return response.data;
};

const logout = async () => {
  const response = await axiosInstanceWithAuth.get(
    URL_API.ADMIN.AUTH.V1.LOGOUT
  );
  return response.data;
};

const AuthAPI = {
  login,
  checkIsLogin,
  logout,
};

export default AuthAPI;
