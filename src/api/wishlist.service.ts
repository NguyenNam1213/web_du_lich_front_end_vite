import api from "./auth";

class WishlistService {
  // Thêm activity vào wishlist
  addToWishlist(activityId: number) {
    return api.post(`/wishlist/${activityId}`);
  }

  // Xóa activity khỏi wishlist
  removeFromWishlist(activityId: number) {
    return api.delete(`/wishlist/${activityId}`);
  }

  // Lấy toàn bộ wishlist của user đã đăng nhập
  getMyWishlist() {
    return api.get("/wishlist");
  }
}

export default new WishlistService();
