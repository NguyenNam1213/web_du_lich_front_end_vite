import api from "./auth";

export interface ExportRatingsResponse {
  success: boolean;
  message: string;
  filePath: string;
}

export interface ExportActivitiesResponse {
  success: boolean;
  message: string;
  filePath: string;
}

export interface ImportRecommendationsResponse {
  success: boolean;
  message: string;
  imported: number;
  errors: number;
}

export interface RecommendationStats {
  totalRecommendations: number;
  uniqueUsers: number;
  averagePredictedRating: number;
}

export interface Recommendation {
  id: number;
  userId: number;
  activityId: number;
  predictedRating: number;
  rank: number;
  createdAt: string;
  updatedAt: string;
  activity?: any;
}

/**
 * Export ratings ra CSV file (format ml-100k)
 */
export const exportRatingsToCSV = async (
  outputPath?: string
): Promise<ExportRatingsResponse> => {
  const res = await api.post("/recommendations/export/ratings", {
    outputPath,
  });
  return res.data;
};

/**
 * Export activities ra CSV với category features
 */
export const exportActivitiesToCSV = async (
  outputPath?: string
): Promise<ExportActivitiesResponse> => {
  const res = await api.post("/recommendations/export/activities", {
    outputPath,
  });
  return res.data;
};

/**
 * Import recommendations từ CSV file
 */
export const importRecommendationsFromCSV = async (
  filePath: string
): Promise<ImportRecommendationsResponse> => {
  const res = await api.post("/recommendations/import", {
    filePath,
  });
  return res.data;
};

/**
 * Lấy recommendations cho user hiện tại
 */
export const getRecommendations = async (
  topN?: number
): Promise<{ success: boolean; userId: number; recommendations: Recommendation[] }> => {
  const params = topN ? `?topN=${topN}` : "";
  const res = await api.get(`/recommendations${params}`);
  return res.data;
};

/**
 * Lấy recommendations cho một user cụ thể (Admin)
 */
export const getRecommendationsForUser = async (
  userId: number,
  topN?: number
): Promise<{ success: boolean; userId: number; recommendations: Recommendation[] }> => {
  const params = topN ? `?topN=${topN}` : "";
  const res = await api.get(`/recommendations/user/${userId}${params}`);
  return res.data;
};

/**
 * Lấy thống kê recommendations
 */
export const getRecommendationsStats = async (): Promise<{
  success: boolean;
  stats: RecommendationStats;
}> => {
  const res = await api.get("/recommendations/stats");
  return res.data;
};

/**
 * Xóa tất cả recommendations
 */
export const clearAllRecommendations = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await api.delete("/recommendations");
  return res.data;
};

