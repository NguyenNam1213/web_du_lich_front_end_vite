import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import email_icon from "../../assets/email.png";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import "./LoginSignUp.css";
import { register } from "../../api/auth";
import { useUser } from "../../context/UserContext";
const Signup = () => {
  const navigate = useNavigate();
  const { fetchProfile } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const res = await register(email, password);

      if (res.data?.access_token) {
        localStorage.setItem("access_token", res.data.access_token);
        await fetchProfile();
        alert("Đăng ký thành công");
        navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Email đã tồn tại hoặc lỗi server");
    }
  };


  const handleToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-signup-page">
      <div className="container">
        <div className="header">
          <div className="text">Đăng kí</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={user_icon} alt="user" />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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

        <div className="submit-container">
          <div className="submit" onClick={handleSignUp}>
            Đăng kí
          </div>
          <div className="submit" onClick={handleToLogin}>
            Đăng nhập
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
