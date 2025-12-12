import { AxiosResponse } from "axios";
import { Booking, BookingCreateDto } from "../types/booking";
import instance from "./api";
import api from "./auth";

export interface UpdateBookingStatusDto {
  status?: string;
  paymentStatus?: string;
}

const BASE_URL = "/supplier/bookings";

export const BookingService = {
  // ===========================
  // SUPPLIER (instance)
  // ===========================
  getAll(): Promise<AxiosResponse<Booking[]>> {
    return instance.get(BASE_URL);
  },
  
  getById(id: number): Promise<AxiosResponse<Booking>> {
    return instance.get(`${BASE_URL}/${id}`);
  },

  updateStatus(id: number, data: UpdateBookingStatusDto) {
    return instance.patch(`${BASE_URL}/${id}/status`, data);
  },

  delete(id: number) {
    return instance.delete(`${BASE_URL}/${id}`);
  },

  // ===========================
  // USER (api)
  // ===========================
  createBooking(payload: BookingCreateDto) {
    return instance.post(BASE_URL, payload);

  },

  getMyBooking() {
    return api.get(`${BASE_URL}/my-booking`);
  },
};
