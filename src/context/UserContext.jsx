import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../api/user";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      const user = res.data;

      const avatarUrl = user.avatar?.startsWith("/uploads")
        ? `http://localhost:3000${user.avatar}`
        : user.avatar || "/src/assets/cesar-rincon-XHVpWcr5grQ-unsplash.jpg";

      setUserData({
        id: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        phone: user.phone || "",
        image: avatarUrl,
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
    fetchProfile();
  }, []);

  if (loading) return null;

  return (
    <UserContext.Provider
      value={{ userData, setUserData, fetchProfile, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
