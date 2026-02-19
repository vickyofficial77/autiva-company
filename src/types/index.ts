export type Level = "L3" | "L4" | "L5";
export type UserRole = "student" | "admin";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  level: Level;
  role: UserRole;
  active: boolean;
  createdAt: any;
};

export type Payment = {
  id: string;
  uid: string;
  amount: number; // 10000
  status: "pending" | "verified" | "rejected";
  transactionId: string;       // ✅ required
  phoneUsedToPay?: string;     // optional
  createdAt: any;
  verifiedAt?: any;
  verifiedBy?: string;
};

export type ActivationCode = {
  id: string;
  uid: string;
  used: boolean;
  createdAt: any;
  usedAt?: any;
  createdBy: string;
};

export type Task = {
  id: string;
  uid: string;
  title: string;
  description: string;
  status: "assigned" | "submitted" | "approved" | "rejected";
  createdAt: any;
  updatedAt?: any;
};
