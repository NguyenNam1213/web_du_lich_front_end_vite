import axios from "axios";
import { API_URL } from "../api-config";
import { User } from "../../layouts/admin/types/user.type";

interface PaginatedUsers {
  users: User[];
  totalPages: number;
  currentPage: number;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedUsers> => {
  const response = await api.get<PaginatedUsers>(
    `/users/admin?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await api.post<User>("/users/admin", userData);
  return response.data;
};

export const updateUser = async (
  id: string,
  userData: Partial<User>
): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
