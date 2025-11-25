import { Activity } from "./activity";
import { ActivitySchedule } from "./activitySchedule";
import { Payment } from "./payment";
import { Review } from "./review";
import { Supplier } from "./supplier";
import { User } from "./user";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Booking {
  id: number;
  bookingRef: string;
  userId: number;
  activityId: number;
  scheduleId: number;
  supplierId: number;

  customerName: string;
  customerEmail: string;
  customerPhone?: string;

  bookingDate: string;
  participants: number;

  subtotal: string | number;
  discount: string | number;
  total: string | number;
  currency: string;

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;

  user?: User;
  activity?: Activity;
  schedule?: ActivitySchedule;
  supplier?: Supplier;
  payments?: Payment[];
  reviews?: Review[];
}

export interface BookingCreateDto {
  activityId: number;
  supplierId: number;
  scheduleId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  participants: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}