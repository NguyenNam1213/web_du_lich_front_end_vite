import React, { useState } from "react";
import "./SupplierRequest.css";
import ProfileSidebar from "../../components/ProfileSidebar/ProfileSidebar";
import {
  SupplierRequestService,
  RequestType,
  CreateSupplierRequestDto,
} from "../../api/supplierRequest.service";
import { toastService } from "../../utils/toast";
import { DestinationService } from "../../api/destination.service";
import imageCompression from "browser-image-compression";

const SupplierRequest = () => {
  const [requestType, setRequestType] = useState<RequestType>(
    RequestType.BECOME_SUPPLIER
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form data for become_supplier
  const [supplierData, setSupplierData] = useState({
    companyName: "",
    businessEmail: "",
    phone: "",
    address: "",
    commissionRate: 15,
  });

  // Form data for add_location
  const [locationData, setLocationData] = useState({
    name: "",
    code: "", // For country
    countryCode: "", // For city
    cityId: "", // For destination
    slug: "",
    imageUrl: "",
    description: "",
  });

  // Image upload states for destination
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const requestData: CreateSupplierRequestDto = {
        type: requestType,
        requestData: {},
      };

      if (requestType === RequestType.BECOME_SUPPLIER) {
        if (!supplierData.companyName) {
          toastService.error("Vui lòng nhập tên công ty");
          setLoading(false);
          return;
        }
        requestData.requestData = { ...supplierData };
      } else {
        if (!locationData.name) {
          toastService.error("Vui lòng nhập tên location");
          setLoading(false);
          return;
        }

        if (requestType === RequestType.ADD_COUNTRY) {
          if (!locationData.code) {
            toastService.error("Vui lòng nhập mã quốc gia (2 ký tự)");
            setLoading(false);
            return;
          }
          requestData.requestData = {
            name: locationData.name,
            code: locationData.code,
          };
        } else if (requestType === RequestType.ADD_CITY) {
          if (!locationData.countryCode) {
            toastService.error("Vui lòng nhập mã quốc gia");
            setLoading(false);
            return;
          }
          requestData.requestData = {
            name: locationData.name,
            countryCode: locationData.countryCode,
          };
        } else if (requestType === RequestType.ADD_DESTINATION) {
          if (!locationData.cityId) {
            toastService.error("Vui lòng nhập City ID");
            setLoading(false);
            return;
          }
          requestData.requestData = {
            name: locationData.name,
            cityId: parseInt(locationData.cityId),
            slug: locationData.slug,
            imageUrl: locationData.imageUrl,
            description: locationData.description,
          };
        }
      }

      await SupplierRequestService.create(requestData);
      toastService.success("Gửi request thành công! Vui lòng chờ admin xử lý.");

      // Reset form
      if (requestType === RequestType.BECOME_SUPPLIER) {
        setSupplierData({
          companyName: "",
          businessEmail: "",
          phone: "",
          address: "",
          commissionRate: 15,
        });
      } else {
        setLocationData({
          name: "",
          code: "",
          countryCode: "",
          cityId: "",
          slug: "",
          imageUrl: "",
          description: "",
        });
        // Reset image upload states
        setSelectedFile(null);
        setPreviewUrl("");
        setUploadProgress(0);
      }
    } catch (error: any) {
      toastService.error(
        error.response?.data?.message ||
          error.message ||
          "Gửi request thất bại. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection for destination image
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toastService.error("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toastService.error("Kích thước ảnh không được vượt quá 10MB");
      return;
    }

    try {
      setCompressing(true);

      // Cấu hình nén ảnh
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: file.type,
      };

      const compressedFile = await imageCompression(file, options);
      
      setSelectedFile(compressedFile);
      
      // Tạo preview URL từ file đã nén
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Lỗi nén ảnh:", error);
      toastService.error("Không thể xử lý ảnh. Vui lòng thử ảnh khác.");
    } finally {
      setCompressing(false);
    }
  };

  // Upload image to server
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      
      const res = await DestinationService.uploadImage(
        selectedFile,
        (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 100)
          );
          setUploadProgress(percentCompleted);
        }
      );
      
      const uploadedUrl = res.data.url;
      setLocationData({
        ...locationData,
        imageUrl: uploadedUrl,
      });
      setPreviewUrl(uploadedUrl);
      
      toastService.success("✅ Tải ảnh lên thành công!");
    } catch (err: any) {
      console.error(err);
      
      // Xử lý các loại lỗi khác nhau
      if (err.code === 'ECONNABORTED') {
        toastService.error(
          "⏱️ Upload quá lâu (>30s). Vui lòng:\n" +
          "1. Chọn ảnh có kích thước nhỏ hơn\n" +
          "2. Kiểm tra kết nối mạng\n" +
          "3. Thử lại sau"
        );
      } else if (err.response?.status === 413) {
        toastService.error("❌ File quá lớn. Vui lòng chọn ảnh nhỏ hơn.");
      } else if (err.response?.status === 500) {
        toastService.error("❌ Lỗi server. Vui lòng liên hệ quản trị viên.");
      } else {
        toastService.error("❌ Tải ảnh lên thất bại. Vui lòng thử lại.");
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="supplier-request-container">
      <ProfileSidebar />

      <div className="supplier-request-main">
        <h2>Yêu cầu từ Supplier</h2>
        <p className="desc">
          Gửi yêu cầu để trở thành supplier hoặc thêm địa điểm mới vào hệ thống.
          Admin sẽ xem xét và phản hồi yêu cầu của bạn.
        </p>

        {message && (
          <div
            className={`message ${message.type === "success" ? "success" : "error"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="request-form">
          {/* Request Type Selection */}
          <div className="form-group">
            <label>Loại yêu cầu *</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequestType)}
              className="form-select"
            >
              <option value={RequestType.BECOME_SUPPLIER}>
                Đăng ký trở thành Supplier
              </option>
              <option value={RequestType.ADD_COUNTRY}>Thêm Quốc gia</option>
              <option value={RequestType.ADD_CITY}>Thêm Thành phố</option>
              <option value={RequestType.ADD_DESTINATION}>
                Thêm Điểm đến
              </option>
            </select>
          </div>

          {/* Become Supplier Form */}
          {requestType === RequestType.BECOME_SUPPLIER && (
            <>
              <div className="form-group">
                <label>Tên công ty *</label>
                <input
                  type="text"
                  value={supplierData.companyName}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      companyName: e.target.value,
                    })
                  }
                  className="form-input"
                  required
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div className="form-group">
                <label>Email công ty</label>
                <input
                  type="email"
                  value={supplierData.businessEmail}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      businessEmail: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="contact@company.com"
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={supplierData.phone}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      phone: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="+84901234567"
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <textarea
                  value={supplierData.address}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      address: e.target.value,
                    })
                  }
                  className="form-textarea"
                  rows={3}
                  placeholder="Nhập địa chỉ công ty"
                />
              </div>

              <div className="form-group">
                <label>Tỉ lệ hoa hồng (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={supplierData.commissionRate}
                  onChange={(e) =>
                    setSupplierData({
                      ...supplierData,
                      commissionRate: parseFloat(e.target.value) || 15,
                    })
                  }
                  className="form-input"
                />
              </div>
            </>
          )}

          {/* Add Country Form */}
          {requestType === RequestType.ADD_COUNTRY && (
            <>
              <div className="form-group">
                <label>Tên quốc gia *</label>
                <input
                  type="text"
                  value={locationData.name}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      name: e.target.value,
                    })
                  }
                  className="form-input"
                  required
                  placeholder="Ví dụ: Thailand"
                />
              </div>

              <div className="form-group">
                <label>Mã quốc gia (2 ký tự) *</label>
                <input
                  type="text"
                  value={locationData.code}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="form-input"
                  required
                  maxLength={2}
                  placeholder="TH"
                />
              </div>
            </>
          )}

          {/* Add City Form */}
          {requestType === RequestType.ADD_CITY && (
            <>
              <div className="form-group">
                <label>Tên thành phố *</label>
                <input
                  type="text"
                  value={locationData.name}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      name: e.target.value,
                    })
                  }
                  className="form-input"
                  required
                  placeholder="Ví dụ: Bangkok"
                />
              </div>

              <div className="form-group">
                <label>Mã quốc gia *</label>
                <input
                  type="text"
                  value={locationData.countryCode}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      countryCode: e.target.value.toUpperCase(),
                    })
                  }
                  className="form-input"
                  required
                  maxLength={2}
                  placeholder="TH"
                />
              </div>
            </>
          )}

          {/* Add Destination Form */}
          {requestType === RequestType.ADD_DESTINATION && (
            <>
              <div className="form-group">
                <label>Tên điểm đến *</label>
                <input
                  type="text"
                  value={locationData.name}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      name: e.target.value,
                    })
                  }
                  className="form-input"
                  required
                  placeholder="Ví dụ: Wat Pho Temple"
                />
              </div>

              <div className="form-group">
                <label>City ID *</label>
                <input
                  type="number"
                  value={locationData.cityId}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      cityId: e.target.value,
                    })
                  }
                  className="form-input"
                  required
                  placeholder="123"
                />
              </div>

              <div className="form-group">
                <label>Slug (URL-friendly)</label>
                <input
                  type="text"
                  value={locationData.slug}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      slug: e.target.value,
                    })
                  }
                  className="form-input"
                  placeholder="wat-pho-temple (để trống sẽ tự động tạo)"
                />
              </div>

              <div className="form-group">
                <label>Ảnh điểm đến</label>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={compressing || uploading}
                    style={{ marginBottom: "10px" }}
                  />
                  {compressing && <p>Đang nén ảnh...</p>}
                  {selectedFile && !uploading && (
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={uploading}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#1890ff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                    >
                      {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
                    </button>
                  )}
                  {uploading && (
                    <div style={{ marginTop: "10px" }}>
                      <div
                        style={{
                          width: "100%",
                          height: "20px",
                          backgroundColor: "#f0f0f0",
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${uploadProgress}%`,
                            height: "100%",
                            backgroundColor: "#1890ff",
                            transition: "width 0.3s",
                          }}
                        />
                      </div>
                      <p style={{ marginTop: "5px", fontSize: "12px" }}>
                        {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
                {previewUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "200px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}
                {locationData.imageUrl && !previewUrl && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={locationData.imageUrl}
                      alt="Current"
                      style={{
                        maxWidth: "300px",
                        maxHeight: "200px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Mô tả</label>
                <textarea
                  value={locationData.description}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      description: e.target.value,
                    })
                  }
                  className="form-textarea"
                  rows={4}
                  placeholder="Mô tả về điểm đến..."
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupplierRequest;

