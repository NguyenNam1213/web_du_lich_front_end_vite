import React, { useState } from "react";
import "./AccountSettings.css";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import ProfilePicture from "../../assets/cesar-rincon-XHVpWcr5grQ-unsplash.jpg";
import { updatePassword } from "../../api/user";

const AccountSettings = () => {
  const [userData] = useState({
    image: ProfilePicture,
  });


  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [notifications, setNotifications] = useState({
    promoEmail: false,
    promoSMS: false,
    reminderEmail: true,
    reminderSMS: true,
  });

  
  const handleChangePassword = async () => {
    if (!oldPassword || !password || !confirmPassword) {
      setMessage("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

     try {
       await updatePassword(oldPassword, password);
       setMessage("Mật khẩu đã được cập nhật thành công!");
     } catch (err) {
       setMessage(err.response?.data?.message || "Đổi mật khẩu thất bại");
     }
  };

  const handleSaveNotifications = () => {
    alert("Đã lưu tùy chỉnh thông báo!");
  };

  return (
    <div className="settings-container">
      <ProfileSidebar userData={userData}/>

      <div className="settings-main">
        <div className="settings-box">
          <h3>Đổi mật khẩu</h3>
          <p>
            Hãy tạo một mật khẩu mạnh để tài khoản của bạn được an toàn. Mật
            khẩu phải từ 8–20 ký tự, gồm ít nhất 1 chữ cái, 1 số và 1 ký tự đặc
            biệt.
          </p>

          <div className="input-group">
            <input
              type="password"
              placeholder="Nhập mật khẩu cũ"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            className="save-btn"
            onClick={handleChangePassword}
            disabled={!password || !confirmPassword || !oldPassword}
          >
            Lưu
          </button>

          {message && <p className="message">{message}</p>}
        </div>
        <div className="settings-box">
          <h3>Tùy chỉnh thông báo</h3>
          <p>Bạn muốn nhận những thông báo nào?</p>

          <div className="notify-section">
            <h4>Cập nhật và Ưu đãi</h4>
            <label>
              <input
                type="checkbox"
                checked={notifications.promoEmail}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    promoEmail: e.target.checked,
                  }))
                }
              />{" "}
              Email
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifications.promoSMS}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    promoSMS: e.target.checked,
                  }))
                }
              />{" "}
              SMS
            </label>

            <h4>Nhắc nhở</h4>
            <label>
              <input
                type="checkbox"
                checked={notifications.reminderEmail}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    reminderEmail: e.target.checked,
                  }))
                }
              />{" "}
              Email
            </label>
            <label>
              <input
                type="checkbox"
                checked={notifications.reminderSMS}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    reminderSMS: e.target.checked,
                  }))
                }
              />{" "}
              SMS
            </label>
          </div>

          <div className="button-group">
            <button className="save-btn" onClick={handleSaveNotifications}>
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
