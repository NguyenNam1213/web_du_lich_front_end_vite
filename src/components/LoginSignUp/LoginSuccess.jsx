import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const { fetchProfile } = useUser();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("access_token", token);

        try {
          // Gọi fetchProfile để lấy thông tin user và cập nhật context
          await fetchProfile();
          // alert("Đăng nhập thành công!");
          navigate("/");
        } catch (error) {
          console.error("Lỗi khi lấy profile:", error);
          // alert(
          //   "Đăng nhập thành công nhưng không thể tải thông tin người dùng!"
          // );
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    };

    handleLoginSuccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Đang đăng nhập...</div>;
}
