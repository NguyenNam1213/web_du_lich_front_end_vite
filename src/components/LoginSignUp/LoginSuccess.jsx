import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from  "../../context/UserContext";
import { getProfile } from "../../api/user";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const { setUserData } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);

      // Gọi API lấy profile user
      getProfile()
        .then((res) => {
          setUserData({
            ...res.data, // dữ liệu user từ backend
            isAuthenticated: true,
          });
          navigate("/");
        })
        .catch(() => {
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Đang đăng nhập...</div>;
}
