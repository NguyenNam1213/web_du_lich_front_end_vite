import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const { fetchProfile } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);

      // Use fetchProfile from context
      fetchProfile()
        .then(() => {
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, fetchProfile]);

  return <div>Đang đăng nhập...</div>;
}
