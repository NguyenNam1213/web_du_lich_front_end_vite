import React, { useEffect, useState } from "react";
import { getProfile } from "../../api/auth";

const Profile = () => {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        console.log("PROFILE RESPONSE:", res.data);
        setInfo(res.data);
      } catch (err) {
        console.error(err);
        alert("Bạn chưa đăng nhập hoặc token hết hạn");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div>
      <h1>Trang Profile</h1>
      {info ? <pre>{JSON.stringify(info, null, 2)}</pre> : "Đang tải..."}
    </div>
  );
};

export default Profile;
