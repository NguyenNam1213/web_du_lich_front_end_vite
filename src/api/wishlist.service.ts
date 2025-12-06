import api from "./auth";

class WishlistService {
  addToWishlist(activityId: number) {
    return api.post(`/wishlist/${activityId}`);
  }

  removeFromWishlist(activityId: number) {
    return api.delete(`/wishlist/${activityId}`);
  }

  getMyWishlist() {
    return api.get("/wishlist");
  }
}

export default new WishlistService();
