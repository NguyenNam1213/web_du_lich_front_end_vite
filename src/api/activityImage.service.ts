import { ActivityImage } from "../types/activityImage";
import instance from "./api";

export const ActivityImageService = {
  async getByActivityId(activityId: number): Promise<ActivityImage[]> {
    const res = await instance.get(`/activities/${activityId}/images`);
    return res.data;
  },

  async upload(activityId: number, data: FormData): Promise<ActivityImage> {
    const res = await instance.post(`/activities/${activityId}/images`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async delete(imageId: number): Promise<void> {
    await instance.delete(`/activity-images/${imageId}`);
  },
};
