export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "supplier";
  status: "active" | "inactive" | "pending";
}