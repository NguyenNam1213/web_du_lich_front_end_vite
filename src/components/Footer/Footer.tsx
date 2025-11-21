const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-10 border-t">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">

        {/* Cột 1 */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-gray-900">Khám phá</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-orange-500 cursor-pointer">Điểm đến</a></li>
            <li><a className="hover:text-orange-500 cursor-pointer">Ưu đãi</a></li>
            <li><a className="hover:text-orange-500 cursor-pointer">Blog du lịch</a></li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-gray-900">Dành cho bạn</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-orange-500 cursor-pointer">Hỗ trợ khách hàng</a></li>
            <li><a className="hover:text-orange-500 cursor-pointer">Trung tâm trợ giúp</a></li>
            <li><a className="hover:text-orange-500 cursor-pointer">Cách đặt chỗ</a></li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-gray-900">Về chúng tôi</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-orange-500 cursor-pointer">Giới thiệu</a></li>
            <li><a className="hover:text-orange-500 cursor-pointer">Chính sách bảo mật</a></li>
            <li><a className="hover:text-orange-500 cursor-pointer">Điều khoản</a></li>
          </ul>
        </div>

        {/* Cột 4 */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-gray-900">Kết nối</h4>
          <ul className="space-y-2 text-sm">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>YouTube</li>
          </ul>
        </div>

      </div>

      <div className="border-t py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Tour Booking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;