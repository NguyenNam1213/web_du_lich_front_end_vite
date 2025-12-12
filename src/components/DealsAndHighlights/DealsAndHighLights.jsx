import React, { useState } from "react";
import deal1 from "../../assets/Coupon.webp";
import "./DealsAndHighlights.css";
import deal2 from "../../assets/445930-PF8AFS-479.jpg";
import deal3 from "../../assets/455006-PFM7O5-973.jpg";
import deal4 from "../../assets/459388-PFNX6X-590.jpg";
import tour1 from "../../assets/pexels-alfonso-escalante-1319242-2533090.jpg";
import tour2 from "../../assets/pexels-olenkabohovyk-3686798.jpg";
import tour3 from "../../assets/pexels-robinerino-3084564.jpg";
import tour4 from "../../assets/pexels-the-world-hopper-929714-1851481.jpg";
import tour5 from "../../assets/pexels-thiagomobile-2928782.jpg";
import tour6 from "../../assets/pexels-tommymila-2764743.jpg";

const DealsAndHighLights = () => {
  const deals = [deal1, deal1, deal2, deal3, deal4];
const tours = [
  {
    img: tour1,
    name: "Khám phá miền hoang dã",
    category: "Tour",
    location: "Đà Nẵng",
  },
  {
    img: tour3,
    name: "Tour Khám Phá Vịnh Hạ Long",
    category: "Tour",
    location: "Hải Phòng",
  },
  {
    img: tour2,
    name: "Sapa: Tour Instagram Làng Cát Cát",
    category: "Tour",
    location: "Đà Nẵng",
  },
  {
    img: tour4,
    name: "Kim tự tháp Ai Cập",
    category: "Du lịch nước ngoài",
    location: "Ai cập",
  },
  {
    img: tour5,
    name: "Khám phá New York",
    category: "Du lịch nước ngoài",
    location: "New York",
  },
  {
    img: tour6,
    name: "Tour Phú Quốc Tự Do",
    category: "Tour",
    location: "Phú Quốc",
  },
];


  const itemsPerSlide = 3;
  const maxDealSlide = Math.ceil(deals.length / itemsPerSlide) - 1;
  const maxTourSlide = Math.ceil(tours.length / itemsPerSlide) - 1;

  const [currentDeal, setCurrentDeal] = useState(0);
  const [currentTour, setCurrentTour] = useState(0);

  // 👉 Hàm chuyển deal
  const nextDeal = () =>
    setCurrentDeal((prev) => (prev === maxDealSlide ? 0 : prev + 1));
  const prevDeal = () =>
    setCurrentDeal((prev) => (prev === 0 ? maxDealSlide : prev - 1));

  // 👉 Hàm chuyển tour
  const nextTour = () =>
    setCurrentTour((prev) => (prev === maxTourSlide ? 0 : prev + 1));
  const prevTour = () =>
    setCurrentTour((prev) => (prev === 0 ? maxTourSlide : prev - 1));

  // 👉 Lấy danh sách hiển thị theo slide
  const visibleDeals = deals.slice(
    currentDeal * itemsPerSlide,
    currentDeal * itemsPerSlide + itemsPerSlide
  );
  const visibleTours = tours.slice(
    currentTour * itemsPerSlide,
    currentTour * itemsPerSlide + itemsPerSlide
  );

  return (
    <div>
      {/* --- ƯU ĐÃI --- */}
      <div className="deals-section">
        <h2 className="section-title">Ưu đãi cho bạn</h2>
        <div className="deals-container">
          <button className="nav-btn left" onClick={prevDeal}>
            ‹
          </button>
          <div className="deals-content">
            {visibleDeals.map((img, index) => (
              <div key={index} className="deals-card">
                <img src={img} alt={`deal${index + 1}`} />
              </div>
            ))}
          </div>
          <button className="nav-btn right" onClick={nextDeal}>
            ›
          </button>
        </div>
      </div>

      {/* --- CÁC HOẠT ĐỘNG NỔI BẬT ---
      <h2 className="section-title">Các hoạt động nổi bật</h2>
      <div className="activities-container">
        <button className="nav-btn left" onClick={prevTour}>
          ‹
        </button>
        <div className="activities-grid">
          {visibleTours.map((tour, index) => (
            <div key={index} className="activities-card">
              <img src={tour.img} alt={tour.name} />
              <h3>{tour.name}</h3>
              <p>{tour.location}</p>
              <p>{tour.category}</p>
              
            </div>
          ))}
        </div>
        <button className="nav-btn right" onClick={nextTour}>
          ›
        </button>
      </div> */}
    </div>
  );
};

export default DealsAndHighLights;
