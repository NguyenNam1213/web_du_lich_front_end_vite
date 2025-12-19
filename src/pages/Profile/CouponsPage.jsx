import React, { useEffect, useState } from "react";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar.jsx";
import CouponCard from "../../components/Coupons/CouponsCard.jsx";
import { CouponService } from "../../api/coupon.service"

const CouponsPage = () => {
  const [activeTab, setActiveTab] = useState("apply");
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await CouponService.listActive();
        setCoupons(res.data);
      } catch (err) {
        console.error("Lỗi load coupons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Áp dụng coupon (tạm thời chỉ demo)
  const handleApplyCoupon = async (code) => {
    try {
      // ⚠️ amount giả – sau này lấy từ booking / cart
      const amount = 200;

      const res = await CouponService.apply(code, amount);

      alert(
        `Áp dụng thành công 🎉\nGiảm: ${res.data.discount}$\nCòn lại: ${res.data.finalAmount}$`
      );
    } catch (err) {
      alert(err.response?.data?.message || "Không áp dụng được coupon");
    }
  };

  // 🔹 Phân loại coupon
  const activeCoupons = coupons.filter(
    (c) => c.isActive && c.code.toLowerCase().includes(keyword.toLowerCase())
  );

  const inactiveCoupons = coupons.filter(
    (c) => !c.isActive && c.code.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <aside className="w-1/4 hidden lg:block">
          <ProfileSidebar />
        </aside>
        <main className="flex-1 bg-white rounded-2xl shadow-sm p-8 min-h-[600px]">
          <div className="flex max-w-xl mx-auto mb-10">
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            />
            <button className="bg-orange-500 text-white px-8 py-3 rounded-r-lg font-bold">
              Tìm kiếm
            </button>
          </div>
          <div className="flex gap-8 border-b border-gray-100 mb-8">
            <button
              onClick={() => setActiveTab("apply")}
              className={`pb-4 text-sm font-bold relative ${
                activeTab === "apply" ? "text-orange-500" : "text-gray-500"
              }`}
            >
              Áp dụng ({activeCoupons.length})
              {activeTab === "apply" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("not-apply")}
              className={`pb-4 text-sm font-bold relative ${
                activeTab === "not-apply" ? "text-orange-500" : "text-gray-500"
              }`}
            >
              Không áp dụng ({inactiveCoupons.length})
              {activeTab === "not-apply" && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">
              Đang tải mã khuyến mãi...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTab === "apply" &&
                (activeCoupons.length > 0 ? (
                  activeCoupons.map((coupon) => (
                    <CouponCard
                      key={coupon.id}
                      coupon={coupon}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 text-gray-400">
                    Không có mã áp dụng
                  </div>
                ))}

              {activeTab === "not-apply" &&
                (inactiveCoupons.length > 0 ? (
                  inactiveCoupons.map((coupon) => (
                    <CouponCard key={coupon.id} coupon={coupon} disabled />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-20 text-gray-400">
                    Không có mã không áp dụng
                  </div>
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CouponsPage;
