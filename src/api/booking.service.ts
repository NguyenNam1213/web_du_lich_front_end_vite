import { Booking } from "../types/booking";
import instance from "./api";

export const BookingService = {
  async getAll(): Promise<Booking[]> {
    const res = await instance.get("/bookings");
    return res.data;
  },

  async getById(id: number): Promise<Booking> {
    const res = await instance.get(`/bookings/${id}`);
    return res.data;
  },

  async create(data: Partial<Booking>): Promise<Booking> {
    const res = await instance.post("/bookings", data);
    return res.data;
  },

  async update(id: number, data: Partial<Booking>): Promise<Booking> {
    const res = await instance.put(`/bookings/${id}`, data);
    return res.data;
  },

  async cancel(id: number): Promise<void> {
    await instance.patch(`/bookings/${id}/cancel`);
  },
};
