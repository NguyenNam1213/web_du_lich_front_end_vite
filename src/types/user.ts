import { Booking } from "./booking";
import { Review } from "./review";
import { SearchHistory } from "./searchHistory";
import { Supplier } from "./supplier";
import { UserBehavior } from "./userBehavior";
import { Wishlist } from "./wishlist";

type UserStatus = "active" | "inactive" | "banned";

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: UserStatus;
  createdAt: string; // ISO date string
  updatedAt: string;

  supplierProfile?: Supplier;
  bookings?: Booking[];
  reviews?: Review[];
  wishlists?: Wishlist[];
  searchHistory?: SearchHistory[];
  userBehaviors?: UserBehavior[];
  notifications?: Notification[];
}