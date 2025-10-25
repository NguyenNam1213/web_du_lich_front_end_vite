import { User } from "../types/user";
import instance from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const AuthService = {
  async login(data: LoginPayload): Promise<{ user: User; access_token: string }> {
    const res = await instance.post("/auth/login", data);
    return res.data;
  },

  async register(data: RegisterPayload): Promise<User> {
    const res = await instance.post("/auth/register", data);
    return res.data;
  },

  async getProfile(): Promise<User> {
    const res = await instance.get("/auth/profile");
    return res.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
};
