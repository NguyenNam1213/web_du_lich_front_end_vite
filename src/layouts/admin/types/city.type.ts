export interface Country {
  code: string;
  name: string;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
  createdAt: string;
  country?: Country;
}

export interface CityState {
  cities: City[];
  currentPage: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

