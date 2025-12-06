import { CreateReviewDto, Review, UpdateReviewDto } from "../types/review";
import api from "./auth";

export const getReviewByActivity = async (activityId: number): Promise<Review[]> => {
    const res = await api.get(`/reviews/activity/${activityId}`)
    return res.data;
};

export const getReviewByBooking = async (bookingId: number): Promise<Review[]> => {
    const res = await api.get(`/reviews/booking/${bookingId}`);
    return res.data;
}

export const createReview = async (data: CreateReviewDto): Promise<Review> => {
    const res = await api.post('/reviews', data);
    return res.data;
};

export const updateReview = async (
  id: number,
  data: UpdateReviewDto
): Promise<Review> => {
  const res = await api.patch(`/reviews/${id}`, data);
  return res.data;
};

export const deleteReview = async (id: number): Promise<Review> => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};