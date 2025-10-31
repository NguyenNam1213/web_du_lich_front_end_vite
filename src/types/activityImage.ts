export interface ActivityImage {
  id?: number;
  activityId: number;
  imageUrl: string;
  isPrimary?: boolean;
  sortOrder?: number;
}