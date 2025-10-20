import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import email_icon from "../../assets/email.png";
import password_icon from "../../assets/password.png";
import "./LoginSignUp.css";
import { login } from "../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.data.access_token);
      alert("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Email hoặc mật khẩu không đúng");
    }
  };

  const handleToSignUp = () => {
    navigate("/signup");
  };

  return (
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="password" />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <div className="forgot-password">
        Quên mật khẩu? <span>Nhấn vào đây</span>
      </div>

      <div className="submit-container">
        <div className="submit" onClick={handleToSignUp}>
          Đăng kí
        </div>
        <div className="submit" onClick={handleLogin}>
          Đăng nhập
        </div>
      </div>
    </div>
  );
};

export default Login;
