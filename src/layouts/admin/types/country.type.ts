export interface Country {
  code: string;
  name: string;
  createdAt: string;
}

export interface CountryState {
  countries: Country[];
  currentPage: number;
  totalPages: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

