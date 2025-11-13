import { Supplier } from "../../types/supplier";

interface TourSupplierInfoProps {
  supplier?: Supplier;
}

const TourSupplierInfo: React.FC<TourSupplierInfoProps> = ({ supplier }) => {
  if (!supplier) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Nhà cung cấp</h2>
        <p className="text-gray-500">Không có thông tin nhà cung cấp.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Nhà cung cấp</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Tên công ty</span>
          <span>{supplier.companyName}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Email liên hệ</span>
          <span>{supplier.businessEmail}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Số điện thoại</span>
          <span>{supplier.phone}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Địa chỉ</span>
          <span>{supplier.address}</span>
        </div>

        {/* <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Hoa hồng</span>
          <span>{supplier.commissionRate}%</span>
        </div> */}
      </div>
    </div>
  );
};

export default TourSupplierInfo;
