export interface ActivitySchedule {
  id?: number;
  activityId: number;
  date: string; // "2025-10-24"
  timeSlot?: string;
  availableSpots: number;
  bookedSpots?: number;
  price?: number;
}