export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  accessToken: string;
}

export interface IRegisterRequest {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}
