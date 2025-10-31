import axios from "axios";

// export const API_URL = import.meta.env.BACK_END_API;
export const API_URL = "http://localhost:3000/";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
