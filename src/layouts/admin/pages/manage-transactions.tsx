import React, { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import paymentService from "../../../api/payment.service";

interface ImportResult {
  message: string;
  processed: number;
  updated: number;
  errors: number;
  details: Array<{ bookingId: string; status: string; message: string }>;
}

export default function ManageTransactions() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setError("");
        setResult(null);
      } else {
        setError("Vui lòng chọn file CSV");
        setSelectedFile(null);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn file CSV");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const importResult = await paymentService.importTransactions(selectedFile);
      setResult(importResult);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Có lỗi xảy ra khi import file CSV"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Quản lý giao dịch
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Import lịch sử giao dịch từ file CSV để tự động cập nhật trạng thái thanh toán
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chọn file CSV
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
              <Upload size={20} />
              Chọn file
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FileText size={20} />
                <span>{selectedFile.name}</span>
                <span className="text-sm text-gray-500">
                  ({(selectedFile.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400">
            <XCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={!selectedFile || loading}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <Upload size={20} />
              Import giao dịch
            </>
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Kết quả import
            </h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Đã xử lý
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.processed}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cập nhật thành công
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.updated}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Lỗi
                </div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.errors}
                </div>
              </div>
            </div>

            {result.details.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chi tiết:
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {result.details.map((detail, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg flex items-start gap-2 ${
                        detail.status === "success"
                          ? "bg-green-50 dark:bg-green-900/20"
                          : "bg-red-50 dark:bg-red-900/20"
                      }`}
                    >
                      {detail.status === "success" ? (
                        <CheckCircle
                          size={20}
                          className="text-green-600 dark:text-green-400 mt-0.5"
                        />
                      ) : (
                        <XCircle
                          size={20}
                          className="text-red-600 dark:text-red-400 mt-0.5"
                        />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Booking #{detail.bookingId}
                        </div>
                        <div
                          className={`text-xs ${
                            detail.status === "success"
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"
                          }`}
                        >
                          {detail.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle
              size={20}
              className="text-blue-600 dark:text-blue-400 mt-0.5"
            />
            <div className="text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold mb-1">Hướng dẫn:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>File CSV phải có định dạng sao kê ngân hàng</li>
                <li>
                  Nội dung chuyển tiền phải có format: "Thanh toán đơn hàng
                  #[bookingId]"
                </li>
                <li>
                  Số tiền trong cột "Phát sinh nợ" phải khớp với tổng tiền của
                  booking
                </li>
                <li>
                  Hệ thống sẽ tự động cập nhật paymentStatus thành "paid" cho
                  các booking đã thanh toán
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

