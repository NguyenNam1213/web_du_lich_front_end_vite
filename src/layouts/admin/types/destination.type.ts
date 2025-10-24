import { City } from "./city.type";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  imageUrl?: string | null;
  createdAt: string;
  city?: City;
}

export interface DestinationState {
  destinations: Destination[];
  currentPage: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

