import type { Salesman, Route, HisabEntry, AppSettings } from '../types';

export const initialAppSettings: AppSettings = {
  businessName: 'Ruhi Sales',
  subtitle: 'Authorized Distributor - Namkeen & Foods',
  defaultProfitPct: 7,
  allowSalesmanProfitOverride: true,
  language: 'gu',
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

// Empty entries list for clean live production launch
export const initialEntries: HisabEntry[] = [];
