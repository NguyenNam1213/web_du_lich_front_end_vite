import React from 'react'
import './Navbar.css'
import {Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div>
      <nav className="NavbarItems">
        <h1 className="navbar-logo">Travel</h1>
        <div className='nav-search'>
            <input type='text' placeholder='Tìm theo điểm đến, hoạt động' className='search-input'></input>
        </div>
        <ul className="nav-menu">
          <li>
            <a className="nav-link" href="/">
              Mơ ứng dụng
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
          <li>
            <Link className="nav-link" to ="/signup">
              Đăng kí
            </Link>
          </li>
          <li>
            <Link className="nav-link nav-login" to ="/login">
              Đăng nhập
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar