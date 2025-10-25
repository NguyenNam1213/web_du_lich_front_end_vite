import { ActivitySchedule } from "../types/activitySchedule";
import instance from "./api";

export const ActivityScheduleService = {
  async getByActivityId(activityId: number): Promise<ActivitySchedule[]> {
    const res = await instance.get(`/activities/${activityId}/schedules`);
    return res.data;
  },

  async create(activityId: number, data: Partial<ActivitySchedule>): Promise<ActivitySchedule> {
    const res = await instance.post(`/activities/${activityId}/schedules`, data);
    return res.data;
  },

  async update(id: number, data: Partial<ActivitySchedule>): Promise<ActivitySchedule> {
    const res = await instance.put(`/activity-schedules/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await instance.delete(`/activity-schedules/${id}`);
  },
};
