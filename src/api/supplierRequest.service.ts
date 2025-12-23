import { AxiosResponse } from "axios";
import instance from "./api";

export enum RequestType {
  BECOME_SUPPLIER = "become_supplier",
  ADD_COUNTRY = "add_country",
  ADD_CITY = "add_city",
  ADD_DESTINATION = "add_destination",
}

export enum RequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface SupplierRequest {
  id: string;
  userId: number;
  type: RequestType;
  status: RequestStatus;
  requestData: any;
  adminNotes?: string;
  processedBy?: number;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  user?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export interface CreateSupplierRequestDto {
  type: RequestType;
  requestData: {
    // For become_supplier
    companyName?: string;
    businessEmail?: string;
    phone?: string;
    address?: string;
    commissionRate?: number;
    // For add_location
    name?: string;
    code?: string; // For country
    countryCode?: string; // For city
    cityId?: number; // For destination
    slug?: string; // For destination
    imageUrl?: string; // For destination
    description?: string; // For destination
  };
}

export interface UpdateRequestStatusDto {
  adminNotes?: string;
}

export interface FilterRequestsDto {
  type?: RequestType;
  status?: RequestStatus;
}

const BASE_URL = "/supplier-requests";

export const SupplierRequestService = {
  // Tạo request mới
  create(data: CreateSupplierRequestDto): Promise<AxiosResponse<SupplierRequest>> {
    return instance.post(BASE_URL, data);
  },

  // Lấy tất cả requests (admin)
  getAll(filters?: FilterRequestsDto & { page?: number; limit?: number }): Promise<AxiosResponse<{
    requests: SupplierRequest[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>> {
    return instance.get(BASE_URL, { params: filters });
  },

  // Lấy requests của user hiện tại
  getMyRequests(filters?: FilterRequestsDto): Promise<AxiosResponse<SupplierRequest[]>> {
    return instance.get(`${BASE_URL}/my`, { params: filters });
  },

  // Lấy chi tiết request
  getById(id: string): Promise<AxiosResponse<SupplierRequest>> {
    return instance.get(`${BASE_URL}/${id}`);
  },

  // Admin approve request
  approve(id: string, adminNotes?: string): Promise<AxiosResponse<SupplierRequest>> {
    return instance.patch(`${BASE_URL}/${id}/approve`, { adminNotes });
  },

  // Admin reject request
  reject(id: string, adminNotes?: string): Promise<AxiosResponse<SupplierRequest>> {
    return instance.patch(`${BASE_URL}/${id}/reject`, { adminNotes });
  },

  // Delete request (nếu cần)
  delete(id: string): Promise<AxiosResponse<void>> {
    return instance.delete(`${BASE_URL}/${id}`);
  },
};

