import type { Salesman, Route, HisabEntry, AppSettings } from '../types';

const API_BASE_URL = '/api';

export const apiClient = {
  // Check Backend Health & MongoDB status
  checkHealth: async (): Promise<{ dbConnected: boolean; status: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return { dbConnected: false, status: 'error' };
      return await res.json();
    } catch {
      return { dbConnected: false, status: 'offline' };
    }
  },

  // Dynamic Auth Operations
  registerSalesman: async (data: { name: string; mobile: string; routeId?: string; pin: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register-salesman`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'સર્વર કનેક્શન એરર!' };
    }
  },

  loginSalesmanApi: async (data: { mobile?: string; salesmanId?: string; pin: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-salesman`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'સર્વર કનેક્શન એરર!' };
    }
  },

  loginAdminApi: async (data: { pin: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch {
      return { success: false, error: 'સર્વર કનેક્શન એરર!' };
    }
  },
  getSalesmen: async (): Promise<Salesman[] | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/salesmen`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createSalesman: async (salesman: Omit<Salesman, 'id'> | Salesman): Promise<Salesman | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/salesmen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesman),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateSalesman: async (id: string, salesman: Partial<Salesman>): Promise<Salesman | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/salesmen/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesman),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Routes
  getRoutes: async (): Promise<Route[] | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/routes`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createRoute: async (route: Omit<Route, 'id'> | Route): Promise<Route | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateRoute: async (id: string, route: Partial<Route>): Promise<Route | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/routes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Entries
  getEntries: async (): Promise<HisabEntry[] | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/entries`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createEntry: async (entry: HisabEntry): Promise<HisabEntry | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateEntry: async (id: string, entry: Partial<HisabEntry>): Promise<HisabEntry | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Settings
  getSettings: async (): Promise<AppSettings | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateSettings: async (settings: Partial<AppSettings>): Promise<AppSettings | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // Pending Payments (Customer Outstanding Cash)
  getPendingPayments: async (): Promise<any[] | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/pending-payments`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  createPendingPayment: async (item: any): Promise<any | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/pending-payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updatePendingPayment: async (id: string, updated: any): Promise<any | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/pending-payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
