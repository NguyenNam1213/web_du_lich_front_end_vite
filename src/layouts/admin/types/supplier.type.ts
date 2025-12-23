export interface Supplier {
  id: string;
  companyName: string;
  businessEmail?: string | null;
  phone?: string | null;
  address?: string | null;
  commissionRate: number;
  userId: string;
  user?: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    role: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupplierState {
  suppliers: Supplier[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

