import {
  CreatePaymentDto,
  UpdatePaymentDto,
  Payment,
  BankInfo,
} from "../types/payment";
import api from "./auth";

class PaymentService {
  async createPayment(data: CreatePaymentDto): Promise<Payment> {
    const res = await api.post("/payments", data);
    return res.data;
  }

  async getPayments(): Promise<Payment[]> {
    const res = await api.get("/payments");
    return res.data;
  }

  async getPaymentById(id: number): Promise<Payment> {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  }

  async updatePayment(id: number, data: UpdatePaymentDto): Promise<Payment> {
    const res = await api.patch(`/payments/${id}`, data);
    return res.data;
  }

  async deletePayment(id: number): Promise<void> {
    await api.delete(`/payments/${id}`);
  }

  async getBankInfo(): Promise<BankInfo> {
    const res = await api.get("/payments/bank-info");
    return res.data;
  }
}

export default new PaymentService();
