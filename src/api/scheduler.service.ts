import api from "./auth";

export interface ScheduleConfig {
  enabled: boolean;
  cronExpression: string;
  lastRun: string | null;
  lastStatus: "success" | "error" | "running" | null;
  lastMessage: string | null;
  nextRun: string | null;
}

export interface CronPreset {
  label: string;
  value: string;
  description: string;
}

export interface GetConfigResponse {
  success: boolean;
  config: ScheduleConfig;
}

export interface SetScheduleResponse {
  success: boolean;
  message: string;
  config: ScheduleConfig;
}

export interface RunPipelineResponse {
  success: boolean;
  message: string;
  details?: {
    pythonOutput: string;
    importResult: {
      imported: number;
      errors: number;
    };
  };
}

export interface GetPresetsResponse {
  success: boolean;
  presets: CronPreset[];
}

/**
 * Get current schedule configuration
 */
export const getScheduleConfig = async (): Promise<GetConfigResponse> => {
  const res = await api.get("/recommendation-scheduler/config");
  return res.data;
};

/**
 * Update schedule configuration
 */
export const setScheduleConfig = async (
  cronExpression: string,
  enabled: boolean
): Promise<SetScheduleResponse> => {
  const res = await api.post("/recommendation-scheduler/config", {
    cronExpression,
    enabled,
  });
  return res.data;
};

/**
 * Run pipeline manually
 */
export const runPipelineManually = async (): Promise<RunPipelineResponse> => {
  const res = await api.post("/recommendation-scheduler/run");
  return res.data;
};

/**
 * Get cron presets
 */
export const getCronPresets = async (): Promise<GetPresetsResponse> => {
  const res = await api.get("/recommendation-scheduler/presets");
  return res.data;
};

