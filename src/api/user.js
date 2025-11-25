// src/api/users.js
import api from "./auth.js"

export const updatePassword = (oldPassword, newPassword) => {
  return api.patch("/users/update-password", {
    oldPassword,
    newPassword,
  });
};

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/users/upload-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProfile = (firstName, lastName, phone) => {
  return api.patch("/users/update-profile", {
    firstName,
    lastName,
    phone,
  });
};

export const getProfile = () => {
  return api.get("/users/profile");
};