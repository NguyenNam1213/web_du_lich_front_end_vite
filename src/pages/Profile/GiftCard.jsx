import { useState } from "react";
import { sendGiftCard } from "../../api/gifftcard";

import earth_icon from "../../assets/earth_2072130.png";
import clock_icon from "../../assets/vecteezy_clock-icon-transparent-background_50757348.png";
import lock_icon from "../../assets/lock.png";
import mobile_icon from "../../assets/application.png";
import card_icon from "../../assets/credit-card.png";
import gift_icon from "../../assets/gift.png";

import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import ProfilePicture from "../../assets/cesar-rincon-XHVpWcr5grQ-unsplash.jpg";
import "./GiftCard.css";

export default function GiftCard() {
  const [userData] = useState({
    image: ProfilePicture,
  });

  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Thẻ quà tặng có hiệu lực trong bao lâu?",
      answer:
        "Thẻ quà tặng có hiệu lực trong 3 năm kể từ ngày mua. Bạn có thể sử dụng chúng bất cứ lúc nào trong thời gian này để đặt những trải nghiệm du lịch tuyệt vời.",
    },
    {
      question: "Tôi có thể chuyển thẻ quà tặng của mình cho người khác không?",
      answer:
        "Có! Thẻ quà tặng có thể chuyển nhượng cho người khác. Chỉ cần cung cấp cho họ mã thẻ quà tặng và họ có thể sử dụng nó trên tài khoản của mình.",
    },
    {
      question: "Nếu còn dư số dư thì sao?",
      answer:
        "Số dư còn lại sẽ được giữ trên thẻ quà tặng của bạn và có thể sử dụng cho các lần đặt chỗ trong tương lai. Không có ngày hết hạn đối với số dư còn lại.",
    },
    {
      question: "Tôi có thể được hoàn tiền cho thẻ quà tặng không?",
      answer:
        "Thẻ quà tặng không thể hoàn lại tiền, nhưng chúng có thể được sử dụng cho mọi trải nghiệm trên nền tảng của chúng tôi. Nếu bạn gặp sự cố, hãy liên hệ với đội hỗ trợ của chúng tôi.",
    },
    {
      question: "Thẻ quà tặng có hoạt động quốc tế không?",
      answer:
        "Có! Thẻ quà tặng của chúng tôi hoạt động cho các trải nghiệm trên toàn thế giới. Bạn có thể đặt tour, hoạt động và gói du lịch từ bất kỳ quốc gia nào.",
    },
  ];

  
  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setModalOpen(true);
  };

 
  const handleSendGiftCard = async () => {
    if (!recipientEmail) {
      alert("Vui lòng nhập email người nhận");
      return;
    }

    try {
      await sendGiftCard(
        recipientEmail,
        Number(selectedAmount.replace(/\./g, "")),
        message
      );

      alert("Gửi thẻ quà tặng thành công!");

      setModalOpen(false);
      setRecipientEmail("");
      setMessage("");
    } catch (error) {
      alert(error.response?.data?.message || "Gửi thẻ quà tặng thất bại.");
      console.error("Gửi thẻ quà tặng thất bại:", error);
    }
  };

  return (
    <div className="gift-card-container">
      <div className="side-bar">
        <ProfileSidebar userData={userData} />
      </div>

      <div className="gift-card-sections">
        {/* ====== HERO ====== */}
        <section className="gift-card-hero">
          <h1>Trao Tặng Món Quà Phiêu Lưu</h1>
          <p>
            Hãy để người thân của bạn khám phá thế giới với thẻ quà tặng linh
            hoạt của chúng tôi. Hoàn hảo cho mọi dịp.
          </p>
          <button className="cta-button">Mua Thẻ Quà Tặng</button>
          <button className="cta-button-secondary">Tìm Hiểu Thêm</button>
        </section>

        {/* ====== MỆNH GIÁ ====== */}
        <section className="denominations-section">
          <h2 className="section-title">Chọn Mệnh Giá</h2>
          <div className="denominations-grid">
            {["250.000", "500.000", "1.000.000", "2.500.000"].map((amount) => (
              <div key={amount} className="denomination-card">
                <div className="denomination-amount">{amount} VNĐ</div>
                <div className="denomination-label">Thẻ Quà Tặng</div>
                <button onClick={() => handleSelectAmount(amount)}>Chọn</button>
              </div>
            ))}
          </div>
        </section>

        {/* ====== CÁC LỢI ÍCH ====== */}
        <section className="benefits-section">
          <h2 className="section-title">
            Tại Sao Chọn Thẻ Quà Tặng Của Chúng Tôi?
          </h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={earth_icon} alt="Biểu tượng trái đất" />
              </div>
              <h3>Trải Nghiệm Toàn Cầu</h3>
              <p>
                Truy cập hàng ngàn tour và hoạt động tại hơn 150 điểm đến trên
                toàn thế giới.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={clock_icon} alt="Biểu tượng đồng hồ" />
              </div>
              <h3>Không Giới Hạn Thời Gian</h3>
              <p>
                Sử dụng thẻ quà tặng của bạn bất cứ khi nào bạn muốn. Có hiệu
                lực trong 3 năm không phí ẩn.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={gift_icon} alt="Biểu tượng quà tặng" />
              </div>
              <h3>Món Quà Hoàn Hảo</h3>
              <p>
                Thẻ kỹ thuật số hoặc thẻ vật lý được thiết kế đẹp mắt, sẵn sàng
                để trao tặng ngay lập tức.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={card_icon} alt="Biểu tượng thẻ" />
              </div>
              <h3>Dễ Sử Dụng</h3>
              <p>
                Chỉ cần nhập mã thẻ quà tặng của bạn khi thanh toán để áp dụng
                số dư.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={lock_icon} alt="Biểu tượng khóa" />
              </div>
              <h3>Bảo Mật</h3>
              <p>
                Thẻ quà tặng của bạn được bảo vệ bằng các biện pháp bảo mật hàng
                đầu trong ngành.
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">
                <img src={mobile_icon} alt="Biểu tượng di động" />
              </div>
              <h3>Thân Thiện với di động</h3>
              <p>
                Quản lý và sử dụng thẻ quà tặng của bạn từ mọi thiết bị, mọi nơi
                trên thế giới.
              </p>
            </div>
          </div>
        </section>

        {/* ====== Cách thức hoạt động ====== */}
        <section className="how-it-works">
          <h2 className="section-title">Cách Thức Hoạt Động</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Mua Hàng</h3>
              <p>
                Chọn mệnh giá thẻ quà tặng mong muốn và hoàn tất giao dịch mua
                một cách an toàn.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Nhận Thẻ</h3>
              <p>
                Nhận mã thẻ quà tặng qua email ngay lập tức hoặc chọn giao hàng
                vật lý.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Chia Sẻ</h3>
              <p>
                Gửi thẻ quà tặng cho người thân cùng một lời nhắn cá nhân hóa.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Đổi Thưởng</h3>
              <p>
                Người nhận nhập mã khi thanh toán để đặt trải nghiệm mơ ước của
                họ.
              </p>
            </div>
          </div>
        </section>

        {/* ====== FAQ ====== */}
        <section className="faq-section">
          <h2 className="section-title">Câu Hỏi Thường Gặp</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? "active" : ""}`}
              >
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <span className="faq-toggle">▼</span>
                </div>
                <div className="faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* ==================== MODAL GỬI GIFTCARD ================= */}
      {/* ========================================================= */}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Gửi Thẻ Quà Tặng</h3>

            <p>
              Mệnh giá: <b>{selectedAmount} VNĐ</b>
            </p>

            <label>Email người nhận</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />

            <label>Lời nhắn (không bắt buộc)</label>
            <textarea
              placeholder="Nhập lời nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setModalOpen(false)}
              >
                Hủy
              </button>
              <button className="btn-confirm" onClick={handleSendGiftCard}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
