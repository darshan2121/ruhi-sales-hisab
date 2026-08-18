import type { Salesman, Route, HisabEntry, AppSettings } from '../types';
import { getTodayDateString } from '../utils/formatters';

export const initialAppSettings: AppSettings = {
  businessName: 'Ruhi Sales',
  subtitle: 'Authorized Distributor - Namkeen & Foods',
  defaultProfitPct: 7,
  allowSalesmanProfitOverride: true,
  language: 'gu', // Gujarati default per prompt requirement!
  adminPin: '1234',
};

export const initialRoutes: Route[] = [
  { id: 'r1', name: 'Ahmedabad East (અમદાવાદ ઈસ્ટ)', expectedCollection: 15000 },
  { id: 'r2', name: 'Ahmedabad West (અમદાવાદ વેસ્ટ)', expectedCollection: 18000 },
  { id: 'r3', name: 'Gandhinagar Route (ગાંધીનગર)', expectedCollection: 12000 },
  { id: 'r4', name: 'Sanand / Changodar Route (સાણંદ)', expectedCollection: 14000 },
];

export const initialSalesmen: Salesman[] = [
  {
    id: 's1',
    name: 'Ramesh Patel (રમેશ)',
    mobile: '9876543210',
    employeeId: 'EMP-101',
    routeId: 'r1',
    customProfitPct: 7,
    status: 'active',
    pin: '1234',
  },
  {
    id: 's2',
    name: 'Mahesh Shah (મહેશ)',
    mobile: '9876543211',
    employeeId: 'EMP-102',
    routeId: 'r2',
    customProfitPct: 7,
    status: 'active',
    pin: '1234',
  },
  {
    id: 's3',
    name: 'Suresh Kumar (સુરેશ)',
    mobile: '9876543212',
    employeeId: 'EMP-103',
    routeId: 'r3',
    customProfitPct: 6,
    status: 'active',
    pin: '1234',
  },
];

// Generate past 14 days of realistic entries for Ramesh & Mahesh
const today = new Date();

const generatePastEntries = (): HisabEntry[] => {
  const entries: HisabEntry[] = [];
  
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Entry for Ramesh
    const rameshCash = 8000 + Math.floor(Math.random() * 3000);
    const rameshOnline = 3000 + Math.floor(Math.random() * 2000);
    const rameshTotal = rameshCash + rameshOnline;
    const rameshProfit = Math.round(rameshTotal * 0.07);

    entries.push({
      id: `entry-r-${i}`,
      salesmanId: 's1',
      salesmanName: 'Ramesh Patel (રમેશ)',
      routeId: 'r1',
      routeName: 'Ahmedabad East (અમદાવાદ ઈસ્ટ)',
      date: dateStr,
      cashBreakdown: {
        500: Math.floor(rameshCash * 0.6 / 500),
        200: Math.floor(rameshCash * 0.2 / 200),
        100: Math.floor(rameshCash * 0.15 / 100),
        50: 4,
        20: 5,
        10: 10,
        5: 0,
        2: 0,
        1: 0,
      },
      cashAmount: rameshCash,
      onlineAmount: rameshOnline,
      onlineMode: 'UPI',
      totalAmount: rameshTotal,
      profitPct: 7,
      profitAmount: rameshProfit,
      expectedCollection: 15000,
      difference: rameshTotal - 15000,
      status: 'submitted',
      createdAt: new Date(d).toISOString(),
    });

    // Entry for Mahesh
    const maheshCash = 11000 + Math.floor(Math.random() * 4000);
    const maheshOnline = 5000 + Math.floor(Math.random() * 2500);
    const maheshTotal = maheshCash + maheshOnline;
    const maheshProfit = Math.round(maheshTotal * 0.07);

    entries.push({
      id: `entry-m-${i}`,
      salesmanId: 's2',
      salesmanName: 'Mahesh Shah (મહેશ)',
      routeId: 'r2',
      routeName: 'Ahmedabad West (અમદાવાદ વેસ્ટ)',
      date: dateStr,
      cashBreakdown: {
        500: Math.floor(maheshCash * 0.7 / 500),
        200: Math.floor(maheshCash * 0.15 / 200),
        100: Math.floor(maheshCash * 0.1 / 100),
        50: 10,
        20: 0,
        10: 0,
        5: 0,
        2: 0,
        1: 0,
      },
      cashAmount: maheshCash,
      onlineAmount: maheshOnline,
      onlineMode: 'UPI',
      totalAmount: maheshTotal,
      profitPct: 7,
      profitAmount: maheshProfit,
      expectedCollection: 18000,
      difference: maheshTotal - 18000,
      status: 'submitted',
      createdAt: new Date(d).toISOString(),
    });
  }

  // Pre-populate Today's entry for Mahesh so we see 1 completed and 1 pending on admin dashboard!
  const todayStr = getTodayDateString();
  entries.unshift({
    id: `entry-m-today`,
    salesmanId: 's2',
    salesmanName: 'Mahesh Shah (મહેશ)',
    routeId: 'r2',
    routeName: 'Ahmedabad West (અમદાવાદ વેસ્ટ)',
    date: todayStr,
    cashBreakdown: {
      500: 24,
      200: 15,
      100: 20,
      50: 10,
      20: 25,
      10: 0,
      5: 0,
      2: 0,
      1: 0,
    },
    cashAmount: 17500,
    onlineAmount: 4500,
    onlineMode: 'UPI',
    totalAmount: 22000,
    profitPct: 7,
    profitAmount: 1540,
    expectedCollection: 18000,
    difference: 4000,
    status: 'submitted',
    createdAt: new Date().toISOString(),
  });

  return entries;
};

export const initialEntries: HisabEntry[] = generatePastEntries();
