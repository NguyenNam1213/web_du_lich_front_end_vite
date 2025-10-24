import api from "../api-config";

export interface Stats {
  users: {
    total: number;
    active: number;
    suspended: number;
    admin: number;
    supplier: number;
    customer: number;
    newLast7Days: number;
  };
  locations: {
    countries: number;
    cities: number;
    destinations: number;
  };
  content: {
    activities: number;
    categories: number;
  };
}

export const getStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>("/stats");
  return response.data;
};

