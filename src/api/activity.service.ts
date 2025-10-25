import { Activity } from "../types/activity";
import instance from "./api";

export const ActivityService = {
  async getAll(): Promise<Activity[]> {
    const res = await instance.get("/activities");
    return res.data;
  },

  async getById(id: number): Promise<Activity> {
    const res = await instance.get(`/activities/${id}`);
    return res.data;
  },

  async create(data: Partial<Activity>): Promise<Activity> {
    const res = await instance.post("/activities", data);
    return res.data;
  },

  async update(id: number, data: Partial<Activity>): Promise<Activity> {
    const res = await instance.put(`/activities/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await instance.delete(`/activities/${id}`);
  },
};
