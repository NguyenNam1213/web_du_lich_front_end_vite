export interface Activity {
  id?: number;
  destinationId: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  highlights: string[];
  duration: number;
  price: number;
  currency: string;
  maxParticipants: number;
  instantConfirmation: boolean;
  freeCancellation: boolean;
  status: string;
  featured: boolean;
}