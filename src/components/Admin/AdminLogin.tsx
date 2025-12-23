import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import "../LoginSignUp/LoginSignUp.css";
import { login } from "../../api/auth";
import { getProfile } from "../../api/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Kiểm tra nếu đã đăng nhập admin thì redirect
  useEffect(() => {
    const checkAdminLogin = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const res = await getProfile();
          const user = res.data;
          if (user.role && user.role.toLowerCase() === "admin") {
            // Đã đăng nhập admin, redirect về dashboard
            navigate("/admin/dashboard", { replace: true });
          }
        } catch (error) {
          // Token không hợp lệ, xóa và cho phép đăng nhập lại
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
      }
    };
    checkAdminLogin();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
     
      if (res.data && res.data.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        
        // Kiểm tra role của user
        try {
          const profileRes = await getProfile();
          const user = profileRes.data;
          
          // Debug: Log thông tin user để kiểm tra
          console.log("Profile response:", profileRes);
          console.log("User data:", user);
          console.log("User role:", user?.role);
          console.log("Role check:", user?.role?.toLowerCase() === "admin");
          
          // Kiểm tra nếu user có role admin
          if (user && user.role && user.role.toLowerCase() === "admin") {
            // Lưu thông tin user vào localStorage
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/admin/dashboard");
          } else {
            // Nếu không phải admin, xóa token và thông báo
            localStorage.removeItem("access_token");
            setError(`Bạn không có quyền truy cập trang admin! Role hiện tại: ${user?.role || 'không xác định'}`);
          }
        } catch (profileError: any) {
          console.error("Lỗi khi lấy profile:", profileError);
          console.error("Error response:", profileError.response);
          setError(`Không thể xác thực quyền admin! ${profileError.response?.data?.message || profileError.message}`);
          localStorage.removeItem("access_token");
        }
      } else {
        setError("Không nhận được token từ máy chủ!");
      }
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-signup-page">
      <div className="container">
        <div className="header">
          <div className="text">Đăng nhập Admin</div>
          <div className="underline"></div>
        </div>

        {error && (
          <div style={{
            color: "#ff3333",
            fontSize: "14px",
            marginBottom: "10px",
            textAlign: "center",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "5px"
          }}>
            {error}
          </div>
        )}

        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="email" />
            <input
              type="email"
              placeholder="Email Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="password" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>

        <div className="submit-container">
          <div className="submit" onClick={handleLogin} style={{ width: "100%" }}>
            {loading ? "Đang xử lý..." : "Đăng nhập Admin"}
          </div>
        </div>

        <div style={{ 
          marginTop: "20px", 
          textAlign: "center",
          fontSize: "14px",
          color: "#666"
        }}>
          <span 
            onClick={() => navigate("/login")}
            style={{ 
              cursor: "pointer",
              color: "#4c00b4",
              textDecoration: "underline"
            }}
          >
            Quay lại trang đăng nhập người dùng
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

