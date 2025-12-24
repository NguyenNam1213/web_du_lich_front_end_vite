import axios from "axios";
import { API_URL } from "../api-config";
import { Booking, FilterBookingDto, UpdateBookingStatusDto } from "../../layouts/admin/types/booking.type";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getBookings = async (filters?: FilterBookingDto): Promise<Booking[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.paymentStatus) params.append("paymentStatus", filters.paymentStatus);
  if (filters?.activityId) params.append("activityId", filters.activityId.toString());
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.append("dateTo", filters.dateTo);
  if (filters?.search) params.append("search", filters.search);

  const queryString = params.toString();
  const url = `/admin/bookings${queryString ? `?${queryString}` : ""}`;
  const response = await api.get<Booking[]>(url);
  return response.data;
};

export const getBooking = async (id: string): Promise<Booking> => {
  const response = await api.get<Booking>(`/admin/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (
  id: string,
  data: UpdateBookingStatusDto
): Promise<Booking> => {
  const response = await api.patch<Booking>(`/admin/bookings/${id}/status`, data);
  return response.data;
};

export const deleteBooking = async (id: string): Promise<void> => {
  await api.delete(`/admin/bookings/${id}`);
};

