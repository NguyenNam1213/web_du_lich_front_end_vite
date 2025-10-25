import { Activity } from "./activity";
import { Booking } from "./booking";
import { CartItem } from "./cartItem";

export interface ActivitySchedule {
  id: number;
  activityId: number;
  date: string; // ISO date
  timeSlot?: string; // e.g. "09:00"
  availableSpots: number;
  bookedSpots: number;
  price?: number;
  createdAt: string;
  activity?: Activity;
  bookings?: Booking[];
  cartItems?: CartItem[];
}