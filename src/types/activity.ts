import { ActivityImage } from "./activityImage";
import { ActivitySchedule } from "./activitySchedule";
import { Booking } from "./booking";
import { CartItem } from "./cartItem";
import { Category } from "./category";
import { Destination } from "./destination";
import { Review } from "./review";
import { Supplier } from "./supplier";
import { UserBehavior } from "./userBehavior";
import { Wishlist } from "./wishlist";

type ActivityStatus = "draft" | "published" | "archived";

export interface Activity {
  id: number;
  supplierId: number;
  destinationId: number;
  categoryId: number;
  name: string;
  slug: string;
  description?: string;
  highlights?: string[]; // from JSON
  duration?: number; // minutes
  price: number;
  currency: string;
  maxParticipants?: number;
  rating: number;
  reviewCount: number;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  status: ActivityStatus;
  featured: boolean;
  createdAt: string;
  updatedAt: string;

  supplier?: Supplier;
  destination?: Destination;
  category?: Category;
  images?: ActivityImage[];
  schedules?: ActivitySchedule[];
  bookings?: Booking[];
  reviews?: Review[];
  wishlists?: Wishlist[];
  cartItems?: CartItem[];
  userBehavior?: UserBehavior[];
}