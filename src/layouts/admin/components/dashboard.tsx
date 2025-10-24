import React, { useEffect, useState } from "react";
import { getStats, Stats } from "../../../services/api/statsApi";

interface StatCardProps {
  title: string;
  value: number;
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
          <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          )}
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

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getStats();
      setStats(data);
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Tổng quan hệ thống quản lý du lịch
          </p>
        </div>

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
                {Math.round(
                  (stats.users.active / stats.users.total) * 100
                )}%
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

