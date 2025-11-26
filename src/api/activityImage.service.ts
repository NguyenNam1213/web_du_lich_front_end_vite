import { AxiosResponse } from "axios";
import { ActivityImage } from "../types/activityImage";
import instance from "./api";

export const ActivityImageService = {
  // GET /activities/:id/images
  getAll(activityId: number): Promise<AxiosResponse<ActivityImage[]>> {
    return instance.get(`/activities/${activityId}/images`);
  },

  // POST /activities/:id/images
  create(activityId: number, data: Omit<ActivityImage, "id" | "activityId">) {
    return instance.post(`/activities/${activityId}/images`, data);
  },

  // PATCH /activities/:activityId/images/:id
  update(activityId: number, id: number, data: Partial<ActivityImage>) {
    return instance.patch(`/activities/${activityId}/images/${id}`, data);
  },

  // DELETE /activities/:activityId/images/:id
  delete(activityId: number, id: number) {
    return instance.delete(`/activities/${activityId}/images/${id}`);
  },

  // upload image
  upload(
    activityId: number, 
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ) {
    const formData = new FormData();
    formData.append("file", file);

    return instance.post(`/activities/${activityId}/images/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 giây
      onUploadProgress, // Axios sẽ gọi callback này với progress event
    });
  },
};