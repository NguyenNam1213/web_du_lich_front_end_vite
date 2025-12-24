import { User } from "./user.type";
import { Supplier } from "./supplier.type";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface ActivitySchedule {
  id: string;
  activityId: string;
  date: string;
  timeSlot?: string | null;
  availableSpots: number;
  bookedSpots: number;
  price?: number | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  supplierId: string;
  destinationId: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  highlights?: any;
  duration?: number | null;
  price: number;
  currency: string;
  maxParticipants?: number | null;
  rating: number;
  reviewCount: number;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  status: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  destination?: {
    id: string;
    name: string;
    slug: string;
    city?: {
      id: string;
      name: string;
      country?: {
        code: string;
        name: string;
      };
    };
  };
  supplier?: Supplier;
  images?: any[];
}

export interface Payment {
  id: string;
  userId: string;
  bookingId: string;
  method: string;
  amount: number;
  currency: string;
  transactionId?: string | null;
  status: PaymentStatus;
  createdAt: string;
  deletedAt?: string | null;
}

export interface Booking {
  id: string;
  bookingRef: string;
  userId: string;
  activityId: string;
  scheduleId: string;
  supplierId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  bookingDate: string;
  participants: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  couponCode?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  user?: User;
  activity?: Activity;
  schedule?: ActivitySchedule;
  supplier?: Supplier;
  payments?: Payment[];
}

export interface FilterBookingDto {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  activityId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface UpdateBookingStatusDto {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export interface BookingState {
  bookings: Booking[];
  currentPage: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  filters: FilterBookingDto;
}

