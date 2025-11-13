import { Activity } from "./activity";

export interface ActivitySchedule {
  id?: number;
  activityId: number;
  date: string; 
  timeSlot?: string;
  availableSpots: number;
  bookedSpots?: number;
  price?: number;

  startTime?: string;
  endTime?: string;

  activity?: Activity;
}