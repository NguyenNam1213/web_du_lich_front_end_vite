import { Activity } from "./activity";
import { ActivitySchedule } from "./activitySchedule";
import { Payment } from "./payment";
import { Review } from "./review";
import { Supplier } from "./supplier";
import { User } from "./user";

export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

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

  subtotal: number;
  discount: number;
  total: number;
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