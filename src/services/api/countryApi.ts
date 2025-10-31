import axios from "axios";
import { API_URL } from "../api-config";
import { Country } from "../../layouts/admin/types/country.type";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<Country[]>("/countries");
  return response.data;
};

export const getCountry = async (code: string): Promise<Country> => {
  const response = await api.get<Country>(`/countries/${code}`);
  return response.data;
};

export const createCountry = async (
  countryData: Partial<Country>
): Promise<Country> => {
  const response = await api.post<Country>("/countries", countryData);
  return response.data;
};

export const updateCountry = async (
  code: string,
  countryData: Partial<Country>
): Promise<Country> => {
  const response = await api.patch<Country>(`/countries/${code}`, countryData);
  return response.data;
};

export const deleteCountry = async (code: string): Promise<void> => {
  await api.delete(`/countries/${code}`);
};


