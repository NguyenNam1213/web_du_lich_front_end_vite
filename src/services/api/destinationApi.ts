import axios from "axios";
import { API_URL } from "../api-config";
import { Destination } from "../../layouts/admin/types/destination.type";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDestinations = async (): Promise<Destination[]> => {
  const response = await api.get<Destination[]>("/destinations");
  return response.data;
};

export const getDestination = async (id: string): Promise<Destination> => {
  const response = await api.get<Destination>(`/destinations/${id}`);
  return response.data;
};

export const createDestination = async (
  destinationData: Partial<Destination>
): Promise<Destination> => {
  const response = await api.post<Destination>("/destinations", destinationData);
  return response.data;
};

export const updateDestination = async (
  id: string,
  destinationData: Partial<Destination>
): Promise<Destination> => {
  const response = await api.patch<Destination>(
    `/destinations/${id}`,
    destinationData
  );
  return response.data;
};

export const deleteDestination = async (id: string): Promise<void> => {
  await api.delete(`/destinations/${id}`);
};


