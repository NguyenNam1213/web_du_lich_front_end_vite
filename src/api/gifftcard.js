// src/api/giftcard.js
import api from "./auth.js";

export const sendGiftCard = (recipientEmail, amount, message) => {
  return api.post("/giftcard/send", {
    recipientEmail,
    amount,
    message,
  });
};

export const getReceivedGiftCards = () => {
  return api.get("/giftcard/received");
};

export const getSentGiftCards = () => {
  return api.get("/giftcard/sent");
};
