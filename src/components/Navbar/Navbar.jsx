import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { ActivityService } from "../../api/activity.service";

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, logout } = useUser();

  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  // Gọi API khi người dùng nhập (debounce nhẹ)
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchText.trim() === "") {
        setResults([]);
        return;
      }

      ActivityService.search(searchText)
        .then((res) => setResults(res.data))
        .catch(() => setResults([]));
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);
  console.log("Avatar URL:", userData?.avatar);
  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo" onClick={() => navigate(`/`)}>
        Travel
      </h1>

      <div className="nav-search">
        <input
          type="text"
          placeholder="Tìm theo điểm đến, hoạt động"
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {/* --- Dropdown kết quả tìm kiếm --- */}
        {results.length > 0 && (
          <ul className="search-dropdown">
            {results.map((item) => (
              <li
                key={item.id}
                className="search-item"
                onClick={() => {
                  navigate(`/tours/${item.id}`);
                  setSearchText("");
                  setResults([]);
                }}
              >
                <span className="result-name">{item.name}</span>
                <span className="result-price">${item.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="nav-menu">
        <li>
          <a className="nav-link" href="/">
            Mở ứng dụng
          </a>
        </li>
        <li>
          <a className="nav-link" href="/">
            Xem gần đây
          </a>
        </li>
        <li>
          <a className="nav-link" href="/">
            Trợ giúp
          </a>
        </li>

        {userData ? (
          <li className="nav-user">
            <img
              src={userData.avatar || "/default-avatar.png"}
              alt="avatar"
              className="nav-avatar"
              onClick={() => navigate("/profile")}
            />

            <span className="nav-username">
              {userData.firstName} {userData.lastName}
            </span>

            <button className="nav-link nav-logout" onClick={logout}>
              Đăng xuất
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link className="nav-link" to="/signup">
                Đăng kí
              </Link>
            </li>
            <li>
              <Link className="nav-link nav-login" to="/login">
                Đăng nhập
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
