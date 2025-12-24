import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import "./LoginSignUp.css";
import { login } from "../../api/auth";
import { useUser } from "../../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchProfile } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);

      if (res.data && res.data.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        await fetchProfile();
        alert("Đăng nhập thành công!");
        navigate(from, {replace: true});
      } else {
        alert("Không nhận được token từ máy chủ!");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err.response?.data || err.message);
      alert("Email hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  const handleToSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="login-signup-page">
      <div className="container">
        <div className="header">
          <div className="text">Đăng nhập</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="email" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input">
            <img src={password_icon} alt="password" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="forgot-password">
          Quên mật khẩu?{" "}
          <span onClick={() => navigate("/account-settings")}>
            Nhấn vào đây
          </span>
        </div>

        <div className="submit-container">
          <div className="row-buttons">
            <div className="submit" onClick={handleToSignUp}>
              Đăng kí
            </div>
            <div className="submit" onClick={handleLogin}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </div>
          </div>

          <div
            className="google-btn"
            onClick={() =>
              (window.location.href = "http://localhost:3000/auth/google")
            }
          >
            <img
              src="https://img.icons8.com/color/24/google-logo.png"
              alt="google"
            />
            Đăng nhập bằng Google
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
