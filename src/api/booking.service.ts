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
  // 🔹 Lấy danh sách booking của supplier
  getAll(): Promise<AxiosResponse<Booking[]>> {
    return instance.get(BASE_URL);
  },

  // 🔹 Lấy chi tiết 1 booking
  getById(id: number): Promise<AxiosResponse<Booking>> {
    return instance.get(`${BASE_URL}/${id}`);
  },

  // 🔹 Cập nhật trạng thái booking
  updateStatus(id: number, data: UpdateBookingStatusDto): Promise<AxiosResponse<Booking>> {
    return instance.patch(`${BASE_URL}/${id}/status`, data);
  },

  // 🔹 Xóa booking
  delete(id: number): Promise<AxiosResponse<{ message: string }>> {
    return instance.delete(`${BASE_URL}/${id}`);
  },

  // USER
  // 🔹 Tạo booking mới(user)
  createBooking: async(payload: BookingCreateDto) =>  {
    return api.post(BASE_URL, payload);
  },

  getMyBooking: async() => {
    return api.get(`${BASE_URL}/my-booking`);
  }
};