export interface UserBehavior {
  id: number;
  userId: number;
  activityId?: number;
  type: string; // e.g. "view", "click"
}