export type Language = 'gu' | 'hi' | 'en';

export type UserRole = 'salesman' | 'admin';

export interface Salesman {
  id: string;
  name: string;
  mobile: string;
  employeeId: string;
  routeId: string;
  customProfitPct?: number; // Optional salesman specific profit rate
  status: 'active' | 'inactive';
  pin: string;
}

export interface Route {
  id: string;
  name: string;
  expectedCollection: number;
}

export interface CashBreakdown {
  [denom: number]: number;
  500: number;
  200: number;
  100: number;
  50: number;
  20: number;
  10: number;
  5: number;
  2: number;
  1: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  editedBy: string;
  oldTotal: number;
  newTotal: number;
  oldCash: number;
  newCash: number;
  oldOnline: number;
  newOnline: number;
  reason?: string;
}

export interface HisabEntry {
  id: string;
  salesmanId: string;
  salesmanName: string;
  routeId: string;
  routeName: string;
  date: string; // YYYY-MM-DD
  cashBreakdown: CashBreakdown;
  cashAmount: number;
  onlineAmount: number;
  marketOutstandingAmount?: number;
  onlineMode?: 'UPI' | 'Bank Transfer' | 'Other' | 'Combined';
  totalAmount: number;
  profitPct: number;
  profitAmount: number;
  expectedCollection: number;
  difference: number; // actual - expected
  status: 'submitted' | 'synced_offline';
  createdAt: string;
  updatedAt?: string;
  auditLogs?: AuditLog[];
}

export interface AppSettings {
  businessName: string;
  subtitle: string;
  defaultProfitPct: number;
  allowSalesmanProfitOverride: boolean;
  language: Language;
  adminPin: string;
}

export interface PendingPayment {
  id: string;
  customerName: string;
  mobile: string;
  amount: number;
  routeName: string;
  salesmanId: string;
  salesmanName: string;
  dueDate: string; // YYYY-MM-DD
  status: 'pending' | 'collected';
  notes?: string;
  createdAt: string;
  collectedAt?: string;
}
