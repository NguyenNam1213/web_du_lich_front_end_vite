import axios from "axios";
import { API_URL } from "../api-config";
import { Supplier } from "../../layouts/admin/types/supplier.type";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSuppliers = async (): Promise<Supplier[]> => {
  const response = await api.get<Supplier[]>("/suppliers");
  return response.data;
};

export const createSupplier = async (
  supplierData: Partial<Supplier>
): Promise<Supplier> => {
  const response = await api.post<Supplier>("/suppliers", supplierData);
  return response.data;
};

export const updateSupplier = async (
  id: string,
  supplierData: Partial<Supplier>
): Promise<Supplier> => {
  const response = await api.patch<Supplier>(`/suppliers/${id}`, supplierData);
  return response.data;
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await api.delete(`/suppliers/${id}`);
};

