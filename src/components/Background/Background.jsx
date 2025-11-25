import React, { useState } from 'react'
import Bg1 from "../../assets/pexels-kun-fotografi-506396-1239228.jpg"
import Bg2 from "../../assets/pexels-kyleloftusstudios-2734521.jpg"
import Bg3 from "../../assets/pexels-gaetanthurin-3163927.jpg"
import './Background.css'

const images = [Bg1, Bg2, Bg3];

const Background = () => {
  const [current, setCurrent] = useState(0);
  const nextSlide = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1)
  }
  const prevSlide = () =>{
    setCurrent(current === 0 ? images.length - 1 : current - 1)
  }
  return (
    <>
      <div className="slider">
        <button className="arrow left" onClick={prevSlide}> ❮ </button>
        <img src={images[current]} alt="slider" className="slide-img" />
        <div className="bg-content">
          <h1>Khám phá phiên bản tuyệt nhất của bạn</h1>
          <p>Mở ra chân trời mới</p>
          <div className="search-box">
            <input type="text" placeholder="Bạn muốn đi đâu?" />
            <button>Khám phá</button>
          </div>
        </div>

        <button className="arrow right" onClick={nextSlide}> ❯ </button>
      </div>
    </>
  );
}

export default Background