import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/auth";
import email_icon from "../../assets/email.png";
import bgImage from "../../assets/pexels-freestockpro-1004584.jpg";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendEmail = async () => {
    if (!email) {
      alert("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage(
        "Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!"
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Email không tồn tại trong hệ thống!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-10 border border-gray-100">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#ff5b00] tracking-tight">
            Quên mật khẩu?
          </h2>
          <div className="w-12 h-1 bg-[#ff5b00] rounded-full mt-3"></div>
        </div>

        {message ? (
          <div className="text-center animate-fade-in">
            {/* Success Alert */}
            <div className="bg-orange-50 text-[#ff5b00] p-4 rounded-xl mb-8 text-sm border border-orange-100 font-medium">
              {message}
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3.5 bg-[#ff5b00] hover:bg-[#e14f00] text-white font-bold rounded-xl transition-all duration-300 shadow-md active:scale-[0.98]"
            >
              Quay lại đăng nhập
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-center text-gray-500 text-sm font-medium leading-relaxed px-4">
              Nhập email của bạn
            </p>

            {/* Input Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <img
                  src={email_icon}
                  alt="email"
                  className="w-5 h-5 opacity-40 group-focus-within:opacity-100 transition-opacity"
                />
              </div>
              <input
                type="email"
                placeholder="Địa chỉ Email"
                className="w-full pl-12 pr-4 py-3.5 bg-[#f8f8f8] border border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-[#ff5b00]/20 focus:border-[#ff5b00] focus:bg-white outline-none transition-all font-medium text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-4 pt-2">
              <button
                disabled={loading}
                onClick={handleSendEmail}
                className={`w-full py-3.5 font-bold text-white rounded-xl transition-all duration-300 shadow-[0_4px_14px_0_rgba(255,91,0,0.39)] ${
                  loading
                    ? "bg-[#ffb184] cursor-not-allowed shadow-none"
                    : "bg-[#ff5b00] hover:bg-[#e14f00] active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  "Gửi yêu cầu"
                )}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="text-sm text-gray-400 hover:text-[#ff5b00] transition-colors duration-200 font-bold"
              >
                Hủy và quay lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
