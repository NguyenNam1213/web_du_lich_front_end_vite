import { AxiosResponse } from "axios";
import { Activity } from "../types/activity";
import instance from "./api";

const BASE_URL = "/activities";

export const ActivityService = {
  getAll(): Promise<AxiosResponse<Activity[]>> {
    return instance.get(BASE_URL);
  },

  getById(id: number): Promise<AxiosResponse<Activity>> {
    return instance.get(`${BASE_URL}/${id}`);
  },

  create(data: Activity): Promise<AxiosResponse<Activity>> {
    return instance.post(BASE_URL, data);
  },

  update(id: number, data: Partial<Activity>): Promise<AxiosResponse<Activity>> {
    return instance.patch(`${BASE_URL}/${id}`, data);
  },

  delete(id: number): Promise<AxiosResponse<{ message: string }>> {
    return instance.delete(`${BASE_URL}/${id}`);
  },

  getAllTour(): Promise<AxiosResponse<Activity[]>> {
    return instance.get(`/tours/activity`);
  },

  getTourById(id: number): Promise<AxiosResponse<Activity>> {
    return instance.get(`/tours/activity/${id}`);
  }
};