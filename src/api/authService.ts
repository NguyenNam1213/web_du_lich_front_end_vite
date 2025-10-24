import instance from "./api";
import { LoginResponse } from "../types/login/LoginReponse";
import { LoginPayload } from "../types/login/LoginRequest";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await instance.post<LoginResponse>("/login", payload);
  return res.data;
};