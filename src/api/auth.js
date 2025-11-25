
import axios from "axios";


const API_URL = "http://localhost:3000";


const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
});


export default api;

export const login = (email, password) =>{
    return api.post("/auth/login", { email, password });
}

export const register = (email, password) => {
  return api.post("/auth/register", { email, password });
};

export const getProfile = () => {
  return api.get("/auth/profile");
};

export default api;