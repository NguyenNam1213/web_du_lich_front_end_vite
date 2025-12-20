import React, { useState, useEffect } from "react";
import {
  getScheduleConfig,
  setScheduleConfig,
  runPipelineManually,
  ScheduleConfig,
} from "../../../api/scheduler.service";
import {
  Clock,
  Play,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  RefreshCw,
} from "lucide-react";

type FrequencyType = "daily" | "weekly";

const DAYS_OF_WEEK = [
  { value: 0, label: "Chủ nhật" },
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, "0"),
}));

const MINUTES = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, "0"),
}));

// Parse cron expression to get frequency, hour, minute, and day
const parseCronExpression = (cron: string): { frequency: FrequencyType; hour: number; minute: number; dayOfWeek: number } => {
  const parts = cron.split(" ");
  if (parts.length !== 5) {
    return { frequency: "daily", hour: 2, minute: 0, dayOfWeek: 0 };
  }

  const minute = parseInt(parts[0]) || 0;
  const hour = parseInt(parts[1]) || 2;
  const dayOfWeek = parts[4] === "*" ? 0 : parseInt(parts[4]) || 0;
  const frequency: FrequencyType = parts[4] === "*" ? "daily" : "weekly";

  return { frequency, hour, minute, dayOfWeek };
};

// Build cron expression from frequency, hour, minute, and day
const buildCronExpression = (frequency: FrequencyType, hour: number, minute: number, dayOfWeek: number): string => {
  if (frequency === "daily") {
    return `${minute} ${hour} * * *`;
  }
  return `${minute} ${hour} * * ${dayOfWeek}`;
};

export default function ManageScheduler() {
  const [config, setConfig] = useState<ScheduleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>("daily");
  const [hour, setHour] = useState(2);
  const [minute, setMinute] = useState(0);
  const [dayOfWeek, setDayOfWeek] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const configRes = await getScheduleConfig();

      setConfig(configRes.config);
      setEnabled(configRes.config.enabled);

      // Parse existing cron expression
      const parsed = parseCronExpression(configRes.config.cronExpression);
      setFrequency(parsed.frequency);
      setHour(parsed.hour);
      setMinute(parsed.minute);
      setDayOfWeek(parsed.dayOfWeek);
    } catch (error: any) {
      showMessage("error", error.response?.data?.message || "Lỗi khi tải cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const cronExpression = buildCronExpression(frequency, hour, minute, dayOfWeek);
      const res = await setScheduleConfig(cronExpression, enabled);
      setConfig(res.config);
      showMessage("success", res.message);
    } catch (error: any) {
      showMessage("error", error.response?.data?.message || "Lỗi khi lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const handleRunNow = async () => {
    if (!confirm("Bạn có chắc muốn chạy pipeline ngay bây giờ? Quá trình này có thể mất vài phút.")) {
      return;
    }

    try {
      setRunning(true);
      showMessage("success", "Đang chạy pipeline...");
      const res = await runPipelineManually();
      
      if (res.success) {
        showMessage("success", res.message);
      } else {
        showMessage("error", res.message);
      }

      // Reload config to get updated lastRun info
      await loadData();
    } catch (error: any) {
      showMessage("error", error.response?.data?.message || "Lỗi khi chạy pipeline");
    } finally {
      setRunning(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Chưa có";
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "success":
        return "Thành công";
      case "error":
        return "Lỗi";
      case "running":
        return "Đang chạy";
      default:
        return "Chưa chạy";
    }
  };

  const getScheduleDescription = () => {
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    if (frequency === "daily") {
      return `Mỗi ngày lúc ${timeStr}`;
    }
    const dayName = DAYS_OF_WEEK.find(d => d.value === dayOfWeek)?.label || "";
    return `Mỗi ${dayName} lúc ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <Clock className="w-6 h-6" />
        Lịch chạy Recommendation
      </h1>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Trạng thái hiện tại</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
            <div className="flex items-center gap-2">
              {config?.enabled ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  Đang bật
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Đã tắt
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Lần chạy tiếp theo</p>
            <p className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              {config?.enabled ? formatDate(config?.nextRun) : "Không có"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Lần chạy cuối</p>
            <div className="flex items-center gap-2">
              {getStatusIcon(config?.lastStatus ?? null)}
              <span>{getStatusText(config?.lastStatus ?? null)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(config?.lastRun ?? null)}
            </p>
          </div>
        </div>

        {config?.lastMessage && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">{config.lastMessage}</p>
          </div>
        )}
      </div>

      {/* Configuration Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Cấu hình lịch chạy</h2>

        {/* Enable/Disable Toggle */}
        <div className="mb-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium">Bật lịch tự động</span>
          </label>
        </div>

        {/* Frequency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tần suất
          </label>
          <div className="flex gap-4">
            <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
              frequency === "daily" ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"
            }`}>
              <input
                type="radio"
                name="frequency"
                value="daily"
                checked={frequency === "daily"}
                onChange={() => setFrequency("daily")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium">Mỗi ngày</span>
            </label>
            <label className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
              frequency === "weekly" ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:bg-gray-50"
            }`}>
              <input
                type="radio"
                name="frequency"
                value="weekly"
                checked={frequency === "weekly"}
                onChange={() => setFrequency("weekly")}
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium">Mỗi tuần</span>
            </label>
          </div>
        </div>

        {/* Day of Week Selection (only for weekly) */}
        {frequency === "weekly" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ngày trong tuần
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setDayOfWeek(day.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    dayOfWeek === day.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Time Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Thời gian chạy
          </label>
          <div className="flex items-center gap-2">
            <select
              value={hour}
              onChange={(e) => setHour(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {HOURS.map((h) => (
                <option key={h.value} value={h.value}>
                  {h.label}
                </option>
              ))}
            </select>
            <span className="text-xl font-bold text-gray-500">:</span>
            <select
              value={minute}
              onChange={(e) => setMinute(parseInt(e.target.value))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {MINUTES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedule Preview */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">📅 Lịch chạy:</span> {getScheduleDescription()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Lưu cấu hình
          </button>

          <button
            onClick={handleRunNow}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {running ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Chạy ngay
          </button>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Thông tin Pipeline</h3>
        <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
          <li>Xuất <code className="bg-blue-100 px-1 rounded">items.csv</code> (activities) đến thư mục RCM</li>
          <li>Xuất <code className="bg-blue-100 px-1 rounded">ratings.csv</code> đến thư mục RCM</li>
          <li>Chạy Python script <code className="bg-blue-100 px-1 rounded">hybrid_cf_cb.py</code></li>
          <li>Import <code className="bg-blue-100 px-1 rounded">recommendations.csv</code> vào database</li>
        </ol>
        <p className="text-xs text-blue-600 mt-3">
          * Đảm bảo Python đã được cài đặt và các thư viện cần thiết (pandas, numpy, scikit-learn)
        </p>
      </div>
    </div>
  );
}

