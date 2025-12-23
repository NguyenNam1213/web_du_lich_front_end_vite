import React, { useState } from "react";
import "./Profile.css";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import { useUser } from "../../context/UserContext";
import { updateProfile } from "../../api/user";

const Profile = () => {
  const { userData, fetchProfile } = useUser();
  const [edit, setEdit] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    phone: userData.phone || "",
    email: userData.email
  });

  const handleSave = async () => {
    try {
      await updateProfile(
        formData.firstName,
        formData.lastName,
        formData.phone
      );

      await fetchProfile(); 

      alert("Cập nhật thông tin thành công!");
      setEdit(false);
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      alert("Cập nhật thất bại, vui lòng thử lại!");
    }
  };


  return (
    <div className="profile-container">
      <ProfileSidebar />

      <div className="profile-main">
        <h2>Thông tin cá nhân</h2>
        <p className="desc">
          We'll only use this info to personalize your experience. Your details
          will be stored securely and won’t be made public.
        </p>

        <div className="info-row">
          <span>Họ</span>
          {edit ? (
            <input
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
          ) : (
            <p>{userData.firstName || "—"}</p>
          )}
        </div>

        <div className="info-row">
          <span>Tên</span>
          {edit ? (
            <input
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          ) : (
            <p>{userData.lastName || "—"}</p>
          )}
        </div>

        <div className="info-row">
          <span>Email</span>
          <p>{formData.email}</p>
        </div>
        <div className="info-row">
          <span>Số điện thoại</span>
          {edit ? (
            <input
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          ) : (
            <p>{userData.phone || "—"}</p>
          )}
        </div>

        <div className="info-row">
          <span>Số dư tài khoản</span>
          <p>
            {userData.balance
              ? userData.balance.toLocaleString("vi-VN") + " VNĐ"
              : "0 VNĐ"}
          </p>
        </div>

        <div className="button-group">
          {edit ? (
            <button className="save-btn" onClick={handleSave}>
              Lưu
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setEdit(true)}>
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
