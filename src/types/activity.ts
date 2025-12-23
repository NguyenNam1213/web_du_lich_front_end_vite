import { ActivityImage } from "./activityImage";
import { ActivitySchedule } from "./activitySchedule";
import { Booking } from "./booking";
import { Category } from "./category";
import { Destination } from "./destination";
import { Review } from "./review";
import { Supplier } from "./supplier";
import { Wishlist } from "./wishlist";

export interface Activity {
  id?: number;
  supplierId: number;
  destinationId: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  highlights?: string[]; // ← có thể null
  duration: number;
  price: number;
  currency: string;
  maxParticipants: number;
  rating?: string;
  reviewCount?: number;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  status: string;
  featured: boolean;

  supplier?: Supplier;
  category?: Category;
  destination?: Destination;
  images?: ActivityImage[];
  schedules?: ActivitySchedule[];
  bookings?: Booking[];
  reviews?: Review[];
  wishlists?: Wishlist[];
  _count?: {
    bookings?: number;
    reviews?: number;
    wishlists?: number;
  };
}
