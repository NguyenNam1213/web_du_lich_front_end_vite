import React, { useRef, useState, useEffect } from "react";
import "./ProfileSideBar.css";
import { useNavigate } from "react-router-dom";
import { uploadAvatar } from "../../api/user"; 
import { useUser } from "../../context/UserContext";
const ProfileSidebar = () => {
  const { userData, setUserData } = useUser();

  useEffect(() => {
    console.log("Avatar đã cập nhật:", userData.image);
  }, [userData.image]);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadAvatar(file);
      console.log("Upload response:", res.data);

      let avatarUrl = res.data?.avatar;

      if (!avatarUrl) {
        throw new Error(
          "Không tìm thấy đường dẫn avatar trong phản hồi server"
        );
      }

      if (avatarUrl.startsWith("/uploads")) {
        avatarUrl = `http://localhost:3000${avatarUrl}`;
      }

      setUserData((prev) => ({
        ...prev,
        image: avatarUrl,
      }));

      console.log("Ảnh trả về từ server:", avatarUrl);
      
      alert("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      console.error("Lỗi khi upload avatar:", err);
      alert("Tải ảnh thất bại, vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  
  return (
    <div className="profile-sidebar">
      <div className="avatar-container" onClick={handleAvatarClick}>
        <img
          key={userData.image}
          src={
            userData.image
              ? userData.image
              : "https://via.placeholder.com/150?text=No+Avatar"
          }
          alt="avatar"
          className={`profile-avatar ${uploading ? "loading" : ""}`}
        />

        {uploading && <div className="overlay">Đang tải...</div>}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <h3 className="profile-username">
        {userData.firstName || userData.lastName
          ? `${userData.firstName || ""} ${userData.lastName || ""}`
          : "Klook User"}
      </h3>

      <button
        className="update-info-btn"
        onClick={() => navigate("/account-settings")}
      >
        Cài đặt tài khoản
      </button>

      <div className="profile-level">
        <p className="level-badge">Lv.1 Explorer</p>
        <p className="level-text">4 benefits, 1X KlookCash</p>
      </div>

      <div className="sidebar-section">
        <p>Mã giảm giá </p>
        <p>Xem</p>
      </div>
      <div className="sidebar-section">
        <p>Xu</p>
        <p>Xem</p>
      </div>
      <div className="sidebar-section" onClick={() => navigate("/gift-cards")}>
        <p>Thẻ quà tặng</p>
      </div>
      <div className="sidebar-section" onClick={() => navigate("/profile")}>
        <p>Thông tin cá nhân</p>
      </div>
      <div className="sidebar-section" onClick={() => navigate("/wishlist")}>
        <p>Wishlist</p>
      </div>
    </div>
  );
};

export default ProfileSidebar;
