import { axiosInstanceNoAuth, axiosInstanceWithAuth } from "@/lib/axiosConfig";
import URL_API from "../../urls";
import { TGoogleAuth, TLogin, TRegister } from "./type";

const login = async (payload: TLogin) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.USER.AUTH.V1.LOGIN,
    payload
  );
  return response.data;
};

const checkIsLogin = async (token: string) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.USER.AUTH.V1.CHECK_LOGIN,
    {
      token,
    }
  );
  return response.data;
};

const logout = async () => {
  const response = await axiosInstanceWithAuth.get(URL_API.USER.AUTH.V1.LOGOUT);
  return response.data;
};

const register = async (payload: TRegister) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.USER.AUTH.V1.REGISTER,
    payload
  );
  return response.data;
};

const googleLogin = async (payload: TGoogleAuth) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.USER.AUTH.V1.LOGIN_GOOGLE,
    payload
  );
  return response.data;
};

const googleSignup = async (payload: TGoogleAuth) => {
  const response = await axiosInstanceNoAuth.post(
    URL_API.USER.AUTH.V1.SIGNUP_GOOGLE,
    payload
  );
  return response.data;
};

const UserAuthAPI = {
  login,
  checkIsLogin,
  logout,
  register,
  googleLogin,
  googleSignup,
};

export default UserAuthAPI;
