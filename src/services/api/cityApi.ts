import axios from "axios";
import { API_URL } from "../api-config";
import { City } from "../../layouts/admin/types/city.type";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCities = async (): Promise<City[]> => {
  const response = await api.get<City[]>("/cities");
  return response.data;
};

export const getCity = async (id: string): Promise<City> => {
  const response = await api.get<City>(`/cities/${id}`);
  return response.data;
};

export const createCity = async (cityData: Partial<City>): Promise<City> => {
  const response = await api.post<City>("/cities", cityData);
  return response.data;
};

export const updateCity = async (
  id: string,
  cityData: Partial<City>
): Promise<City> => {
  const response = await api.patch<City>(`/cities/${id}`, cityData);
  return response.data;
};

export const deleteCity = async (id: string): Promise<void> => {
  await api.delete(`/cities/${id}`);
};


