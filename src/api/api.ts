import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent

     const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  {
    synchronous: true,
    runWhen: () => true,
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    return Promise.reject(error);
  }
);
// Thêm interceptor để xử lý token hết hạn
instance.interceptors.response.use(
  function onFulfilled(response) {
    return response;
  },
  function onRejected(error) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');


      alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');


      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default instance;