export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  activityId: string;
  rating: number;
  comment: string;
  images: string[] | null;
  createdAt: string;
}