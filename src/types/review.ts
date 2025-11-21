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
    lastName?: string;
    avatar?: string | null;
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
