import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WishlistService from "../../api/wishlist.service";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import { AiOutlineDelete } from "react-icons/ai";

const WishList = () => {
	const [wishlist, setWishlist] = useState([]);
	const navigate = useNavigate();

	const loadWishlist = async () => {
		try {
			const res = await WishlistService.getMyWishlist();
			setWishlist(res.data || []);
		} catch (err) {
			console.error(err);
		}
	};

	const handleRemove = async (activityId: number) => {
		try {
			await WishlistService.removeFromWishlist(activityId);
			// reload list sau khi xoá
			loadWishlist();
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadWishlist();
	}, []);

	return (
		<div className="flex gap-[40px] p-[40px_80px] bg-[#f9f9fb] font-[Segoe_UI,sans-serif]">
			<div>
				<ProfileSidebar />
			</div>

			{/* Wishlist Section */}
			<div className="flex-1 bg-white rounded-[10px] p-[30px_40px] shadow-[0_0_5px_rgba(0,0,0,0.1)]">

				<h2 className="text-[24px] font-semibold mb-[20px]">My Wishlist</h2>

				{wishlist.length === 0 ? (
					<p className="text-gray-500">Bạn chưa có wishlist nào.</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">

						{wishlist.map((item: any) => {
							const tour = item.activity;

							return (
								<div
									key={item.id}
									className="relative border rounded-[10px] shadow-sm hover:shadow-md transition p-[15px] cursor-pointer bg-white"
								>
									{/* Xóa */}
									<button
										onClick={(e) => {
											e.stopPropagation(); 
											handleRemove(tour.id);
										}}
										className="absolute top-[10px] right-[10px] text-red-500 hover:text-red-600"
									>
										<AiOutlineDelete size={22} />
									</button>

									{/* Nội dung */}
									<div onClick={() => navigate(`/tours/${tour.id}`)}>
										<h3 className="text-[18px] font-semibold mb-[8px]">
											{tour.name}
										</h3>

										<p className="text-gray-600 text-[14px] mb-[6px]">
											⏱ Thời lượng: {tour.duration} giờ
										</p>

										<p className="text-gray-600 text-[14px] mb-[6px]">
											⭐ Đánh giá: {tour.rating}
										</p>

										<p className="text-[#ff5a5f] font-semibold">
											{tour.price} {tour.currency}
										</p>
									</div>
								</div>
							);
						})}

					</div>
				)}

			</div>
		</div>
	);
};

export default WishList;
