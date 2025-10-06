// Login Payload Interface
export type TLogin = {
  email: string;
  password: string;
};

export type TRegister = {
  email: string;
  password: string;
  username: string;
  role: string;
};

export type TGoogleAuth = {
  idToken: string;
};
