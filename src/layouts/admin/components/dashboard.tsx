import React, { useEffect, useState } from "react";
import {
  getStats,
  Stats,
  getBookingStats,
  BookingStats,
  getActivityStats,
  ActivityStats,
} from "../../../services/api/statsApi";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <div className={`text-4xl ${color} opacity-80`}>{icon}</div>
      </div>
    </div>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
};

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

const statusColorMap: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
  active: "#10b981",
  inactive: "#ef4444",
  draft: "#6b7280",
};

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [statsData, bookingData, activityData] = await Promise.all([
        getStats(),
        getBookingStats(),
        getActivityStats(),
      ]);
      setStats(statsData);
      setBookingStats(bookingData);
      setActivityStats(activityData);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Đang tải thống kê...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error || "Có lỗi xảy ra"}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600 mt-2">
            Tổng quan hệ thống quản lý du lịch
          </p>
        </div>

        {/* Booking Statistics */}
        {stats.bookings && (
          <Section title="📅 Thống kê đặt chỗ">
            <StatCard
              title="Tổng đặt chỗ"
              value={stats.bookings.total}
              icon="📝"
              color="text-blue-600"
            />
            <StatCard
              title="Đang chờ"
              value={stats.bookings.pending}
              icon="⏳"
              color="text-amber-600"
            />
            <StatCard
              title="Đã xác nhận"
              value={stats.bookings.confirmed}
              icon="✅"
              color="text-green-600"
            />
            <StatCard
              title="Doanh thu"
              value={`$${stats.bookings.revenue.toLocaleString()}`}
              icon="💰"
              color="text-emerald-600"
            />
          </Section>
        )}

        {/* Booking Charts */}
        {bookingStats && (
          <div className="mb-8 space-y-6">
            {/* Booking Status Pie Chart and Trend Line Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Booking by Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Phân bổ đặt chỗ theo trạng thái
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingStats.byStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.status}: ${entry.count}`}
                    >
                      {bookingStats.byStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            statusColorMap[entry.status] ||
                            COLORS[index % COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Booking Trend (30 days) */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Xu hướng đặt chỗ (30 ngày qua)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingStats.trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("vi-VN");
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Số đặt chỗ"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Trend and Monthly Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Xu hướng doanh thu (30 ngày qua)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bookingStats.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("vi-VN");
                      }}
                      formatter={(value: number) => [
                        `$${value.toLocaleString()}`,
                        "Doanh thu",
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Doanh thu"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Thống kê theo tháng (6 tháng qua)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={bookingStats.byMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="count"
                      fill="#3b82f6"
                      name="Số đặt chỗ"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      fill="#10b981"
                      name="Doanh thu"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Activity Statistics */}
        {activityStats && (
          <div className="mb-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b-2 border-gray-200">
              🎯 Thống kê hoạt động
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity by Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Hoạt động theo trạng thái
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityStats.byStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.status}: ${entry.count}`}
                    >
                      {activityStats.byStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            statusColorMap[entry.status] ||
                            COLORS[index % COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Activities */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Top 10 hoạt động phổ biến
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={activityStats.topActivities}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="bookingCount"
                      fill="#8b5cf6"
                      name="Số lượt đặt"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Activity by Category */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Hoạt động theo danh mục
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityStats.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="categoryName"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#06b6d4" name="Số hoạt động" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Activity by Destination */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Hoạt động theo điểm đến
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityStats.byDestination}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="destinationName"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#f97316" name="Số hoạt động" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* User Statistics */}
        <Section title="👥 Thống kê người dùng">
          <StatCard
            title="Tổng người dùng"
            value={stats.users.total}
            icon="👤"
            color="text-blue-600"
          />
          <StatCard
            title="Người dùng hoạt động"
            value={stats.users.active}
            icon="✅"
            color="text-green-600"
          />
          <StatCard
            title="Người dùng bị khóa"
            value={stats.users.suspended}
            icon="🚫"
            color="text-red-600"
          />
          <StatCard
            title="Người dùng mới"
            value={stats.users.newLast7Days}
            icon="🆕"
            color="text-purple-600"
            subtitle="7 ngày qua"
          />
        </Section>

        {/* User Roles */}
        <Section title="👔 Phân loại theo vai trò">
          <StatCard
            title="Quản trị viên"
            value={stats.users.admin}
            icon="👑"
            color="text-amber-600"
          />
          <StatCard
            title="Nhà cung cấp"
            value={stats.users.supplier}
            icon="🏢"
            color="text-indigo-600"
          />
          <StatCard
            title="Khách hàng"
            value={stats.users.customer}
            icon="🧑‍💼"
            color="text-teal-600"
          />
        </Section>

        {/* Location Statistics */}
        <Section title="🌍 Thống kê địa điểm">
          <StatCard
            title="Quốc gia"
            value={stats.locations.countries}
            icon="🗺️"
            color="text-rose-600"
          />
          <StatCard
            title="Thành phố"
            value={stats.locations.cities}
            icon="🏙️"
            color="text-cyan-600"
          />
          <StatCard
            title="Điểm đến"
            value={stats.locations.destinations}
            icon="📍"
            color="text-orange-600"
          />
        </Section>

        {/* Content Statistics */}
        <Section title="📝 Thống kê nội dung">
          <StatCard
            title="Hoạt động"
            value={stats.content.activities}
            icon="🎯"
            color="text-lime-600"
          />
          <StatCard
            title="Danh mục"
            value={stats.content.categories}
            icon="📂"
            color="text-emerald-600"
          />
        </Section>

        {/* Quick Summary */}
        <div className="mt-8 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">📊 Tổng kết hệ thống</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {stats.users.total + stats.locations.destinations}
              </p>
              <p className="text-gray-300 mt-2">Tổng tài nguyên</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">
                {Math.round((stats.users.active / stats.users.total) * 100)}%
              </p>
              <p className="text-gray-300 mt-2">Tỷ lệ người dùng hoạt động</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">
                {stats.locations.cities + stats.locations.destinations}
              </p>
              <p className="text-gray-300 mt-2">Tổng địa điểm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
