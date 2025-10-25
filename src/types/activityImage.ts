import { Activity } from "./activity";

export interface ActivityImage {
  id: number;
  activityId: number;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
  activity?: Activity;
}