export interface Review {
  id: number;
  bookingId: number;
  activityId: number;
  userId: number;
  rating: number;
  comment?: string;
  images?: any[];
  createdAt: string;

  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string | null;
  };
  activity?: {
    id: number;
    name: string;
    slug: string;
  };
  booking?: {
    id: number;
    bookingRef: string;
  };
}

export interface CreateReviewDto {
  bookingId: number;
  activityId: number;
  rating: number;
  comment?: string;
  images?: any[];
}

export interface UpdateReviewDto {
  bookingId?: number;
  activityId?: number;
  rating?: number;
  comment?: string;
  images?: any[];
}
