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
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
}

export interface BookingStats {
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  trend: Array<{
    date: string;
    count: number;
  }>;
  revenueTrend: Array<{
    date: string;
    revenue: number;
  }>;
  byMonth: Array<{
    month: string;
    count: number;
    revenue: number;
  }>;
}

export interface ActivityStats {
  byStatus: Array<{
    status: string;
    count: number;
  }>;
  topActivities: Array<{
    id: number;
    name: string;
    bookingCount: number;
  }>;
  byCategory: Array<{
    categoryId: number;
    categoryName: string;
    count: number;
  }>;
  byDestination: Array<{
    destinationId: number;
    destinationName: string;
    count: number;
  }>;
}

export const getStats = async (): Promise<Stats> => {
  const response = await api.get<Stats>("/stats");
  return response.data;
};

export const getBookingStats = async (): Promise<BookingStats> => {
  const response = await api.get<BookingStats>("/stats/bookings");
  return response.data;
};

export const getActivityStats = async (): Promise<ActivityStats> => {
  const response = await api.get<ActivityStats>("/stats/activities");
  return response.data;
};
