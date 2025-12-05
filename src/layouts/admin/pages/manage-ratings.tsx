import React, { useState } from "react";
import {
  exportRatingsToCSV,
  exportActivitiesToCSV,
  importRecommendationsFromCSV,
  getRecommendationsStats,
} from "../../../api/recommendations.service";
import { Download, Upload, FileText, BarChart3, Loader2 } from "lucide-react";

export default function ManageRatings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleExportRatings = async () => {
    try {
      setLoading(true);
      setMessage(null);

      // Gọi API để export và lấy file path
      const result = await exportRatingsToCSV();
      
      // Tạo download link từ file path
      // Giả sử file được serve qua static file server
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/${result.filePath.replace(/\\/g, '/')}`;
      
      // Tải file
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "ratings.csv";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showMessage("success", `Đã xuất và tải ratings.csv thành công!`);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.message || "Lỗi khi xuất ratings CSV"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportActivities = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const result = await exportActivitiesToCSV();
      
      // Tạo download link từ file path
      const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/${result.filePath.replace(/\\/g, '/')}`;
      
      // Tải file
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "activities.csv";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showMessage("success", `Đã xuất và tải activities.csv thành công!`);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.message || "Lỗi khi xuất activities CSV"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImportRecommendations = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setMessage(null);

      // Upload file lên server trước
      const formData = new FormData();
      formData.append("file", file);

      // Giả sử backend có endpoint upload file
      // Hoặc client-side đọc file và gửi filePath
      const filePath = `exports/${file.name}`;

      const result = await importRecommendationsFromCSV(filePath);
      
      showMessage(
        "success",
        `Đã import ${result.imported} recommendations. ${result.errors > 0 ? `Có ${result.errors} lỗi.` : ""}`
      );

      // Reload stats
      if (stats) {
        loadStats();
      }
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.message || "Lỗi khi import recommendations"
      );
    } finally {
      setLoading(false);
      e.target.value = ""; // Reset input
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const result = await getRecommendationsStats();
      setStats(result.stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Quản lý Rating & Recommendations</h1>

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

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold">Thống kê Recommendations</h2>
        </div>

        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Tổng Recommendations</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalRecommendations}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Số Users</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.uniqueUsers}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Rating Trung bình</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.averagePredictedRating.toFixed(2)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Không có dữ liệu thống kê</p>
        )}
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold">Xuất dữ liệu CSV</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Xuất dữ liệu để sử dụng với hệ thống recommendation Python
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Ratings */}
          <button
            onClick={handleExportRatings}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <span>Xuất Ratings CSV</span>
          </button>

          {/* Export Activities */}
          <button
            onClick={handleExportActivities}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <span>Xuất Activities CSV</span>
          </button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold mb-2">Hướng dẫn:</p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Nhấn "Xuất Ratings CSV" để tải file ratings.csv (format ml-100k)</li>
            <li>Nhấn "Xuất Activities CSV" để tải file activities.csv với category features</li>
            <li>Copy 2 files vào folder rcm/implementation</li>
            <li>Chạy Python script: python hybrid_cf_cb.py</li>
            <li>Import file recommendations.csv kết quả vào hệ thống</li>
          </ol>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-gray-700" />
          <h2 className="text-xl font-semibold">Import Recommendations</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Import file recommendations.csv từ Python script vào database
        </p>

        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors w-full md:w-auto">
          <Upload className="w-5 h-5" />
          <span>Chọn file CSV để import</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleImportRecommendations}
            disabled={loading}
            className="hidden"
          />
        </label>

        {loading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang import...</span>
          </div>
        )}
      </div>
    </div>
  );
}

