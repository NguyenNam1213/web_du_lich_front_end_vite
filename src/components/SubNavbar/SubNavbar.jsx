import React from 'react'
import './SubNavBar.css'

const SubNavbar = () => {
  return (
    <div className='subnavbar'>
        <ul className='subnav-menu'>
            <li><a href="/">Khu vực phổ biến</a></li>
            <li><a href="/">Điểm đến phổ biến</a></li>
            <li><a href="/">Địa danh phổ biến</a></li>
            <li><a href="/">Khám phá Travel</a></li>
            <li><a href="/">Phiếu quà tặng Travel</a></li>
      </ul>
    </div>
  )
}

export default SubNavbar