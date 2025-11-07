import { PaymentStatus } from "./booking";

export interface Payment {
  id: number;
  amount: number;
  status: PaymentStatus;
}