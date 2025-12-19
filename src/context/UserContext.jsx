import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/user";

const UserContext = createContext();
const API_URL = "http://localhost:3000";

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const user = res.data;

      const avatarUrl = user.avatar?.startsWith("/uploads")
        ? `${API_URL}${user.avatar}`
        : user.avatar || "/default-avatar.png";

      setUserData({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || "",
        avatar: avatarUrl,
        balance: user.balance ?? 0,
      });
    } catch (err) {
      console.error("Lỗi khi tải profile:", err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUserData(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, fetchProfile, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
