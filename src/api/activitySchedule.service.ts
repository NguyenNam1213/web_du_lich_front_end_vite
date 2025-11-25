import { AxiosResponse } from "axios";
import { ActivitySchedule } from "../types/activitySchedule";
import instance from "./api";

export const ActivityScheduleService = {
  // GET /activities/:id/schedules/with-times
  getAll(activityId: number): Promise<AxiosResponse<ActivitySchedule[]>> {
    return instance.get(`/activities/${activityId}/schedules/with-times`);
  },

  // POST /activities/:id/schedules
  create(activityId: number, data: Omit<ActivitySchedule, "id" | "activityId">) {
    return instance.post(`/activities/${activityId}/schedules`, data);
  },

  // PATCH /activities/:activityId/schedules/:id
  update(activityId: number, id: number, data: Partial<ActivitySchedule>) {
    return instance.patch(`/activities/${activityId}/schedules/${id}`, data);
  },

  // DELETE /activities/:activityId/schedules/:id
  delete(activityId: number, id: number) {
    return instance.delete(`/activities/${activityId}/schedules/${id}`);
  },
};